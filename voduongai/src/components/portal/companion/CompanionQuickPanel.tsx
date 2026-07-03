"use client";

/**
 * Companion Presence — Quick Panel (Sprint "Companion Presence Fix").
 * Panel nhỏ mở khi bấm vào Companion: lời chào ngắn + tối đa 3 gợi ý hành
 * động theo trang hiện tại + nút "Mở Không gian AI" + nút đóng. Không phải
 * chatbot, không gọi AI — chỉ là điều hướng rule-based theo ngữ cảnh route.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { LivingCore } from "@/components/LivingCore";
import { toLivingCoreState } from "@/lib/portal/companion/living-core-state";
import { displayName, type CompanionState } from "@/lib/portal/companion/companion-identity";
import type { RouteContext } from "@/lib/portal/companion/route-context";
import type { CompanionWorkSession } from "@/companion/work-session/work-session.types";
import { CompanionWorkSessionPanel } from "./CompanionWorkSessionPanel";

export function CompanionQuickPanel({
  state,
  routeContext,
  workSession = null,
  onCelebrate,
  onClose,
}: {
  state: CompanionState;
  routeContext: RouteContext;
  /** EPIC 02 — Sprint 04: phiên làm việc hiện tại của Companion, nếu có (route/goal thật vừa được kích hoạt). */
  workSession?: CompanionWorkSession | null;
  onCelebrate: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function handleOutside(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, [onClose]);

  const otherActions = routeContext.quickActions.filter((a) => a.href !== "/portal/khong-gian-ai");
  const khongGianAi =
    routeContext.quickActions.find((a) => a.href === "/portal/khong-gian-ai") ?? {
      label: "Mở Không gian AI",
      href: "/portal/khong-gian-ai",
    };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label={`${displayName} — gợi ý nhanh`}
      className="companion-quick-panel pointer-events-auto absolute bottom-full right-0 mb-3 w-[min(88vw,300px)] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-700 focus:outline-none"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="mb-3 flex items-center gap-2.5 pr-6">
        <LivingCore size={32} state={toLivingCoreState(state.key)} />
        <div>
          <p className="text-sm font-bold text-gray-900">{displayName}</p>
          <p className="text-xs leading-snug text-gray-500">{routeContext.nudge}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {otherActions.slice(0, 2).map((action) => (
          <Link
            key={action.label}
            href={action.href}
            onClick={onClose}
            className="block rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
          >
            {action.label}
          </Link>
        ))}
      </div>

      {workSession && <CompanionWorkSessionPanel session={workSession} onCelebrate={onCelebrate} />}

      <Link
        href={khongGianAi.href}
        onClick={onClose}
        className="mt-3 block rounded-full gradient-surface px-4 py-2 text-center text-sm font-semibold text-white transition hover:opacity-90"
      >
        {khongGianAi.label}
      </Link>
    </div>
  );
}
