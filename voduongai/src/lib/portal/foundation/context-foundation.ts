/**
 * EPIC 03 — Sprint B1: Progressive Architecture Refactor — Context
 * Foundation (Step 4).
 *
 * Các Context hẹp hơn theo từng domain — chuẩn bị cho Sprint B2+ khi mỗi
 * Engine (Mission Engine/Learning Asset Engine/Companion Orchestrator)
 * cần một shape Context riêng, gọn hơn `UniversalContext` đầy đủ. KHÔNG
 * dùng trong Sprint B1 — CTA hiện tại vẫn gọi
 * `startCompanionWorkspace(context)` với `WorkspaceContext` như cũ, không
 * đổi. Đây chỉ là type chuẩn bị (extension seam), chưa có call site nào.
 */

import type { PortalModule } from "@/companion/agents/agent.types";
import type { CompetencyLevel } from "./data-model";
import type { WorkspaceItemType } from "@/lib/portal/companion-workspace";

/** Context tối thiểu cho một phiên Workspace — bằng đúng
    `WorkspaceContext` hiện có trong `companion-workspace.ts`, khai báo
    lại ở đây để mọi Engine tương lai import từ Foundation thay vì import
    trực tiếp từ companion-workspace.ts. */
export type WorkspaceContext = {
  module: PortalModule;
  source: string;
  routeFrom: string;
  timestamp: string;
  title?: string;
  userGoal?: string;
  itemId?: string;
  itemType?: WorkspaceItemType;
  expectedOutput?: string;
};

/** Context hẹp cho Mission Engine (Sprint B7+) — chỉ cần biết đang ở
    Mission nào, Journey/Collection nào, độ khó nào. */
export type MissionContext = {
  missionId: string;
  journeyId?: string;
  collectionId?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
};

/** Context hẹp cho Learning Asset Engine (Sprint B7+) — chỉ cần biết
    đang ở Asset nào, thuộc Mission nào, Resource/Prompt/Template liên
    quan (nếu người dùng bấm CTA từ 1 tài nguyên cụ thể trong Asset). */
export type LearningContext = {
  assetId: string;
  missionId: string;
  resourceId?: string;
  promptId?: string;
  templateId?: string;
};

/** Context hẹp cho Companion Orchestrator (EPIC 04+) — tổng hợp năng lực
    hiện tại + mục tiêu người dùng, đủ để Companion quyết định Coaching/
    Agent điều phối mà không cần đọc toàn bộ WorkspaceContext. */
export type CompanionContext = {
  userGoal?: string;
  currentCapability?: CompetencyLevel;
  currentJourney?: string;
  module: PortalModule;
};

/**
 * Hợp nhất 4 Context trên thành 1 object — tương đương
 * `WorkspaceContext` mở rộng đã có trong `companion-workspace.ts` (Sprint
 * B1 trước). Đặt tên `UniversalContext` để nhất quán với
 * `docs/FOUNDATION_DATA_LAYER.md` mục 4 — type này KHÔNG thay thế
 * `WorkspaceContext` trong `companion-workspace.ts`, chỉ là điểm tham
 * chiếu chung cho Sprint B2+ khi tách Engine.
 */
export type UniversalContext = WorkspaceContext &
  Partial<MissionContext> &
  Partial<LearningContext> &
  Partial<Pick<CompanionContext, "currentCapability" | "currentJourney">>;
