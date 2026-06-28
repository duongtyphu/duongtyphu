"use client";

/**
 * Companion Micro-Reaction Bubble (Sprint 13.3 — Soulful Micro-Reactions,
 * Nhiệm vụ 03/06). Hiển thị một micro-line rất ngắn ngay sau một cú
 * chạm/click, rồi tự ẩn sau vài giây — không cần nút đóng, không phải một
 * thông báo. Xem `docs/COMPANION_SOULFUL_REACTIONS.md`.
 */

import { useEffect, useState } from "react";

const AUTO_HIDE_MS = 3000;

export function CompanionMicroReactionBubble({
  line,
  onDismiss,
}: {
  line: string;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 0);
    const hideTimer = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [line]);

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
      className={`companion-micro-reaction-bubble pointer-events-none absolute bottom-full right-0 mb-3 w-[min(70vw,210px)] rounded-2xl border border-white/10 bg-[#0B1F4D]/90 px-3.5 py-2 text-left text-xs leading-snug text-white/85 shadow-lg backdrop-blur transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      {line}
    </div>
  );
}
