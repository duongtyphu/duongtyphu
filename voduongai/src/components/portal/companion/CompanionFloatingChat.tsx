"use client";

/**
 * Floating Companion Chat (EPIC-CS-001 — Companion Chat Consolidation).
 * Panel Chat AI thu nhỏ, mở từ `CompanionPresence` trên MỌI trang Portal —
 * không reload trang, không điều hướng URL nền (xem `CompanionChatShell`'s
 * `variant="compact"`). Tái dùng NGUYÊN `CompanionChatShell`/
 * `CompanionMessageList`/`CompanionComposer`/2 Server Action đã có từ
 * Companion Chat MVP (`/portal/companion`) — không xây hệ chat song song.
 *
 * Cùng kích thước/vị trí mở (góc dưới phải desktop, sheet toàn màn hình
 * mobile) như `CompanionSpace` để nhất quán UX giữa 2 surface.
 */

import { useEffect, useRef, useState } from "react";
import { CompanionChatShell } from "./chat/CompanionChatShell";
import { listConversations, getConversationMessages } from "@/app/portal/companion/actions";
import type { CompanionConversationSummary, CompanionMessageRow } from "@/app/portal/companion/actions";

export function CompanionFloatingChat({
  onClose,
  onOpenSpace,
}: {
  onClose: () => void;
  /** Optional — Portal 2.0's `CompanionWidget` không truyền (bỏ hẳn nút "Mở
      Không gian Companion", trải nghiệm kịch bản cũ chỉ có ở 1.0). */
  onOpenSpace?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<CompanionConversationSummary[]>([]);
  const [initialConversationId, setInitialConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<CompanionMessageRow[]>([]);
  const closeButtonFocusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const rows = await listConversations();
      if (cancelled) return;
      // Tiếp tục hội thoại gần nhất nếu có — khác `/portal/companion` (mặc
      // định trang mới khi vào không kèm `?c=`), vì panel nổi là lối vào
      // nhanh giữa lúc đang làm việc, tiếp tục mạch cũ hợp lý hơn.
      const mostRecent = rows[0] ?? null;
      setConversations(rows);
      setInitialConversationId(mostRecent?.id ?? null);
      if (mostRecent) {
        const msgs = await getConversationMessages(mostRecent.id);
        if (!cancelled) setInitialMessages(msgs);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-0 sm:p-6" role="presentation">
      <button
        type="button"
        aria-label="Đóng Companion"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 sm:bg-black/20"
      />
      <div
        ref={closeButtonFocusRef}
        role="dialog"
        aria-modal="true"
        aria-label="Companion — trò chuyện"
        className="relative z-10 flex h-[85vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-gray-200 bg-white shadow-2xl sm:h-[600px] sm:w-[400px] sm:rounded-2xl"
      >
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">Đang tải Companion...</div>
        ) : (
          <CompanionChatShell
            variant="compact"
            conversations={conversations}
            initialConversationId={initialConversationId}
            initialMessages={initialMessages}
            onOpenSpace={onOpenSpace}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
