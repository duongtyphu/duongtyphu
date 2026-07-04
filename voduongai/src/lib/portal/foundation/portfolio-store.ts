/**
 * EPIC 03 — Sprint B4: Portfolio & Growth Engine.
 *
 * Portfolio Engine thật — mọi Output đạt chuẩn (đã Review + đã Reflection
 * — Learning Operating System Blueprint mục 8) tự động trở thành
 * PortfolioItem. Portfolio KHÔNG lưu dữ liệu trùng — chỉ tham chiếu
 * `outputId`/`sessionId`, không copy nội dung Output (Single Source of
 * Truth, `FOUNDATION_DATA_LAYER.md` mục 7).
 */

import type { WorkspaceSessionRecord, OutputRecord } from "./workspace-session-store";
import { listAllSessions } from "./workspace-session-store";
import { emitGrowthEvent } from "./growth-event-bus";

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

const PORTFOLIO_KEY = "vdai_portfolio_items";
const MAX_ITEMS = 500;

function readAll(): PortfolioItemRecord[] {
  try {
    const raw = window.localStorage.getItem(PORTFOLIO_KEY);
    return raw ? (JSON.parse(raw) as PortfolioItemRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: PortfolioItemRecord[]) {
  try {
    window.localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(items.slice(-MAX_ITEMS)));
  } catch {
    // localStorage đầy/không khả dụng — Portfolio chỉ mất khả năng lưu lâu dài,
    // không ảnh hưởng phiên làm việc hiện tại.
  }
}

export function listPortfolioItems(): PortfolioItemRecord[] {
  return readAll();
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

  const existing = readAll();
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

  if (created.length > 0) writeAll([...existing, ...created]);
  return created;
}

/** Quét TOÀN BỘ Session đã lưu — dùng khi hiển thị Portfolio lần đầu
    (đảm bảo không bỏ sót Output đạt chuẩn từ trước khi Portfolio Engine
    này tồn tại). */
export function promoteAllEligibleOutputs(): PortfolioItemRecord[] {
  const sessions = listAllSessions();
  return sessions.flatMap((s) => promoteEligibleOutputs(s.sessionId, s));
}
