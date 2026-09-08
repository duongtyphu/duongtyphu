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
 * PHASE 42 — trước đây `localStorage`-backed (per-browser, KHÔNG gắn
 * `member_id` thật). Task #52 (audit 5 khu vực dùng nhiều nhất + Hành
 * trình của tôi) phát hiện đây là gap dữ liệu thật: 2 học viên dùng chung
 * máy thấy chung Event, đổi máy mất hết lịch sử. Giờ lưu qua bảng
 * `growth_events` (RLS `member_id = auth.uid()`), đúng kiến trúc "cache
 * đồng bộ + persist bất đồng bộ" đã dùng ở Phase 40
 * (`goal-runtime.ts`/`memory-store.ts`) — GIỮ NGUYÊN 100% chữ ký mọi hàm
 * export (đều đồng bộ như cũ, `emitGrowthEvent`/`readGrowthEvents` không
 * đổi thành async) để không phải viết lại mọi call site đang gọi ngay
 * trong render/event handler đồng bộ. Thêm đúng 1 hàm mới bắt buộc:
 * `hydrateGrowthEventBus()` (async, gọi 1 lần lúc mount TRƯỚC khi đọc lần
 * đầu). Cache tự re-hydrate nếu phát hiện đổi tài khoản đăng nhập.
 *
 * Growth Event là log APPEND-ONLY (đã audit — không có hàm sửa/xoá Event
 * nào trong toàn hệ thống) nên RLS chỉ cần SELECT + INSERT, không cần
 * UPDATE/DELETE — đúng tinh thần `memory_entries` ở Phase 40.
 */

import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { GrowthEvent, GrowthEventType } from "./data-model";

const GROWTH_EVENT_BUS = "vdai-growth-event";
const MAX_EVENTS = 200;

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
  COMPANION_ACTIVATED: ["learning-journal", "my-journey", "living-garden"],
  COMPANION_TASK_ASSIGNED: ["learning-journal", "my-journey", "living-garden"],
  COMPANION_TASK_COMPLETED: ["learning-journal", "my-journey", "living-garden"],
  OUTPUT_APPROVED: ["learning-journal", "my-journey", "living-garden", "portfolio"],
  MEMORY_UPDATED: ["learning-journal", "my-journey", "living-garden"],
};

type GrowthEventRow = {
  event_id: string;
  event_type: GrowthEventType;
  mission_id: string | null;
  workspace_session_id: string | null;
  output_id: string | null;
  capability_record_id: string | null;
  impact_record_id: string | null;
  modules_using: string[] | null;
  occurred_at: string;
};

function rowToEvent(r: GrowthEventRow): GrowthEvent {
  return {
    eventId: r.event_id,
    eventType: r.event_type,
    missionId: r.mission_id ?? undefined,
    workspaceSessionId: r.workspace_session_id ?? undefined,
    outputId: r.output_id ?? undefined,
    capabilityRecordId: r.capability_record_id ?? undefined,
    impactRecordId: r.impact_record_id ?? undefined,
    modulesUsing: r.modules_using ?? [],
    timestamp: r.occurred_at,
  };
}

function eventToRow(e: GrowthEvent, memberId: string) {
  return {
    event_id: e.eventId,
    member_id: memberId,
    event_type: e.eventType,
    mission_id: e.missionId ?? null,
    workspace_session_id: e.workspaceSessionId ?? null,
    output_id: e.outputId ?? null,
    capability_record_id: e.capabilityRecordId ?? null,
    impact_record_id: e.impactRecordId ?? null,
    modules_using: e.modulesUsing,
    occurred_at: e.timestamp,
  };
}

let cachedMemberId: string | null | undefined = undefined;
let eventsCache: GrowthEvent[] = [];

/**
 * Tải Growth Event thật của member đang đăng nhập vào cache trong bộ nhớ
 * — PHẢI gọi (và `await`) trước khi dùng `readGrowthEvents()` lần đầu ở
 * mỗi trang. No-op nếu đã hydrate đúng member hiện tại.
 */
export async function hydrateGrowthEventBus(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    cachedMemberId = null;
    eventsCache = [];
    return;
  }
  try {
    const supabase = getSupabaseBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const memberId = userData.user?.id ?? null;
    if (memberId === cachedMemberId) return;
    cachedMemberId = memberId;
    if (!memberId) {
      eventsCache = [];
      return;
    }
    const { data, error } = await supabase
      .from("growth_events")
      .select("event_id, event_type, mission_id, workspace_session_id, output_id, capability_record_id, impact_record_id, modules_using, occurred_at")
      .eq("member_id", memberId)
      .order("occurred_at", { ascending: false })
      .limit(MAX_EVENTS);
    eventsCache = error || !data ? [] : (data as GrowthEventRow[]).map(rowToEvent).reverse();
  } catch {
    eventsCache = [];
  }
}

/** CHỈ dùng trong test — cache module-level không tự reset giữa các test
    case như `localStorage.clear()` cũ, nên test phải tự gọi hàm này. */
export function __resetGrowthEventBusCacheForTest(): void {
  cachedMemberId = undefined;
  eventsCache = [];
}

function persistEvent(event: GrowthEvent): void {
  eventsCache = [...eventsCache, event].slice(-MAX_EVENTS);
  void persistToSupabase(event);
}

async function persistToSupabase(event: GrowthEvent): Promise<void> {
  if (!cachedMemberId) return;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
  try {
    const supabase = getSupabaseBrowser();
    await supabase.from("growth_events").insert(eventToRow(event, cachedMemberId));
  } catch {
    // Mất kết nối/lỗi ghi — chấp nhận được ở MVP, cùng tinh thần localStorage cũ.
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
    mới phát sinh qua subscribe. PHẢI `await hydrateGrowthEventBus()`
    trước lần gọi đầu tiên ở mỗi trang. */
export function readGrowthEvents(): GrowthEvent[] {
  return eventsCache;
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
