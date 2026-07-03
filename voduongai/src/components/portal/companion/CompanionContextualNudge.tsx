"use client";

/**
 * Companion Presence — Contextual Nudge (Sprint "Companion Presence Fix").
 * Một câu ngắn, chủ động, đúng ngữ cảnh khu vực Portal hiện tại — không phải
 * chatbot, không lặp lại trong cùng một session, không che nội dung/CTA
 * chính. Người dùng có thể đóng ngay, hoặc tắt hẳn nudge từ đây.
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { RouteContext } from "@/lib/portal/companion/route-context";
import { setNudgeDisabled } from "@/lib/portal/companion/nudge-session";

const SHOW_DELAY_MS = 1400;
const AUTO_HIDE_MS = 7000;

export function CompanionContextualNudge({
  routeContext,
  onDismiss,
}: {
  routeContext: RouteContext;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(onDismiss, AUTO_HIDE_MS);
    return () => clearTimeout(hideTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="companion-greeting-bubble pointer-events-auto absolute bottom-full right-0 mb-3 w-[min(80vw,270px)] rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-left text-sm leading-relaxed text-gray-800 shadow-xl backdrop-blur"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Đóng gợi ý"
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-700 focus:outline-none"
      >
        <X className="h-3 w-3" />
      </button>
      <p className="pr-4">{routeContext.nudge}</p>
      <button
        type="button"
        onClick={() => {
          setNudgeDisabled(true);
          onDismiss();
        }}
        className="mt-2 text-xs font-medium text-gray-400 underline-offset-2 transition hover:text-gray-600 hover:underline"
      >
        Không hiện gợi ý này nữa
      </button>
    </div>
  );
}
