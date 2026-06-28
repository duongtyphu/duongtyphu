"use client";

/**
 * Companion Presence (Sprint 8.2 — Nhiệm vụ 03; nâng cấp Sprint 8.3,
 * Sprint 8.3.1: nền trong suốt thật + tăng size 20% + kéo-thả tự do).
 * Một sự hiện diện ấm áp, không phải nút chat nổi kiểu support widget.
 * Luôn ở đó, rất tinh tế, không tự popup, không badge thông báo. Bấm vào
 * để mở `CompanionSpace`.
 *
 * Sprint 8.3 bổ sung: asset thật (CompanionAvatar), kích thước lớn hơn và
 * responsive theo breakpoint, safe zone theo thiết bị, floating/anchored
 * motion, thu nhỏ khi scroll nhanh, tránh che bàn phím mobile, nút
 * minimize rõ ràng. Xem `docs/design/companion/Companion_Guidelines.md`.
 *
 * Sprint 8.3.1: người dùng có thể kéo Companion tới bất kỳ vị trí nào
 * trên màn hình (không còn cố định góc dưới phải) — vị trí được nhớ lại
 * giữa các lần xem (localStorage), luôn được giữ trong vùng nhìn thấy.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { CompanionAvatar } from "@/components/portal/companion/CompanionAvatar";
import { displayName, states } from "@/lib/portal/companion/companion-identity";
import { CompanionSpace } from "@/components/portal/companion/CompanionSpace";
import { CompanionNest } from "@/components/portal/companion/CompanionNest";
import { CompanionGreetingBubble } from "@/components/portal/companion/CompanionGreetingBubble";
import { getCompanionDecision } from "@/lib/portal/intelligence/portal-brain";
import {
  readStoredGardenStage,
  subscribeToGardenStage,
} from "@/lib/portal/intelligence/portal-signals";
import type { GardenStage } from "@/lib/portal/living-garden/garden-model";

const MINIMIZED_STORAGE_KEY = "companion-presence-minimized";

/**
 * Route dùng nhiều input/form (gõ nhiều) → anchored, đứng yên hẳn để
 * không gây phân tâm. Các route khác → floating, trôi nhẹ quanh vị trí
 * hiện tại (người dùng có thể kéo Companion tới bất kỳ đâu).
 */
const ANCHORED_ROUTE_PREFIXES = ["/portal/ai-assistant"];

const POSITION_STORAGE_KEY = "companion-presence-position";
const SAFE_MARGIN = 12;
const DRAG_THRESHOLD = 6;

function getAvatarBoxSize() {
  if (typeof window === "undefined") return 58;
  const width = window.innerWidth;
  if (width >= 1024) return 58;
  if (width >= 640) return 48;
  return 43;
}

function clampPosition(x: number, y: number, box: number) {
  if (typeof window === "undefined") return { x, y };
  const maxX = Math.max(window.innerWidth - box - SAFE_MARGIN, SAFE_MARGIN);
  const maxY = Math.max(window.innerHeight - box - SAFE_MARGIN, SAFE_MARGIN);
  return {
    x: Math.min(Math.max(x, SAFE_MARGIN), maxX),
    y: Math.min(Math.max(y, SAFE_MARGIN), maxY),
  };
}

function getInitialPosition(): { x: number; y: number } | null {
  if (typeof window === "undefined") return null;
  const box = getAvatarBoxSize();
  try {
    const saved = window.localStorage.getItem(POSITION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as { x: number; y: number };
      if (typeof parsed.x === "number" && typeof parsed.y === "number") {
        return clampPosition(parsed.x, parsed.y, box);
      }
    }
  } catch {
    // bỏ qua nếu localStorage không khả dụng hoặc dữ liệu hỏng
  }
  return clampPosition(window.innerWidth - box - 16, window.innerHeight - box - 16, box);
}

export function CompanionPresence() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(MINIMIZED_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [scrollShrink, setScrollShrink] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(getInitialPosition);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [comeback, setComeback] = useState(false);
  const [gardenStage, setGardenStage] = useState<GardenStage | undefined>(() =>
    readStoredGardenStage()
  );
  const lastScrollY = useRef(0);
  const shrinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragState = useRef({ startX: 0, startY: 0, originX: 0, originY: 0, moved: false });

  useEffect(() => {
    return subscribeToGardenStage(setGardenStage);
  }, []);

  const decision = getCompanionDecision({ pathname: pathname ?? "/portal", gardenStage });
  const state = open ? states.listening : comeback ? states.comeback : decision.companionState;
  const motionMode = ANCHORED_ROUTE_PREFIXES.some((prefix) => pathname?.startsWith(prefix))
    ? "anchored"
    : "floating";

  // Kẹp lại vị trí mỗi khi resize cửa sổ (vị trí khởi điểm đã có ngay từ
  // lazy initializer của useState, không cần set lại ở đây).
  useEffect(() => {
    function handleResize() {
      setPosition((prev) => (prev ? clampPosition(prev.x, prev.y, getAvatarBoxSize()) : prev));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  function handlePointerDown(e: React.PointerEvent) {
    if (!position) return;
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      dragState.current.moved = true;
    }
    const box = getAvatarBoxSize();
    setPosition(clampPosition(dragState.current.originX + dx, dragState.current.originY + dy, box));
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    setSettling(true);
    setTimeout(() => setSettling(false), 450);
    setPosition((prev) => {
      if (prev) {
        try {
          window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(prev));
        } catch {
          // bỏ qua nếu localStorage không khả dụng
        }
      }
      return prev;
    });
  }

  function handleAvatarClick() {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }
    setPulsing(true);
    setTimeout(() => setPulsing(false), 500);
    setComeback(false);
    setOpen(true);
  }

  function handleCloseSpace() {
    setOpen(false);
    setComeback(true);
    setTimeout(() => setComeback(false), 5000);
  }

  function handleMinimize(value: boolean) {
    setMinimized(value);
    try {
      window.localStorage.setItem(MINIMIZED_STORAGE_KEY, value ? "1" : "0");
    } catch {
      // bỏ qua nếu localStorage không khả dụng
    }
  }

  if (keyboardOpen && !open) return null;
  if (!position) return null;

  if (minimized && !open) {
    return (
      <div
        className="fixed z-40 select-none"
        style={{ left: position.x, top: position.y }}
      >
        <div className="relative flex h-9 w-9 items-center justify-center">
          <CompanionNest minimized />
          <button
            type="button"
            onClick={() => handleMinimize(false)}
            aria-label={`Hiện lại ${displayName}`}
            className="companion-avatar-button relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#0B1F4D]/90 text-white/60 shadow-lg backdrop-blur transition hover:text-white"
          >
            <ChevronDown className="h-4 w-4 rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`fixed z-40 select-none touch-none ${
          motionMode === "floating" && !dragging ? "companion-presence--floating" : ""
        } ${scrollShrink ? "companion-presence--scrolling" : ""} ${
          settling ? "companion-presence--drag-settle" : ""
        }`}
        style={{
          left: position.x,
          top: position.y,
          transition: dragging ? "none" : "opacity 0.3s ease-out",
        }}
      >
        <div className="group relative flex items-end gap-1">
          <CompanionGreetingBubble
            pathname={pathname ?? "/portal"}
            brainGreeting={decision.companionGreeting}
          />

          <div className="relative flex items-center justify-center">
            <CompanionNest dragging={dragging} active={dragging} />
            <button
              type="button"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onClick={handleAvatarClick}
              aria-label={`${displayName} — ${state.label}. ${state.line}. Có thể kéo tới vị trí khác.`}
              aria-haspopup="dialog"
              aria-expanded={open}
              className={`companion-avatar-button relative flex cursor-grab items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 active:cursor-grabbing ${
                pulsing ? "companion-avatar-button--pulse" : ""
              }`}
            >
              <CompanionAvatar
                state={state.key}
                className="h-[43px] w-[43px] sm:h-12 sm:w-12 lg:h-[58px] lg:w-[58px]"
                size={58}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleMinimize(true)}
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
          onClose={handleCloseSpace}
          insight={decision.companionInsight}
        />
      )}
    </>
  );
}
