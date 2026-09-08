/**
 * EPIC 03 — Sprint B4: Portfolio & Growth Engine.
 *
 * Portfolio Engine thật — mọi Output đạt chuẩn (đã Review + đã Reflection
 * — Learning Operating System Blueprint mục 8) tự động trở thành
 * PortfolioItem. Portfolio KHÔNG lưu dữ liệu trùng — chỉ tham chiếu
 * `outputId`/`sessionId`, không copy nội dung Output (Single Source of
 * Truth, `FOUNDATION_DATA_LAYER.md` mục 7).
 *
 * PHASE 42 — trước đây `localStorage`-backed (per-browser, KHÔNG gắn
 * `member_id` thật). Giờ lưu qua bảng `portfolio_items` (RLS
 * `member_id = auth.uid()`), đúng kiến trúc "cache đồng bộ + persist bất
 * đồng bộ" Phase 40 — GIỮ NGUYÊN 100% chữ ký mọi hàm export. Portfolio là
 * dữ liệu APPEND-ONLY (đã audit — `promoteEligibleOutputs()` chỉ tạo mới,
 * không bao giờ sửa/xoá 1 PortfolioItem đã có) nên RLS chỉ cần SELECT +
 * INSERT, không cần UPDATE/DELETE. Thêm 1 hàm mới bắt buộc:
 * `hydratePortfolioItems()` (async, gọi 1 lần lúc mount TRƯỚC khi đọc lần
 * đầu).
 */

import type { WorkspaceSessionRecord, OutputRecord } from "./workspace-session-store";
import { listAllSessions } from "./workspace-session-store";
import { emitGrowthEvent } from "./growth-event-bus";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export type PortfolioItemRecord = {
  portfolioItemId: string;
  outputId: string;
  sessionId: string;
  missionId?: string;
  journeyId?: string;
  title: string;
  description?: string;
  outputType: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  businessValue?: string;
  capabilityMapping?: string[];
  aiImpactSummary?: string;
  status: "active" | "archived";
};

const MAX_ITEMS = 500;

type PortfolioItemRow = {
  portfolio_item_id: string;
  output_id: string;
  session_id: string;
  mission_id: string | null;
  journey_id: string | null;
  title: string;
  description: string | null;
  output_type: string;
  version: number;
  tags: string[] | null;
  business_value: string | null;
  capability_mapping: string[] | null;
  ai_impact_summary: string | null;
  status: "active" | "archived";
  output_created_at: string;
  updated_at: string;
};

function rowToItem(r: PortfolioItemRow): PortfolioItemRecord {
  return {
    portfolioItemId: r.portfolio_item_id,
    outputId: r.output_id,
    sessionId: r.session_id,
    missionId: r.mission_id ?? undefined,
    journeyId: r.journey_id ?? undefined,
    title: r.title,
    description: r.description ?? undefined,
    outputType: r.output_type,
    version: r.version,
    createdAt: r.output_created_at,
    updatedAt: r.updated_at,
    tags: r.tags ?? [],
    businessValue: r.business_value ?? undefined,
    capabilityMapping: r.capability_mapping ?? undefined,
    aiImpactSummary: r.ai_impact_summary ?? undefined,
    status: r.status,
  };
}

function itemToRow(item: PortfolioItemRecord, memberId: string) {
  return {
    portfolio_item_id: item.portfolioItemId,
    member_id: memberId,
    output_id: item.outputId,
    session_id: item.sessionId,
    mission_id: item.missionId ?? null,
    journey_id: item.journeyId ?? null,
    title: item.title,
    description: item.description ?? null,
    output_type: item.outputType,
    version: item.version,
    tags: item.tags,
    business_value: item.businessValue ?? null,
    capability_mapping: item.capabilityMapping ?? null,
    ai_impact_summary: item.aiImpactSummary ?? null,
    status: item.status,
    output_created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

let cachedMemberId: string | null | undefined = undefined;
let portfolioCache: PortfolioItemRecord[] = [];

/**
 * Tải Portfolio Item thật của member đang đăng nhập vào cache trong bộ
 * nhớ — PHẢI gọi (và `await`) trước khi dùng `listPortfolioItems()` lần
 * đầu ở mỗi trang. No-op nếu đã hydrate đúng member hiện tại.
 */
export async function hydratePortfolioItems(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    cachedMemberId = null;
    portfolioCache = [];
    return;
  }
  try {
    const supabase = getSupabaseBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const memberId = userData.user?.id ?? null;
    if (memberId === cachedMemberId) return;
    cachedMemberId = memberId;
    if (!memberId) {
      portfolioCache = [];
      return;
    }
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("portfolio_item_id, output_id, session_id, mission_id, journey_id, title, description, output_type, version, tags, business_value, capability_mapping, ai_impact_summary, status, output_created_at, updated_at")
      .eq("member_id", memberId)
      .order("output_created_at", { ascending: true });
    portfolioCache = error || !data ? [] : (data as PortfolioItemRow[]).map(rowToItem);
  } catch {
    portfolioCache = [];
  }
}

/** CHỈ dùng trong test — cache module-level không tự reset giữa các test
    case như `localStorage.clear()` cũ, nên test phải tự gọi hàm này. */
export function __resetPortfolioItemsCacheForTest(): void {
  cachedMemberId = undefined;
  portfolioCache = [];
}

async function persistCreated(items: PortfolioItemRecord[]): Promise<void> {
  if (!cachedMemberId) return;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
  try {
    const supabase = getSupabaseBrowser();
    const memberId = cachedMemberId;
    await supabase.from("portfolio_items").upsert(items.map((i) => itemToRow(i, memberId)), { onConflict: "portfolio_item_id" });
  } catch {
    // Mất kết nối/lỗi ghi — chấp nhận được ở MVP, cùng tinh thần localStorage cũ.
  }
}

export function listPortfolioItems(): PortfolioItemRecord[] {
  return portfolioCache;
}

function qualifies(output: OutputRecord): boolean {
  return output.reviewStatus === "reviewed" && output.reflectionStatus === "submitted";
}

/**
 * Quét toàn bộ Output của 1 Session, tự động tạo PortfolioItem cho Output
 * đã đạt chuẩn (Review + Reflection) mà CHƯA có trong Portfolio — không
 * tạo trùng. Gọi lại hàm này an toàn nhiều lần (idempotent).
 */
export function promoteEligibleOutputs(sessionId: string, session?: WorkspaceSessionRecord): PortfolioItemRecord[] {
  const target = session ?? listAllSessions().find((s) => s.sessionId === sessionId);
  if (!target) return [];

  const existing = portfolioCache;
  const alreadyPromoted = new Set(existing.map((i) => i.outputId));
  const now = new Date().toISOString();
  const created: PortfolioItemRecord[] = [];

  for (const output of target.outputs) {
    if (!qualifies(output) || alreadyPromoted.has(output.outputId)) continue;
    const item: PortfolioItemRecord = {
      portfolioItemId: `portfolio_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      outputId: output.outputId,
      sessionId: target.sessionId,
      missionId: target.context.missionId,
      journeyId: target.context.journeyId,
      title: target.context.userGoal ?? target.context.title ?? output.type,
      description: target.context.expectedOutput,
      outputType: output.type,
      version: output.versions.length,
      createdAt: output.createdAt,
      updatedAt: now,
      tags: [target.context.module, target.context.source].filter(Boolean) as string[],
      status: "active",
    };
    created.push(item);
    emitGrowthEvent({
      eventType: "PORTFOLIO_CREATED",
      workspaceSessionId: target.sessionId,
      outputId: output.outputId,
      missionId: target.context.missionId,
    });
  }

  if (created.length > 0) {
    portfolioCache = [...existing, ...created].slice(-MAX_ITEMS);
    void persistCreated(created);
  }
  return created;
}

/** Quét TOÀN BỘ Session đã lưu — dùng khi hiển thị Portfolio lần đầu
    (đảm bảo không bỏ sót Output đạt chuẩn từ trước khi Portfolio Engine
    này tồn tại). */
export function promoteAllEligibleOutputs(): PortfolioItemRecord[] {
  const sessions = listAllSessions();
  return sessions.flatMap((s) => promoteEligibleOutputs(s.sessionId, s));
}
