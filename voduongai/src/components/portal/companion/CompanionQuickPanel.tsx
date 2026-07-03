"use client";

/**
 * Companion Presence — Quick Panel (Sprint "Companion Presence Fix").
 * Panel nhỏ mở khi bấm vào Companion: lời chào ngắn + tối đa 3 gợi ý hành
 * động theo trang hiện tại + nút "Mở Không gian AI" + nút đóng. Không phải
 * chatbot, không gọi AI — chỉ là điều hướng rule-based theo ngữ cảnh route.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Circle, X } from "lucide-react";
import { LivingCore } from "@/components/LivingCore";
import { toLivingCoreState } from "@/lib/portal/companion/living-core-state";
import { displayName, type CompanionState } from "@/lib/portal/companion/companion-identity";
import type { RouteContext } from "@/lib/portal/companion/route-context";
import type { OrchestrationPlan } from "@/companion/agents/companion-orchestrator";

export function CompanionQuickPanel({
  state,
  routeContext,
  orchestrationPlan = null,
  onClose,
}: {
  state: CompanionState;
  routeContext: RouteContext;
  /** Product Amendment 02 — Companion Orchestration System™: đội Agent + kế hoạch Companion đã chọn cho module hiện tại, nếu có. */
  orchestrationPlan?: OrchestrationPlan | null;
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

      {orchestrationPlan && (
        <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-700">{orchestrationPlan.companionMessage}</p>
          {orchestrationPlan.selectedAgents.length > 0 && (
            <p className="mt-1.5 text-[11px] text-gray-400">
              Đội đồng hành: {orchestrationPlan.selectedAgents.map((agent) => agent.name.replace(/^AI /, "")).join(", ")}
            </p>
          )}
          <ul className="mt-2 space-y-1">
            {orchestrationPlan.actionPlan.map((step) => (
              <li key={step.id} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                {step.status === "done" ? (
                  <Check className="h-3 w-3 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="h-3 w-3 shrink-0 text-gray-300" />
                )}
                {step.label}
              </li>
            ))}
          </ul>
        </div>
      )}

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
