/**
 * EPIC 02 — Sprint 04: Companion Orchestration Experience™.
 * Types chuẩn hoá cho một phiên làm việc của Companion — xem
 * `docs/CompanionOrchestrationExperience.md`.
 */

import type { CompanionAgent, PortalModule } from "@/companion/agents/agent.types";

/**
 * 9 trạng thái Companion tối thiểu. SILENT/OBSERVING là trạng thái mặc định
 * khi không có Work Session. Các trạng thái còn lại chỉ tồn tại trong vòng
 * đời một Work Session (xem `work-session-engine.ts`).
 */
export type CompanionStatus =
  | "SILENT"
  | "OBSERVING"
  | "THINKING"
  | "PLANNING"
  | "INVITING_AGENT"
  | "WAITING_AGENT"
  | "SYNTHESIZING"
  | "READY"
  | "CELEBRATING";

export type CompanionWorkStepStatus = "pending" | "active" | "done";

export type CompanionWorkStep = {
  id: string;
  label: string;
  status: CompanionWorkStepStatus;
  /** Agent được mời ở bước này, nếu có — dùng để dựng câu Work Language đúng người. */
  agentId?: string;
};

export type CompanionMessage = {
  id: string;
  text: string;
  status: CompanionStatus;
};

export type OrchestrationContext = {
  module: PortalModule;
  route: string;
  userGoal: string;
  context?: string;
};

/**
 * Một phiên làm việc của Companion — nguồn sự thật duy nhất cho Work
 * Session UI. Thiết kế phẳng, serializable (JSON-safe) để dễ nâng cấp sang
 * lưu localStorage/DB sau này mà không cần đổi shape.
 */
export type CompanionWorkSession = {
  id: string;
  module: PortalModule;
  route: string;
  userGoal: string;
  context?: string;
  plan: CompanionWorkStep[];
  selectedSpecialists: CompanionAgent[];
  currentStatus: CompanionStatus;
  companionMessages: CompanionMessage[];
  resultSummary?: string;
  nextStep?: string;
};
