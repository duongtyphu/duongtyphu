/**
 * Companion Orchestrator — Real User Intent Bridge (Sprint A.2).
 *
 * Khi người dùng bấm một hành động thật ("Bắt đầu Mission", "Thực hành",
 * "Phân tích dự án"...), trang gọi `pushCompanionIntent()` với đúng
 * `userGoal`/`currentContext` của hành động đó. `CompanionPresence` lắng
 * nghe và nạp lại vào `orchestrate()` — Companion Message/Agent Plan đổi
 * theo hành vi thật, thay vì luôn dùng mặc định theo route.
 *
 * Cùng tab, không cần AI/API — chỉ là một event bus nhẹ (giống pattern
 * `portal-signals.ts` đã dùng cho Garden Stage/Reflection Meaning).
 */

import type { PortalModule } from "@/companion/agents/agent.types";

export type CompanionIntent = {
  module: PortalModule;
  userGoal?: string;
  currentContext?: string;
};

const INTENT_EVENT = "companion-orchestrator-intent";

let lastIntent: CompanionIntent | null = null;

export function pushCompanionIntent(intent: CompanionIntent) {
  lastIntent = intent;
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<CompanionIntent>(INTENT_EVENT, { detail: intent }));
}

export function readLastCompanionIntent(): CompanionIntent | null {
  return lastIntent;
}

export function clearCompanionIntent() {
  lastIntent = null;
}

export function subscribeToCompanionIntent(onChange: (intent: CompanionIntent) => void): () => void {
  if (typeof window === "undefined") return () => {};
  function handleEvent(event: Event) {
    const detail = (event as CustomEvent<CompanionIntent>).detail;
    if (detail) onChange(detail);
  }
  window.addEventListener(INTENT_EVENT, handleEvent);
  return () => window.removeEventListener(INTENT_EVENT, handleEvent);
}
