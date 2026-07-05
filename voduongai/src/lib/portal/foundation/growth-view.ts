/**
 * EPIC 03 — Sprint B4: Portfolio & Growth Engine.
 *
 * Lớp đọc (read-only) tổng hợp dữ liệu thật cho Nhật ký học tập/Hành
 * trình của tôi/Khu vườn của bạn — không tạo dữ liệu giả, không tạo
 * bảng lưu trữ mới (chỉ đọc `GrowthEvent`/`WorkspaceSession`/
 * `PortfolioItem` đã có). Nếu người dùng chưa có hoạt động nào, mọi hàm
 * ở đây trả về mảng rỗng — trang gọi phải tự xử lý trạng thái rỗng, không
 * hiển thị số liệu bịa.
 */

import { readGrowthEvents } from "./growth-event-bus";
import { listAllSessions } from "./workspace-session-store";
import { listPortfolioItems } from "./portfolio-store";
import type { GrowthEvent, GrowthEventType } from "./data-model";

const EVENT_LABEL: Record<GrowthEventType, string> = {
  WORKSPACE_STARTED: "Bắt đầu một Workspace mới",
  WORKSPACE_RESUMED: "Tiếp tục Workspace đang làm dở",
  WORKSPACE_COMPLETED: "Hoàn thành Workspace",
  MISSION_STARTED: "Bắt đầu Mission",
  MISSION_COMPLETED: "Hoàn thành Mission",
  OUTPUT_CREATED: "Tạo Output mới",
  OUTPUT_UPDATED: "Cập nhật Output",
  OUTPUT_VERSIONED: "Lưu phiên bản mới của Output",
  REVIEW_STARTED: "Bắt đầu Review",
  REVIEW_COMPLETED: "Hoàn thành Review",
  REFLECTION_STARTED: "Bắt đầu Reflection",
  REFLECTION_COMPLETED: "Hoàn thành Reflection",
  PORTFOLIO_CREATED: "Thêm một thành quả vào Portfolio",
  CAPABILITY_UPDATED: "Năng lực được cập nhật",
  IMPACT_UPDATED: "Ghi nhận AI Impact",
  MISSION_UNLOCKED: "Mở khóa Mission mới",
  AGENT_RUN_STARTED: "AI Agent bắt đầu xử lý",
  AGENT_RUN_COMPLETED: "AI Agent hoàn thành xử lý",
  AGENT_RUN_FAILED: "AI Agent gặp lỗi",
  OUTPUT_REVIEWED: "Reviewer Agent đã review Output",
  USER_APPROVAL_REQUIRED: "Đang chờ bạn phê duyệt",
  COMPANION_ACTIVATED: "AI Companion được Activate vào Workforce",
  COMPANION_TASK_ASSIGNED: "Companion nhận Task mới",
  COMPANION_TASK_COMPLETED: "Companion hoàn thành Task",
  OUTPUT_APPROVED: "Owner đã phê duyệt Output",
  MEMORY_UPDATED: "Memory được cập nhật",
};

export type ActivityEntry = {
  timestamp: string;
  label: string;
};

/** Nhật ký học tập — dòng thời gian thật, mới nhất trước. Rỗng nếu chưa
    có hoạt động nào — không dùng dữ liệu giả để lấp chỗ trống. */
export function getRecentActivity(limit = 20): ActivityEntry[] {
  const events: GrowthEvent[] = readGrowthEvents();
  return events
    .slice(-limit)
    .reverse()
    .map((e) => ({ timestamp: e.timestamp, label: EVENT_LABEL[e.eventType] ?? e.eventType }));
}

export type JourneyProgressEntry = {
  journeyId?: string;
  missionId?: string;
  missionGoal: string;
  outputCount: number;
  isCompleted: boolean;
};

/** Hành trình của tôi — tổng hợp theo Journey/Mission/Output thật từ
    WorkspaceSession đã lưu (không phải Progress Bar phần trăm ước lượng). */
export function getJourneyProgress(): JourneyProgressEntry[] {
  return listAllSessions().map((s) => ({
    journeyId: s.context.journeyId,
    missionId: s.context.missionId,
    missionGoal: s.context.userGoal ?? s.context.title ?? s.context.source,
    outputCount: s.outputs.length,
    isCompleted: s.status === "completed",
  }));
}

export type GardenSummary = {
  missionsCompleted: number; // mỗi Mission hoàn thành → 1 cây
  journeysTouched: number; // mỗi Journey đã chạm tới → 1 khu vực
  competenciesPracticed: number; // mỗi module/nguồn khác nhau đã thực hành → 1 loài cây (xấp xỉ, chưa có Capability Engine thật — xem Sprint B5)
  totalOutputs: number;
};

/** Khu vườn của bạn — không điểm, không XP, không Gamification. Chỉ đếm
    từ Growth Event/Session thật. Nếu người dùng chưa làm gì, mọi số liệu
    trả về 0 — trang phải tự hiển thị trạng thái "khu vườn còn trống",
    không vẽ cây giả. */
export function getGardenSummary(): GardenSummary {
  const sessions = listAllSessions();
  const journeys = new Set(sessions.map((s) => s.context.journeyId).filter(Boolean));
  const modules = new Set(sessions.map((s) => s.context.module).filter(Boolean));
  return {
    missionsCompleted: sessions.filter((s) => s.status === "completed").length,
    journeysTouched: journeys.size,
    competenciesPracticed: modules.size,
    totalOutputs: sessions.reduce((sum, s) => sum + s.outputs.length, 0),
  };
}

export function getPortfolioCount(): number {
  return listPortfolioItems().length;
}
