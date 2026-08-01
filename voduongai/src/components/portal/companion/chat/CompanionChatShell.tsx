"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { History, X, Sparkles, ExternalLink } from "lucide-react";
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

/**
 * `variant="compact"` — dùng cho Floating Companion (`CompanionFloatingChat.tsx`,
 * EPIC-CS-001). Khác `variant="full"` (mặc định, `/portal/companion`) ở 3
 * điểm: (1) ẩn hẳn sidebar desktop — panel nổi quá hẹp để chứa 256px sidebar
 * bên cạnh khung chat; (2) KHÔNG gọi `router.push()` khi đổi/tạo hội thoại —
 * panel nổi là widget ephemeral trên MỌI trang Portal, đổi URL nền sẽ điều
 * hướng cả trang đang xem, không đúng ý; (3) thanh header (drawer/lịch sử)
 * luôn hiện thay vì chỉ `md:hidden`, kèm nút "Mở đầy đủ"/"Không gian
 * Companion"/Đóng — panel nổi nhỏ nên không có chỗ hiện sidebar cố định.
 */
export function CompanionChatShell({
  conversations: initialConversations,
  initialConversationId,
  initialMessages,
  variant = "full",
  onOpenSpace,
  onClose,
}: {
  conversations: CompanionConversationSummary[];
  initialConversationId: string | null;
  initialMessages: CompanionMessageRow[];
  variant?: "full" | "compact";
  /** Chỉ dùng khi `variant="compact"` — mở lại CompanionSpace (lựa chọn phụ). */
  onOpenSpace?: () => void;
  /** Chỉ dùng khi `variant="compact"` — đóng panel nổi. */
  onClose?: () => void;
}) {
  const compact = variant === "compact";
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
    if (!compact) router.push(`/portal/companion?c=${id}`, { scroll: false });
    const rows = await getConversationMessages(id);
    setMessages(rows.map(toChatMessage));
  }

  function handleNewConversation() {
    setDrawerOpen(false);
    setActiveId(null);
    setMessages([]);
    setErrorMessage(null);
    if (!compact) router.push("/portal/companion", { scroll: false });
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
      if (!compact) router.push("/portal/companion", { scroll: false });
    }
    await deleteConversation(id);
  }

  async function handleSend(text: string) {
    setErrorMessage(null);
    setComposerValue("");

    // Offline — kiểm tra ngay tại điểm hành động, không cần lắng nghe
    // sự kiện online/offline toàn cục (đúng mức tối giản đã dùng xuyên
    // suốt dự án cho các guard tương tự).
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setErrorMessage("Bạn đang ngoại tuyến — kiểm tra kết nối mạng và thử lại.");
      return;
    }

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
        const friendly =
          res.status === 429
            ? "Companion đang xử lý nhiều yêu cầu cùng lúc — vui lòng chờ một chút rồi thử lại."
            : typeof data?.error === "string"
              ? data.error
              : "Companion chưa thể phản hồi lúc này. Vui lòng thử lại.";
        setErrorMessage(friendly);
        if (data?.userMessage) {
          setMessages((prev) => prev.map((m) => (m.id === optimisticUser.id ? toChatMessage(data.userMessage) : m)));
        }
        if (data?.conversationId && !activeId) {
          setActiveId(data.conversationId);
          if (!compact) router.push(`/portal/companion?c=${data.conversationId}`, { scroll: false });
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
        if (!compact) router.push(`/portal/companion?c=${data.conversationId}`, { scroll: false });
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
      {/* Sidebar desktop — ẩn hẳn ở compact (panel nổi không đủ rộng), giữ nguyên ở full */}
      {!compact && (
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
      )}

      {/* Drawer lịch sử (mobile ở full, mọi kích thước ở compact) */}
      {drawerOpen && (
        <div className={`fixed inset-0 z-50 ${compact ? "" : "md:hidden"}`}>
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
        <div
          className={`flex items-center gap-2 border-b border-gray-200 bg-white/70 px-4 py-2.5 backdrop-blur ${compact ? "" : "md:hidden"}`}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Mở lịch sử trò chuyện"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500"
          >
            <History className="h-4 w-4" />
          </button>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800">
            {conversations.find((c) => c.id === activeId)?.title ?? "Companion"}
          </span>
          {compact && (
            <div className="flex shrink-0 items-center gap-1">
              {onOpenSpace && (
                <button
                  type="button"
                  onClick={onOpenSpace}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-500 transition hover:border-blue-300 hover:text-blue-600"
                  title="Mở Không gian Companion (trải nghiệm cũ, không phải chat AI)"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Không gian Companion</span>
                </button>
              )}
              <Link
                href="/portal/companion"
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-500 transition hover:border-blue-300 hover:text-blue-600"
                title="Mở đầy đủ ở /portal/companion"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng Companion"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
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
