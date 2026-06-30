"use client";

/**
 * Companion Thought Bubble (Sprint 13.1 — Companion Proactive Thoughts,
 * Nhiệm vụ 04). Hiển thị một `CompanionThought` được `proactive-thought-
 * engine.ts` chọn — nhỏ, nhẹ, ấm, gần Companion. Không giống quảng cáo,
 * không giống chat support: không icon "!", không màu đỏ, không khung to,
 * không nút "Trả lời ngay".
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CompanionThought } from "@/lib/portal/companion/proactive-thoughts";

const AUTO_HIDE_MS = 7000;

export function CompanionThoughtBubble({
  thought,
  onDismiss,
  onPauseSession,
}: {
  thought: CompanionThought;
  onDismiss: () => void;
  /** NV07 — người dùng có thể tạm ẩn proactive thoughts cho phần còn lại của session từ chính bubble. */
  onPauseSession?: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 0);
    const hideTimer = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [thought.id]);

  useEffect(() => {
    if (visible) return;
    const cleanupTimer = setTimeout(onDismiss, 250);
    return () => clearTimeout(cleanupTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`companion-thought-bubble pointer-events-auto absolute bottom-full right-0 mb-3 w-[min(78vw,250px)] rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-left text-sm leading-snug text-gray-800 shadow-xl backdrop-blur transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Đóng"
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-700 focus:outline-none"
      >
        <X className="h-3 w-3" />
      </button>
      <p className="pr-4">{thought.line}</p>
      {onPauseSession ? (
        <button
          type="button"
          onClick={onPauseSession}
          className="mt-2 text-[11px] text-gray-400 underline-offset-2 transition hover:text-gray-600 hover:underline focus:outline-none"
        >
          Tạm ẩn trong phiên này
        </button>
      ) : null}
    </div>
  );
}
