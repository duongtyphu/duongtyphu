"use client";

/**
 * Companion Presence (Sprint 8.2 — Nhiệm vụ 03; nâng cấp Sprint 8.3).
 * Một sự hiện diện ấm áp, không phải nút chat nổi kiểu support widget.
 * Luôn ở đó, rất tinh tế, không tự popup, không badge thông báo. Bấm vào
 * để mở `CompanionSpace`.
 *
 * Sprint 8.3 bổ sung: asset thật (CompanionAvatar), kích thước lớn hơn và
 * responsive theo breakpoint, safe zone theo thiết bị, floating/anchored
 * motion, thu nhỏ khi scroll nhanh, tránh che bàn phím mobile, nút
 * minimize rõ ràng. Xem `docs/design/companion/Companion_Guidelines.md`.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { CompanionAvatar } from "@/components/portal/companion/CompanionAvatar";
import { getStateForPath, displayName } from "@/lib/portal/companion/companion-identity";
import { CompanionSpace } from "@/components/portal/companion/CompanionSpace";

/**
 * Route dùng nhiều input/form (gõ nhiều) → anchored, đứng yên hẳn để
 * không gây phân tâm. Các route khác → floating, trôi nhẹ trong vùng an
 * toàn ở góc dưới phải.
 */
const ANCHORED_ROUTE_PREFIXES = ["/portal/ai-assistant"];

export function CompanionPresence() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [scrollShrink, setScrollShrink] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const lastScrollY = useRef(0);
  const shrinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const state = getStateForPath(pathname ?? "/portal");
  const motionMode = ANCHORED_ROUTE_PREFIXES.some((prefix) => pathname?.startsWith(prefix))
    ? "anchored"
    : "floating";

  // Nhiệm vụ 04 — thu nhỏ nhẹ khi scroll xuống nhanh, hiện lại khi đứng yên.
  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      if (delta > 18) {
        setScrollShrink(true);
        if (shrinkTimeout.current) clearTimeout(shrinkTimeout.current);
        shrinkTimeout.current = setTimeout(() => setScrollShrink(false), 650);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (shrinkTimeout.current) clearTimeout(shrinkTimeout.current);
    };
  }, []);

  // Nhiệm vụ 04 — tránh che input khi bàn phím mobile mở (visualViewport co lại đáng kể).
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const baseHeight = viewport.height;
    function handleResize() {
      const shrunk = baseHeight - (window.visualViewport?.height ?? baseHeight) > 140;
      setKeyboardOpen(shrunk);
    }
    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }, []);

  if (keyboardOpen && !open) return null;

  if (minimized && !open) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        aria-label={`Hiện lại ${displayName}`}
        className="fixed bottom-4 right-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#0B1F4D]/90 text-white/60 shadow-lg backdrop-blur transition hover:text-white sm:bottom-[18px] sm:right-[18px] lg:bottom-6 lg:right-6"
      >
        <ChevronDown className="h-4 w-4 rotate-180" />
      </button>
    );
  }

  return (
    <>
      <div
        className={`fixed bottom-4 right-4 z-40 sm:bottom-[18px] sm:right-[18px] lg:bottom-6 lg:right-6 ${
          motionMode === "floating" ? "companion-presence--floating" : ""
        } ${scrollShrink ? "companion-presence--scrolling" : ""}`}
        style={{ transition: "transform 0.3s ease-out, opacity 0.3s ease-out" }}
      >
        <div className="group relative flex items-end gap-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`${displayName} — ${state.label}. ${state.line}`}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex items-center justify-center rounded-full transition hover:scale-[1.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
          >
            <CompanionAvatar
              state={state.key}
              className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
              size={48}
            />
          </button>

          <button
            type="button"
            onClick={() => setMinimized(true)}
            aria-label={`Thu nhỏ ${displayName}`}
            className="mb-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0B1F4D]/80 text-white/40 opacity-0 transition hover:text-white/80 focus:opacity-100 focus:outline-none group-hover:opacity-100"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {open && (
        <CompanionSpace
          state={state}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
