"use client";

/**
 * Companion Greeting Bubble (Sprint 8.5 — Nhiệm vụ 05/07). Lời chào đầu
 * tiên khi vào Portal — không lặp lại ở mỗi lần đổi route trong cùng một
 * session, tự ẩn sau vài giây, không che nội dung chính. Nếu người dùng
 * quay lại sau nhiều ngày (`COMEBACK_GAP_MS`), dùng lời chào "mừng gặp
 * lại" thay cho lời chào lần đầu/theo route.
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getRouteGreeting } from "@/lib/portal/companion/companion-identity";

const SESSION_SHOWN_KEY = "companion-greeting-shown-session";
const LAST_VISIT_KEY = "companion-last-visit";
const COMEBACK_GAP_MS = 1000 * 60 * 60 * 24 * 2; // 2 ngày không vào lại → "mừng gặp lại"

const SHOW_DELAY_MS = 1500;
const AUTO_HIDE_MS = 5000;

const FIRST_TIME_GREETING =
  "Chào bạn. Mình sẽ đồng hành cùng bạn trong hành trình này.";
const COMEBACK_GREETING = "Mình rất vui vì lại được gặp bạn.";

export function CompanionGreetingBubble({
  pathname,
  brainGreeting,
}: {
  pathname: string;
  brainGreeting?: string | null;
}) {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let shownAlready = false;
    try {
      shownAlready = window.sessionStorage.getItem(SESSION_SHOWN_KEY) === "1";
    } catch {
      // bỏ qua nếu sessionStorage không khả dụng
    }
    if (shownAlready) return;

    let isComeback = false;
    let hasVisitedBefore = false;
    try {
      const lastVisit = window.localStorage.getItem(LAST_VISIT_KEY);
      if (lastVisit) {
        hasVisitedBefore = true;
        const gap = Date.now() - Number(lastVisit);
        isComeback = gap >= COMEBACK_GAP_MS;
      }
      window.localStorage.setItem(LAST_VISIT_KEY, String(Date.now()));
    } catch {
      // bỏ qua nếu localStorage không khả dụng
    }

    const text = isComeback
      ? COMEBACK_GREETING
      : hasVisitedBefore
        ? brainGreeting ?? getRouteGreeting(pathname) ?? FIRST_TIME_GREETING
        : FIRST_TIME_GREETING;

    const showTimer = setTimeout(() => {
      setGreeting(text);
      setVisible(true);
      try {
        window.sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
      } catch {
        // bỏ qua nếu sessionStorage không khả dụng
      }
    }, SHOW_DELAY_MS);

    return () => clearTimeout(showTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  if (!greeting || !visible) return null;

  return (
    <div
      role="status"
      className="companion-greeting-bubble pointer-events-auto absolute bottom-full right-0 mb-3 w-[min(78vw,260px)] rounded-2xl border border-white/15 bg-[#0B1F4D]/95 px-4 py-3 text-left text-sm leading-snug text-white/90 shadow-xl backdrop-blur"
    >
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Đóng lời chào"
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white/40 transition hover:text-white/80 focus:outline-none"
      >
        <X className="h-3 w-3" />
      </button>
      <p className="pr-4">{greeting}</p>
    </div>
  );
}
