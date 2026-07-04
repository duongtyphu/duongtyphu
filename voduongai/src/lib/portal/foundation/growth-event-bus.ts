/**
 * EPIC 03 — Sprint B1: Growth Event Bus.
 *
 * Backbone thật cho `docs/FOUNDATION_DATA_LAYER.md` mục 8/12 — điểm phát/
 * nghe DUY NHẤT cho mọi `GrowthEvent`. Module downstream (Nhật ký học
 * tập/Hành trình của tôi/Khu vườn của bạn/Capability Engine/Impact
 * Engine/Unlock Engine) phải lắng nghe qua `subscribeToGrowthEvents()`,
 * KHÔNG được gọi hàm trực tiếp của module khác (Product Guardrails —
 * Event-Driven Architecture).
 *
 * Kỹ thuật: cùng pattern đã dùng ở `orchestrator-intent.ts`
 * (window.CustomEvent, same-tab) + `localStorage` để giữ lịch sử Event
 * (append-only, giới hạn 200 gần nhất) — không có backend/DB trong sprint
 * này, đúng tinh thần "chưa gọi AI thật, chưa có Agent thật" đã áp dụng từ
 * Sprint 01/02.
 */

import type { GrowthEvent, GrowthEventType } from "./data-model";

const GROWTH_EVENTS_KEY = "vdai_growth_events";
const GROWTH_EVENT_BUS = "vdai-growth-event";

/** Mỗi eventType khai báo trước module nào đọc nó (Foundation Data Layer
    mục 8) — tối thiểu 3 module theo Product Guardrails. */
export const GROWTH_EVENT_CONSUMERS: Record<GrowthEventType, string[]> = {
  WORKSPACE_STARTED: ["learning-journal", "my-journey", "living-garden"],
  WORKSPACE_RESUMED: ["learning-journal", "my-journey", "living-garden"],
  WORKSPACE_COMPLETED: ["learning-journal", "my-journey", "living-garden", "portfolio"],
  MISSION_STARTED: ["learning-journal", "my-journey", "living-garden"],
  MISSION_COMPLETED: ["learning-journal", "my-journey", "living-garden", "capability-engine"],
  OUTPUT_CREATED: ["learning-journal", "my-journey", "living-garden", "portfolio", "impact-engine"],
  OUTPUT_UPDATED: ["learning-journal", "my-journey", "living-garden"],
  OUTPUT_VERSIONED: ["learning-journal", "my-journey", "living-garden", "portfolio"],
  REVIEW_STARTED: ["learning-journal", "my-journey", "living-garden"],
  REVIEW_COMPLETED: ["learning-journal", "my-journey", "living-garden"],
  REFLECTION_STARTED: ["learning-journal", "my-journey", "living-garden"],
  REFLECTION_COMPLETED: ["learning-journal", "my-journey", "living-garden", "capability-engine"],
  PORTFOLIO_CREATED: ["learning-journal", "my-journey", "living-garden"],
  CAPABILITY_UPDATED: ["learning-journal", "my-journey", "living-garden"],
  IMPACT_UPDATED: ["learning-journal", "my-journey", "living-garden"],
  MISSION_UNLOCKED: ["learning-journal", "my-journey", "living-garden"],
  AGENT_RUN_STARTED: ["learning-journal", "my-journey", "living-garden"],
  AGENT_RUN_COMPLETED: ["learning-journal", "my-journey", "living-garden"],
  AGENT_RUN_FAILED: ["learning-journal", "my-journey", "living-garden"],
  OUTPUT_REVIEWED: ["learning-journal", "my-journey", "living-garden"],
  USER_APPROVAL_REQUIRED: ["learning-journal", "my-journey", "living-garden"],
};

function readEventList(): GrowthEvent[] {
  try {
    const raw = window.localStorage.getItem(GROWTH_EVENTS_KEY);
    return raw ? (JSON.parse(raw) as GrowthEvent[]) : [];
  } catch {
    return [];
  }
}

function persistEvent(event: GrowthEvent) {
  try {
    const list = readEventList();
    list.push(event);
    window.localStorage.setItem(GROWTH_EVENTS_KEY, JSON.stringify(list.slice(-200)));
  } catch {
    // localStorage đầy/không khả dụng — Growth Event chỉ là dữ liệu tạm, bỏ qua an toàn.
  }
}

/**
 * `emitGrowthEvent(...)` — điểm phát DUY NHẤT. Module gốc (Workspace/
 * Portfolio/Capability Engine/Impact Engine/Unlock Engine) gọi hàm này
 * khi có hành động thật xảy ra — KHÔNG tự ghi trực tiếp vào bảng đích của
 * module khác (Data Ownership, Foundation Data Layer mục 11).
 */
export function emitGrowthEvent(
  input: Omit<GrowthEvent, "eventId" | "modulesUsing" | "timestamp">
): GrowthEvent {
  const event: GrowthEvent = {
    ...input,
    eventId: `event_${input.eventType.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    modulesUsing: GROWTH_EVENT_CONSUMERS[input.eventType],
    timestamp: new Date().toISOString(),
  };

  persistEvent(event);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<GrowthEvent>(GROWTH_EVENT_BUS, { detail: event }));
  }

  return event;
}

/** Đọc toàn bộ lịch sử Event đã lưu (tối đa 200 gần nhất) — dùng cho
    module downstream cần "backfill" khi mount lần đầu, trước khi có Event
    mới phát sinh qua subscribe. */
export function readGrowthEvents(): GrowthEvent[] {
  return readEventList();
}

/** Lắng nghe Event mới phát sinh trong cùng tab — trả về hàm huỷ đăng ký. */
export function subscribeToGrowthEvents(onEvent: (event: GrowthEvent) => void): () => void {
  if (typeof window === "undefined") return () => {};
  function handleEvent(e: Event) {
    const detail = (e as CustomEvent<GrowthEvent>).detail;
    if (detail) onEvent(detail);
  }
  window.addEventListener(GROWTH_EVENT_BUS, handleEvent);
  return () => window.removeEventListener(GROWTH_EVENT_BUS, handleEvent);
}
