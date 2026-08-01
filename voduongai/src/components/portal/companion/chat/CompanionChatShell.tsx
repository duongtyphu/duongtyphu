"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { History, X } from "lucide-react";
import { CompanionSidebar } from "./CompanionSidebar";
import { CompanionMessageList } from "./CompanionMessageList";
import { CompanionComposer } from "./CompanionComposer";
import type { ChatMessage } from "./types";
import {
  listConversations,
  getConversationMessages,
  renameConversation,
  deleteConversation,
  type CompanionConversationSummary,
  type CompanionMessageRow,
} from "@/app/portal/companion/actions";
import { buildConversationTitle } from "@/lib/portal/companion-chat";

function toChatMessage(row: CompanionMessageRow): ChatMessage {
  return { id: row.id, role: row.role === "assistant" ? "assistant" : "user", content: row.content, createdAt: row.createdAt };
}

export function CompanionChatShell({
  conversations: initialConversations,
  initialConversationId,
  initialMessages,
}: {
  conversations: CompanionConversationSummary[];
  initialConversationId: string | null;
  initialMessages: CompanionMessageRow[];
}) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(initialConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages.map(toChatMessage));
  const [composerValue, setComposerValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const refreshConversations = useCallback(async () => {
    setConversations(await listConversations());
  }, []);

  async function handleSelectConversation(id: string) {
    setDrawerOpen(false);
    if (id === activeId) return;
    setActiveId(id);
    setErrorMessage(null);
    router.push(`/portal/companion?c=${id}`, { scroll: false });
    const rows = await getConversationMessages(id);
    setMessages(rows.map(toChatMessage));
  }

  function handleNewConversation() {
    setDrawerOpen(false);
    setActiveId(null);
    setMessages([]);
    setErrorMessage(null);
    router.push("/portal/companion", { scroll: false });
  }

  async function handleRename(id: string, newTitle: string) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c)));
    await renameConversation(id, newTitle);
  }

  async function handleDelete(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (id === activeId) {
      setActiveId(null);
      setMessages([]);
      router.push("/portal/companion", { scroll: false });
    }
    await deleteConversation(id);
  }

  async function handleSend(text: string) {
    setErrorMessage(null);
    setComposerValue("");

    const optimisticUser: ChatMessage = {
      id: `pending-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...prev, optimisticUser]);

    const isNewConversation = !activeId;
    if (isNewConversation) {
      // Xem trước tiêu đề ngay trong sidebar — sẽ đồng bộ lại với server
      // qua refreshConversations() sau khi có conversationId thật.
      setConversations((prev) => [
        { id: "pending-new", title: buildConversationTitle(text), updatedAt: new Date().toISOString() },
        ...prev,
      ]);
    }

    setIsGenerating(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, message: text }),
        signal: controller.signal,
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(typeof data?.error === "string" ? data.error : "Companion chưa thể phản hồi lúc này. Vui lòng thử lại.");
        if (data?.userMessage) {
          setMessages((prev) => prev.map((m) => (m.id === optimisticUser.id ? toChatMessage(data.userMessage) : m)));
        }
        if (data?.conversationId && !activeId) {
          setActiveId(data.conversationId);
          router.push(`/portal/companion?c=${data.conversationId}`, { scroll: false });
        }
        await refreshConversations();
        return;
      }

      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticUser.id);
        return [...withoutOptimistic, toChatMessage(data.userMessage), toChatMessage(data.assistantMessage)];
      });

      if (!activeId) {
        setActiveId(data.conversationId);
        router.push(`/portal/companion?c=${data.conversationId}`, { scroll: false });
      }
      await refreshConversations();
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        setErrorMessage("Đã dừng phản hồi.");
      } else {
        setErrorMessage("Không thể kết nối tới Companion. Kiểm tra mạng và thử lại.");
        // Trả lại nội dung vào composer để không mất tin nhắn khi lỗi mạng
        // xảy ra TRƯỚC khi tới được server (khác lỗi server đã trả về ở trên).
        setComposerValue(text);
      }
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUser.id));
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white/70 backdrop-blur md:block">
        <CompanionSidebar
          conversations={conversations}
          activeConversationId={activeId}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      </aside>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Đóng lịch sử trò chuyện"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
              <span className="text-sm font-bold text-gray-900">Lịch sử trò chuyện</span>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <CompanionSidebar
              conversations={conversations}
              activeConversationId={activeId}
              onSelect={handleSelectConversation}
              onNew={handleNewConversation}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      {/* Khu vực trò chuyện chính */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-gray-200 bg-white/70 px-4 py-2.5 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Mở lịch sử trò chuyện"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500"
          >
            <History className="h-4 w-4" />
          </button>
          <span className="truncate text-sm font-semibold text-gray-800">
            {conversations.find((c) => c.id === activeId)?.title ?? "Companion"}
          </span>
        </div>

        <CompanionMessageList
          messages={messages}
          isGenerating={isGenerating}
          errorMessage={errorMessage}
          onStarterClick={setComposerValue}
        />

        <CompanionComposer
          isGenerating={isGenerating}
          onSend={handleSend}
          onStop={handleStop}
          value={composerValue}
          onValueChange={setComposerValue}
        />
      </div>
    </div>
  );
}
