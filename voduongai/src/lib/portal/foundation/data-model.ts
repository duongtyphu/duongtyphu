/**
 * EPIC 03 — Sprint B1: Foundation Data Layer (types only).
 *
 * Ánh xạ trực tiếp từ `docs/FOUNDATION_DATA_LAYER.md` mục 2 (Shared
 * Models). Đây là type-level contract dùng chung cho mọi module — KHÔNG
 * phải bảng dữ liệu thật (chưa có DB migration trong sprint này). Mission/
 * Journey/CKOS hiện có KHÔNG bị thay thế bởi các type này — xem
 * "Migration Plan" trong `docs/SPRINT_B1_FOUNDATION_REPORT.md` cho lộ
 * trình ánh xạ dần dần.
 *
 * Nguyên tắc: mọi quan hệ đi qua ID tham chiếu (Foundation Data Layer mục
 * 14), không nhúng dữ liệu lồng sâu.
 */

import type { PortalModule } from "@/companion/agents/agent.types";

export type CompetencyLevel = "Introduced" | "Practiced" | "Applied" | "Mastered";

export type CompetencyProfile = {
  userId: string;
  competencyId: string;
  currentLevel: CompetencyLevel;
  contributingRecordIds: string[];
  updatedAt: string;
};

export type Journey = {
  journeyId: string;
  journeyName: string;
  businessGoal: string;
  competencyIds: string[];
  collectionIds: string[];
  requiredMissionIds: string[];
};

export type Collection = {
  collectionId: string;
  collectionName: string;
  journeyId: string;
  missionIds: string[];
};

export type Mission = {
  missionId: string;
  missionName: string;
  missionCategory: string;
  competencyIds: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  learningAssetIds: string[];
  journeyIds: string[];
};

export type LearningAsset = {
  assetId: string;
  missionId: string;
  goal: string;
  businessValue: string;
  knowledgeResourceIds: string[];
  promptPackIds: string[];
  templatePackIds: string[];
};

export type KnowledgeResource = {
  resourceId: string;
  type: "checklist" | "framework" | "case_study" | "sop" | "guide" | "reflection";
  content: string;
};

export type PromptPack = {
  promptPackId: string;
  prompts: { id: string; title: string; body: string }[];
};

export type TemplatePack = {
  templatePackId: string;
  format: string; // ".docx" | ".xlsx" | ".md" | ...
  fileRef: string;
};

export type WorkspaceSessionStatus = "start" | "paused" | "resumed" | "finished";

export type WorkspaceSession = {
  sessionId: string;
  missionId?: string;
  userId: string;
  context: UniversalContext;
  status: WorkspaceSessionStatus;
  startedAt: string;
  pausedAt?: string;
  resumedAt?: string;
  finishedAt?: string;
  currentStepId?: string;
  currentOutputId?: string;
};

export type WorkspaceStep = {
  stepId: string;
  sessionId: string;
  stepType:
    | "assessment"
    | "learning"
    | "guided_example"
    | "practice"
    | "companion_coaching"
    | "workspace"
    | "agent"
    | "output"
    | "review"
    | "reflection"
    | "growth"
    | "unlock";
  occurredAt: string;
};

export type Output = {
  outputId: string;
  sessionId: string;
  missionId?: string;
  type: string;
  currentVersionId: string;
  reviewId?: string;
  createdAt: string;
};

export type OutputVersion = {
  versionId: string;
  outputId: string;
  versionNumber: number;
  contentRef: string;
  editedAt: string;
  editReason?: string;
};

export type PortfolioItem = {
  portfolioItemId: string;
  userId: string;
  outputId: string;
  outputVersionId: string;
  competencyId: string;
  journeyId?: string;
  tags: string[];
  addedAt: string;
};

export type Reflection = {
  reflectionId: string;
  outputId: string;
  question: string;
  answer: string;
  createdAt: string;
};

export type CompanionReview = {
  reviewId: string;
  outputId: string;
  strengths: string[];
  improvements: string[];
  nextTimeSuggestion: string;
};

/**
 * 21 loại Growth Event. 10 loại gốc theo `FOUNDATION_DATA_LAYER.md` mục
 * 12, cộng `WORKSPACE_RESUMED`/`WORKSPACE_COMPLETED` ở Sprint B2, cộng
 * `REVIEW_STARTED`/`REFLECTION_STARTED` ở Sprint B3, cộng
 * `REVIEW_COMPLETED`/`PORTFOLIO_CREATED` ở Sprint B4, cộng
 * `AGENT_RUN_STARTED`/`AGENT_RUN_COMPLETED`/`AGENT_RUN_FAILED`/
 * `OUTPUT_REVIEWED`/`USER_APPROVAL_REQUIRED` ở AI Agent Integration MVP
 * (xem `agent-run-store.ts`). Đối chiếu brief MVP: `OUTPUT_REVIEWED` khác
 * `REVIEW_COMPLETED` đã có — `REVIEW_COMPLETED` là bước Review Flow thủ
 * công (Sprint B3, người dùng tự đánh dấu đã xem lại); `OUTPUT_REVIEWED`
 * là sự kiện Reviewer Agent thật vừa trả kết quả review (khác nguồn gốc,
 * giữ cả 2, không hợp nhất).
 */
export type GrowthEventType =
  | "WORKSPACE_STARTED"
  | "WORKSPACE_RESUMED"
  | "WORKSPACE_COMPLETED"
  | "MISSION_STARTED"
  | "MISSION_COMPLETED"
  | "OUTPUT_CREATED"
  | "OUTPUT_UPDATED"
  | "OUTPUT_VERSIONED"
  | "REVIEW_STARTED"
  | "REVIEW_COMPLETED"
  | "REFLECTION_STARTED"
  | "REFLECTION_COMPLETED"
  | "PORTFOLIO_CREATED"
  | "CAPABILITY_UPDATED"
  | "IMPACT_UPDATED"
  | "MISSION_UNLOCKED"
  | "AGENT_RUN_STARTED"
  | "AGENT_RUN_COMPLETED"
  | "AGENT_RUN_FAILED"
  | "OUTPUT_REVIEWED"
  | "USER_APPROVAL_REQUIRED";

export type GrowthEvent = {
  eventId: string;
  eventType: GrowthEventType;
  userId?: string;
  missionId?: string;
  workspaceSessionId?: string;
  outputId?: string;
  capabilityRecordId?: string;
  impactRecordId?: string;
  modulesUsing: string[];
  timestamp: string;
};

export type CapabilityRecord = {
  recordId: string;
  userId: string;
  competencyId: string;
  triggerEventId: string;
  evidence: {
    outputId?: string;
    reflectionId?: string;
    reviewId?: string;
    reused?: boolean;
  };
  levelBefore: CompetencyLevel;
  levelAfter: CompetencyLevel;
  recordedAt: string;
};

export type ImpactRecord = {
  recordId: string;
  userId: string;
  missionId: string;
  outputId?: string;
  before?: string;
  after?: string;
  timeSaved?: string;
  quality?: string;
  businessValue?: string;
  confidence?: string;
  automation?: string;
  measuredAt: string;
};

export type UnlockCondition =
  | "none"
  | { requiresMission: string[] }
  | { requiresCapability: { competencyId: string; minLevel: CompetencyLevel } }
  | { requiresAny: UnlockCondition[] }
  | { requiresAll: UnlockCondition[] };

export type UnlockRule = {
  ruleId: string;
  targetEntityId: string; // missionId | journeyId
  targetEntityType: "mission" | "journey";
  condition: UnlockCondition;
};

export type UnlockRecord = {
  recordId: string;
  userId: string;
  ruleId: string;
  unlockedEntityId: string;
  unlockedEntityType: "mission" | "journey";
  unlockedAt: string;
};

/**
 * Universal Context — mọi CTA truyền đúng field này (Foundation Data
 * Layer mục 4). Đây là bản type độc lập; `WorkspaceContext` trong
 * `companion-workspace.ts` là bản triển khai thật đang chạy trong Portal,
 * mở rộng thêm field mới cùng shape với type này (xem Migration Plan).
 */
export type UniversalContext = {
  userId?: string;
  module: PortalModule;
  source: string;
  routeFrom: string;
  journeyId?: string;
  collectionId?: string;
  missionId?: string;
  assetId?: string;
  resourceId?: string;
  promptId?: string;
  templateId?: string;
  userGoal?: string;
  expectedOutput?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  currentCapability?: CompetencyLevel;
  currentJourney?: string;
  timestamp: string;
};
