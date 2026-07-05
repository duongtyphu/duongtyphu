/**
 * EPIC 02 — Sprint 02: Connected Learning Ecosystem.
 *
 * Hành động dùng chung cho MỌI nút "Thực hành cùng Companion" / "Giao việc
 * cho Companion" / "Bắt đầu Workspace" / "Dùng Prompt này" / "Thực hành
 * quy trình này" / "Dùng cùng Companion" / "Dùng ngay" — trên TOÀN Portal
 * (Học viện AI, AI Workspace, Thư viện tri thức), không chỉ trang Không
 * gian AI như Sprint 01 — không mỗi nút một logic riêng.
 *
 * Sprint này CHƯA gọi AI thật, CHƯA có Agent thật — chỉ lưu context tạm
 * (sessionStorage) + một Growth Event tạm (localStorage), rồi điều hướng
 * sang `/portal/workspace` (MVP route hiển thị lại context, chưa xử lý gì).
 */

import type { PortalModule } from "@/companion/agents/agent.types";
import type { CompetencyLevel } from "@/lib/portal/foundation/data-model";
import { emitGrowthEvent } from "@/lib/portal/foundation/growth-event-bus";

export type WorkspaceItemType =
  | "work_need"
  | "workspace"
  | "workflow"
  | "prompt"
  | "tool"
  | "learning_path"
  | "resource"
  | "mission"
  | "knowledge_seed";

export type WorkspaceContext = {
  module: PortalModule;
  source: string;
  title?: string;
  userGoal?: string;
  itemId?: string;
  itemType?: WorkspaceItemType;
  expectedOutput?: string;
  routeFrom: string;
  timestamp: string;
  // EPIC 03 — Sprint B1: Universal Context (Foundation Data Layer mục 4).
  // Field mới, tất cả tùy chọn — không phá call site cũ nào.
  journeyId?: string;
  collectionId?: string;
  missionId?: string;
  assetId?: string;
  resourceId?: string;
  promptId?: string;
  templateId?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  currentCapability?: CompetencyLevel;
  currentJourney?: string;
};

const CONTEXT_KEY = "vdai_workspace_context";

/** Lưu context tạm cho `/portal/workspace` đọc lại — sessionStorage vì chỉ
    cần sống trong một phiên điều hướng, không phải dữ liệu lâu dài. */
function saveWorkspaceContext(context: WorkspaceContext) {
  try {
    window.sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
  } catch {
    // sessionStorage có thể không khả dụng (Safari private mode...) — bỏ qua,
    // Workspace vẫn đọc được context tối thiểu từ query params.
  }
}

export function readWorkspaceContext(): WorkspaceContext | null {
  try {
    const raw = window.sessionStorage.getItem(CONTEXT_KEY);
    return raw ? (JSON.parse(raw) as WorkspaceContext) : null;
  } catch {
    return null;
  }
}

function buildWorkspaceUrl(context: WorkspaceContext): string {
  const params = new URLSearchParams();
  params.set("module", context.module);
  params.set("source", context.source);
  if (context.title) params.set("title", context.title);
  if (context.userGoal) params.set("goal", context.userGoal);
  if (context.itemId) params.set("itemId", context.itemId);
  if (context.itemType) params.set("itemType", context.itemType);
  if (context.expectedOutput) params.set("expectedOutput", context.expectedOutput);
  if (context.journeyId) params.set("journeyId", context.journeyId);
  if (context.collectionId) params.set("collectionId", context.collectionId);
  if (context.missionId) params.set("missionId", context.missionId);
  if (context.assetId) params.set("assetId", context.assetId);
  if (context.resourceId) params.set("resourceId", context.resourceId);
  if (context.promptId) params.set("promptId", context.promptId);
  if (context.templateId) params.set("templateId", context.templateId);
  if (context.difficulty) params.set("difficulty", context.difficulty);
  params.set("routeFrom", context.routeFrom);
  params.set("ts", context.timestamp);
  return `/portal/workspace?${params.toString()}`;
}

/**
 * `startCompanionWorkspace(context)` — điểm gọi DUY NHẤT cho mọi hành động
 * "thực hành/dùng ngay cùng Companion" trên TOÀN Portal (Học viện AI, AI
 * Workspace, Thư viện tri thức...). Nhận context tối thiểu (thiếu
 * `module`/`routeFrom`/`timestamp` sẽ tự điền — `module` mặc định
 * `"khong-gian-ai"` để không phá các call site Sprint 01 cũ), lưu lại rồi
 * trả về URL để điều hướng — component gọi `router.push(url)`.
 */
export function startCompanionWorkspace(
  input: Omit<WorkspaceContext, "module" | "routeFrom" | "timestamp"> & {
    module?: PortalModule;
    routeFrom?: string;
  }
): string {
  const timestamp = new Date().toISOString();
  const routeFrom = input.routeFrom ?? (typeof window !== "undefined" ? window.location.pathname : "/portal/aiworkspace");
  const context: WorkspaceContext = {
    module: input.module ?? "khong-gian-ai",
    source: input.source,
    title: input.title,
    userGoal: input.userGoal,
    itemId: input.itemId,
    itemType: input.itemType,
    expectedOutput: input.expectedOutput,
    routeFrom,
    timestamp,
    journeyId: input.journeyId,
    collectionId: input.collectionId,
    missionId: input.missionId,
    assetId: input.assetId,
    resourceId: input.resourceId,
    promptId: input.promptId,
    templateId: input.templateId,
    difficulty: input.difficulty,
    currentCapability: input.currentCapability,
    currentJourney: input.currentJourney,
  };

  saveWorkspaceContext(context);

  // EPIC 03 — Sprint B1: phát Growth Event thật qua Event Bus chung
  // (Foundation Data Layer mục 8/12) thay vì tự ghi localStorage riêng.
  // MISSION_STARTED khi context có missionId (thực hành gắn với 1 Mission
  // cụ thể), WORKSPACE_STARTED cho mọi trường hợp còn lại (vd Companion
  // Desk tự do, chưa gắn Mission).
  emitGrowthEvent({
    eventType: context.missionId ? "MISSION_STARTED" : "WORKSPACE_STARTED",
    missionId: context.missionId,
  });

  return buildWorkspaceUrl(context);
}
