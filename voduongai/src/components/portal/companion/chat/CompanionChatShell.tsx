"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { CompanionChatHeader } from "./CompanionChatHeader";
import { CompanionSidebar } from "./CompanionSidebar";
import { CompanionMessageList } from "./CompanionMessageList";
import { CompanionComposer } from "./CompanionComposer";
import { CompanionContextPanel } from "./CompanionContextPanel";
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
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

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

  /** "Hỏi Companion" (Empty State) — focus thẳng composer, không điều hướng. */
  function handleFocusComposer() {
    composerRef.current?.focus();
  }

  /** Message action "Thử lại" — gửi lại đúng nội dung user liền trước làm
      1 lượt mới (không có endpoint "regenerate" nào tồn tại — Conversation/
      API giữ nguyên 100%, đây chỉ là gọi lại `handleSend` đã có sẵn). */
  function handleRetry(text: string) {
    if (isGenerating) return;
    handleSend(text);
  }

  /** Message action "Tiếp tục" — cùng cơ chế trên, gửi 1 lượt mới yêu cầu
      Companion tiếp tục nội dung vừa trả lời. */
  function handleContinue() {
    if (isGenerating) return;
    handleSend("Tiếp tục nội dung phía trên, đừng lặp lại những gì đã nói.");
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
        <CompanionChatHeader
          compact={compact}
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenSpace={compact ? onOpenSpace : undefined}
          onClose={compact ? onClose : undefined}
        />

        <CompanionMessageList
          messages={messages}
          isGenerating={isGenerating}
          errorMessage={errorMessage}
          onFocusComposer={handleFocusComposer}
          onNavigate={compact ? onClose : undefined}
          onRetry={handleRetry}
          onContinue={handleContinue}
        />

        <CompanionComposer
          isGenerating={isGenerating}
          onSend={handleSend}
          onStop={handleStop}
          value={composerValue}
          onValueChange={setComposerValue}
          inputRef={composerRef}
        />
      </div>

      {/* Context Panel (EPIC-UX-002) — chỉ Desktop (lg+), chỉ variant="full"
          (panel nổi compact quá hẹp cho cột thứ 3), ẩn hẳn trên Mobile/Tablet. */}
      {!compact && (
        <aside className="hidden w-72 shrink-0 border-l border-gray-200 bg-white/70 backdrop-blur lg:block">
          <CompanionContextPanel />
        </aside>
      )}
    </div>
  );
}
