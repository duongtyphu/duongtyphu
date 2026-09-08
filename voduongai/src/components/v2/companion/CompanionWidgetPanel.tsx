"use client";

/**
 * Panel chat của Companion nổi — Portal 2.0 THUẦN, không còn import bất kỳ
 * gì từ `src/components/portal/companion/*` (Portal 1.0). Trước đây widget
 * dùng `CompanionFloatingChat`/`CompanionChatShell` (1.0) — theo đúng chỉ
 * đạo Founder ("Companion ở Menu và Companion nổi là MỘT, phải chuyển hẳn
 * sang Portal 2.0, không liên quan Portal 1.0 vì 1.0 sẽ bị xoá"), toàn bộ
 * UI chat giờ dùng chung `useCompanionChat()`/`CompanionChatArea` với
 * `/v2/companion` (trang đầy đủ) — cùng 1 bộ logic, cùng 1 bộ CSS
 * (`.comp`, `companion.css`).
 *
 * Sửa kèm bug "khung đôi" — `.comp .chat-input-row` chỉ có ĐÚNG 1 viền
 * quanh cả hàng nhập liệu (khác `CompanionComposer.tsx` 1.0: viền ngoài
 * của khung composer LỒNG thêm viền trong quanh riêng ô nhập).
 *
 * Panel LUÔN được giữ MOUNTED sau lần mở đầu tiên (`CompanionWidget.tsx`
 * chỉ toggle `visible`, không unmount/remount) — giữ nguyên trạng thái
 * hội thoại (kể cả tin nhắn vừa gửi) khi đóng/mở lại trong cùng phiên,
 * không phụ thuộc việc `initialMessages` (prefetch 1 lần lúc trang tải)
 * có kịp cập nhật lại hay không.
 */

import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { LivingCore } from "@/components/LivingCore";
import { useCompanionChat } from "@/lib/v2/companion/useCompanionChat";
import { CompanionChatArea } from "@/components/v2/companion/CompanionChatArea";
import type { CompanionMessageRow } from "@/app/portal/companion/actions";

import "@/app/v2/inter-gf.css";
import "@/app/v2/companion/companion.css";
import "./companion-widget-panel.css";

export function CompanionWidgetPanel({
  visible,
  onClose,
  initialConversationId,
  initialMessages,
  fullPageHref,
}: {
  visible: boolean;
  onClose: () => void;
  initialConversationId: string | null;
  initialMessages: CompanionMessageRow[];
  fullPageHref: string;
}) {
  const chat = useCompanionChat({ initialConversationId, initialMessages });
  const [entered, setEntered] = useState(false);

  // Reset hiệu ứng vào-cảnh ngay khi `visible` chuyển sang `false` — "điều
  // chỉnh state theo prop đổi" NGAY TRONG lượt render (cùng pattern
  // `prevPath` ở `CompanionWidget.tsx`), tránh gọi `setState` đồng bộ
  // trong effect (cảnh báo `react-hooks/set-state-in-effect`).
  const [prevVisible, setPrevVisible] = useState(visible);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (!visible) setEntered(false);
  }

  useEffect(() => {
    if (!visible) return;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-end p-0 sm:p-6 ${visible ? "" : "invisible pointer-events-none"}`}
      role="presentation"
      aria-hidden={!visible}
    >
      <button
        type="button"
        aria-label="Đóng Companion"
        onClick={onClose}
        tabIndex={visible ? 0 : -1}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 sm:bg-black/20 ${
          visible && entered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Companion — trò chuyện"
        className={`comp cwp relative z-10 flex h-[85vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_24px_70px_rgba(24,16,60,0.28)] transition-all duration-200 ease-out sm:h-[620px] sm:w-[400px] sm:rounded-[22px] ${
          visible && entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="cwp-header">
          <div className="cwp-header-avatar">
            <LivingCore size={32} state="idle" intensity="low" />
          </div>
          <div className="cwp-header-text">
            <div className="cwp-header-title">Companion</div>
            <div className="cwp-header-status">
              <span className="cwp-status-dot" /> Đang hoạt động
            </div>
          </div>
          <a href={fullPageHref} className="cwp-header-btn" aria-label="Mở Companion đầy đủ" title="Mở Companion đầy đủ">
            <ExternalLink size={15} />
          </a>
          <button type="button" onClick={onClose} className="cwp-header-btn" aria-label="Đóng Companion">
            <X size={16} />
          </button>
        </div>

        <div className="chat-card cwp-chat-card">
          <CompanionChatArea
            messages={chat.messages}
            sending={chat.sending}
            error={chat.error}
            copiedId={chat.copiedId}
            memorySuggestion={chat.memorySuggestion}
            memorySaveState={chat.memorySaveState}
            input={chat.input}
            onInputChange={chat.setInput}
            onSend={chat.send}
            onStop={chat.stop}
            onCopy={chat.copyMessage}
            onRetry={chat.retry}
            onSaveMemory={chat.handleSaveMemory}
            onDismissMemory={chat.handleDismissMemory}
            bottomRef={chat.bottomRef}
            showChips={false}
            compact
          />
        </div>
      </div>
    </div>
  );
}
