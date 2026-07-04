/**
 * EPIC 03 — Sprint B2: AI Workspace Execution Engine.
 *
 * Workspace Session thật — thay thế cơ chế "1 context duy nhất, ghi đè
 * mỗi lần" của Sprint 01/02 bằng 1 danh sách Session thật (localStorage,
 * chưa có backend — đúng tinh thần "chưa gọi AI thật" đã giữ xuyên suốt
 * EPIC 02-03), có thể Pause/Resume/Complete, giữ Output + Version + lịch
 * sử đầy đủ.
 *
 * Không đổi UI lớn — module này chỉ là lớp dữ liệu; `WorkspaceMvp.tsx`
 * gọi các hàm ở đây để hiển thị/tương tác.
 */

import type { WorkspaceContext } from "@/lib/portal/companion-workspace";
import { emitGrowthEvent } from "./growth-event-bus";
import { getProviderForCapability } from "./provider-manager";
import { startAgentRun, completeAgentRun, failAgentRun } from "./agent-run-store";
import type { WriterAgentResult } from "@/ai/agents/writer-agent";
import type { ReviewerAgentResult } from "@/ai/agents/reviewer-agent";

export type ExecutionStepId =
  | "mission_started"
  | "preparing"
  | "research"
  | "draft"
  | "review"
  | "revision"
  | "completed";

export const EXECUTION_TIMELINE: { id: ExecutionStepId; label: string }[] = [
  { id: "mission_started", label: "Mission Started" },
  { id: "preparing", label: "Preparing" },
  { id: "research", label: "Research" },
  { id: "draft", label: "Draft" },
  { id: "review", label: "Review" },
  { id: "revision", label: "Revision" },
  { id: "completed", label: "Completed" },
];

export type OutputType =
  | "word" | "excel" | "prompt" | "markdown" | "pdf" | "image" | "link" | "code" | "landing_page";

export type OutputVersionRecord = {
  versionNumber: number;
  content: string;
  editedAt: string;
};

export type ReviewStatus = "not_ready" | "pending" | "reviewed";
export type ReflectionStatus = "not_ready" | "pending" | "submitted";

export type ReflectionAnswer = {
  question: string;
  answer: string;
  submittedAt: string;
};

/** AI Agent Integration MVP — nhận xét thật từ Reviewer Agent (khác
    `CompanionReview` thủ công) — GỢI Ý, không phải quyết định cuối. */
export type AgentReviewResult = {
  strengths: string[];
  issues: string[];
  suggestedImprovements: string[];
  approvalRecommendation: "approve" | "revise";
  versionSuggestion: string;
  isMock: boolean;
};

/** Trạng thái phê duyệt hiển thị cho User — tách biệt với `reviewStatus`
    (Review Flow thủ công đã khóa từ Sprint B3) để không đổi điều kiện
    Portfolio đã khóa (Sprint B4 vẫn yêu cầu `reviewStatus: "reviewed"` +
    `reflectionStatus: "submitted"`, không nới lỏng). */
export type ApprovalStatus = "draft" | "reviewed" | "needs_revision" | "approved";

export type OutputRecord = {
  outputId: string;
  type: OutputType;
  versions: OutputVersionRecord[];
  reviewStatus: ReviewStatus;
  reflectionStatus: ReflectionStatus;
  reflections: ReflectionAnswer[];
  createdAt: string;
  updatedAt: string;
  agentReview?: AgentReviewResult;
  approvalStatus?: ApprovalStatus;
};

export type HistoryEntry = {
  label: string;
  occurredAt: string;
};

export type WorkspaceSessionStatus = "active" | "paused" | "completed";

export type WorkspaceSessionRecord = {
  sessionId: string;
  context: WorkspaceContext;
  status: WorkspaceSessionStatus;
  currentStepId: ExecutionStepId;
  startedAt: string;
  pausedAt?: string;
  resumedAt?: string;
  finishedAt?: string;
  history: HistoryEntry[];
  outputs: OutputRecord[];
};

const SESSIONS_KEY = "vdai_workspace_sessions";
const MAX_SESSIONS = 100;

function readAll(): WorkspaceSessionRecord[] {
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as WorkspaceSessionRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAll(sessions: WorkspaceSessionRecord[]) {
  try {
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(-MAX_SESSIONS)));
  } catch {
    // localStorage đầy/không khả dụng — Workspace vẫn dùng được trong phiên hiện tại
    // (state React), chỉ mất khả năng resume sau khi rời trang.
  }
}

function upsert(session: WorkspaceSessionRecord) {
  const all = readAll();
  const idx = all.findIndex((s) => s.sessionId === session.sessionId);
  if (idx >= 0) all[idx] = session;
  else all.push(session);
  writeAll(all);
}

/** Khóa để tìm Session có thể resume — cùng nguồn + cùng mục tiêu/Mission
    coi là "đang làm dở việc này". */
function resumeKey(context: WorkspaceContext): string {
  return [context.module, context.source, context.missionId ?? context.itemId ?? "", context.userGoal ?? context.title ?? ""].join("::");
}

/** Tìm Session chưa hoàn thành khớp context hiện tại — dùng để Resume
    thay vì luôn tạo Session mới cho cùng một việc. */
export function findResumableSession(context: WorkspaceContext): WorkspaceSessionRecord | null {
  const key = resumeKey(context);
  const all = readAll();
  const match = all
    .filter((s) => s.status !== "completed" && resumeKey(s.context) === key)
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))[0];
  return match ?? null;
}

export function getSession(sessionId: string): WorkspaceSessionRecord | null {
  return readAll().find((s) => s.sessionId === sessionId) ?? null;
}

/** Đọc toàn bộ Session đã lưu — dùng cho Growth View (Sprint B4:
    Nhật ký học tập/Hành trình của tôi/Khu vườn của bạn) tổng hợp tiến độ
    thật, không phải để sửa dữ liệu. */
export function listAllSessions(): WorkspaceSessionRecord[] {
  return readAll();
}

/** Tạo Session mới — phát `MISSION_STARTED`/`WORKSPACE_STARTED` đã được
    `startCompanionWorkspace()` phát trước đó (Sprint B1); ở đây Session
    chỉ tự ghi lịch sử nội bộ, không phát trùng Event. */
export function createSession(context: WorkspaceContext): WorkspaceSessionRecord {
  const now = new Date().toISOString();
  const session: WorkspaceSessionRecord = {
    sessionId: `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    context,
    status: "active",
    currentStepId: "mission_started",
    startedAt: now,
    history: [{ label: "Mission Started", occurredAt: now }],
    outputs: [],
  };
  upsert(session);
  return session;
}

export function resumeSession(sessionId: string): WorkspaceSessionRecord | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const now = new Date().toISOString();
  const updated: WorkspaceSessionRecord = {
    ...session,
    status: "active",
    resumedAt: now,
    history: [...session.history, { label: "Workspace Resumed", occurredAt: now }],
  };
  upsert(updated);
  emitGrowthEvent({ eventType: "WORKSPACE_RESUMED", workspaceSessionId: sessionId, missionId: session.context.missionId });
  return updated;
}

export function pauseSession(sessionId: string): WorkspaceSessionRecord | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const now = new Date().toISOString();
  const updated: WorkspaceSessionRecord = {
    ...session,
    status: "paused",
    pausedAt: now,
    history: [...session.history, { label: "Workspace Paused", occurredAt: now }],
  };
  upsert(updated);
  return updated;
}

export function advanceStep(sessionId: string, stepId: ExecutionStepId): WorkspaceSessionRecord | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const stepLabel = EXECUTION_TIMELINE.find((s) => s.id === stepId)?.label ?? stepId;
  const now = new Date().toISOString();
  const updated: WorkspaceSessionRecord = {
    ...session,
    currentStepId: stepId,
    history: [...session.history, { label: stepLabel, occurredAt: now }],
  };
  upsert(updated);
  return updated;
}

export function completeSession(sessionId: string): WorkspaceSessionRecord | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const now = new Date().toISOString();
  const updated: WorkspaceSessionRecord = {
    ...session,
    status: "completed",
    currentStepId: "completed",
    finishedAt: now,
    history: [...session.history, { label: "Completed", occurredAt: now }],
  };
  upsert(updated);
  emitGrowthEvent({ eventType: "WORKSPACE_COMPLETED", workspaceSessionId: sessionId, missionId: session.context.missionId });
  return updated;
}

/** Lưu 1 phiên bản Output mới — nếu `outputId` chưa tồn tại, tạo Output
    mới (Version 1); nếu đã có, thêm Version tiếp theo (KHÔNG ghi đè). */
export function saveOutputVersion(
  sessionId: string,
  input: { outputId?: string; type: OutputType; content: string }
): { session: WorkspaceSessionRecord; output: OutputRecord } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const now = new Date().toISOString();

  let output = session.outputs.find((o) => o.outputId === input.outputId);
  const isNew = !output;

  if (!output) {
    output = {
      outputId: `output_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: input.type,
      versions: [],
      reviewStatus: "not_ready",
      reflectionStatus: "not_ready",
      reflections: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  const nextVersionNumber = output.versions.length + 1;
  const updatedOutput: OutputRecord = {
    ...output,
    versions: [...output.versions, { versionNumber: nextVersionNumber, content: input.content, editedAt: now }],
    reviewStatus: "pending",
    updatedAt: now,
  };

  const updatedSession: WorkspaceSessionRecord = {
    ...session,
    outputs: isNew ? [...session.outputs, updatedOutput] : session.outputs.map((o) => (o.outputId === updatedOutput.outputId ? updatedOutput : o)),
    history: [
      ...session.history,
      { label: isNew ? "Output Created" : `Output Versioned (v${nextVersionNumber})`, occurredAt: now },
    ],
  };
  upsert(updatedSession);

  emitGrowthEvent({
    eventType: isNew ? "OUTPUT_CREATED" : nextVersionNumber > 1 ? "OUTPUT_VERSIONED" : "OUTPUT_UPDATED",
    workspaceSessionId: sessionId,
    outputId: updatedOutput.outputId,
    missionId: session.context.missionId,
  });

  return { session: updatedSession, output: updatedOutput };
}

function updateOutput(
  session: WorkspaceSessionRecord,
  outputId: string,
  patch: Partial<OutputRecord>,
  historyLabel: string
): { session: WorkspaceSessionRecord; output: OutputRecord } | null {
  const output = session.outputs.find((o) => o.outputId === outputId);
  if (!output) return null;
  const now = new Date().toISOString();
  const updatedOutput: OutputRecord = { ...output, ...patch, updatedAt: now };
  const updatedSession: WorkspaceSessionRecord = {
    ...session,
    outputs: session.outputs.map((o) => (o.outputId === outputId ? updatedOutput : o)),
    history: [...session.history, { label: historyLabel, occurredAt: now }],
  };
  upsert(updatedSession);
  return { session: updatedSession, output: updatedOutput };
}

/** Companion Orchestrator (Sprint B3) — khởi tạo Review Flow cho 1
    Output. KHÔNG có AI Review thật ở sprint này — chỉ chuẩn hóa trạng
    thái + phát Event, để Sprint sau (Companion Review thật) có chỗ cắm
    vào mà không cần đổi luồng. */
export function startReview(sessionId: string, outputId: string) {
  const session = getSession(sessionId);
  if (!session) return null;
  const result = updateOutput(session, outputId, { reviewStatus: "pending" }, "Review Started");
  if (!result) return null;
  emitGrowthEvent({ eventType: "REVIEW_STARTED", workspaceSessionId: sessionId, outputId, missionId: session.context.missionId });
  return result;
}

/** Đánh dấu Output đã được xem lại — tự người dùng xác nhận (chưa có AI
    Review), vẫn đi qua đúng luồng `reviewStatus` đã chuẩn hóa. */
export function markOutputReviewed(sessionId: string, outputId: string) {
  const session = getSession(sessionId);
  if (!session) return null;
  const result = updateOutput(session, outputId, { reviewStatus: "reviewed" }, "Review Completed");
  if (!result) return null;
  emitGrowthEvent({ eventType: "REVIEW_COMPLETED", workspaceSessionId: sessionId, outputId, missionId: session.context.missionId });
  return result;
}

/** Companion Orchestrator (Sprint B3) — khởi tạo Reflection Flow, phát
    `REFLECTION_STARTED`. Câu hỏi chuẩn nằm ở `execution-orchestrator.ts`
    (`REFLECTION_QUESTIONS`), không lặp lại ở đây. */
export function startReflection(sessionId: string, outputId: string) {
  const session = getSession(sessionId);
  if (!session) return null;
  const result = updateOutput(session, outputId, { reflectionStatus: "pending" }, "Reflection Started");
  if (!result) return null;
  emitGrowthEvent({ eventType: "REFLECTION_STARTED", workspaceSessionId: sessionId, outputId, missionId: session.context.missionId });
  return result;
}

/** Lưu câu trả lời Reflection thật — dữ liệu thuộc Output (Workspace sở
    hữu), Companion chỉ điều phối lúc nào hỏi, không tự lưu dữ liệu riêng
    (Role & Responsibility Matrix mục 4/11). */
export function submitReflection(
  sessionId: string,
  outputId: string,
  answers: { question: string; answer: string }[]
) {
  const session = getSession(sessionId);
  if (!session) return null;
  const now = new Date().toISOString();
  const output = session.outputs.find((o) => o.outputId === outputId);
  if (!output) return null;
  const result = updateOutput(
    session,
    outputId,
    {
      reflectionStatus: "submitted",
      reflections: [...output.reflections, ...answers.map((a) => ({ ...a, submittedAt: now }))],
    },
    "Reflection Completed"
  );
  if (!result) return null;
  emitGrowthEvent({ eventType: "REFLECTION_COMPLETED", workspaceSessionId: sessionId, outputId, missionId: session.context.missionId });
  return result;
}

/**
 * AI Agent Integration MVP — Writer Agent chạy thật (hoặc mock nếu chưa
 * cấu hình API key), lưu Output như 1 phiên bản mới qua `saveOutputVersion`
 * hiện có (không viết lại logic lưu Output) — chỉ khác nguồn `content` là
 * do Writer Agent tạo ra thay vì người dùng gõ tay.
 */
export async function runWriterAgentForOutput(
  sessionId: string,
  input: { goal: string; blueprintName: string; taskName: string; context?: string; userInput?: string; outputType: OutputType }
): Promise<{ session: WorkspaceSessionRecord; output: OutputRecord; agentResult: WriterAgentResult } | null> {
  const run = startAgentRun(sessionId, "Writer Agent");
  const provider = getProviderForCapability("writing.draft"); // PHASE 4 EPIC 01: AI Provider Manager
  try {
    const agentResult = await provider.execute<WriterAgentResult>("writer", {
      goal: input.goal,
      blueprintName: input.blueprintName,
      taskName: input.taskName,
      context: input.context,
      userInput: input.userInput,
      outputFormat: input.outputType,
    });
    const saved = saveOutputVersion(sessionId, { type: input.outputType, content: agentResult.draftOutput });
    if (!saved) {
      failAgentRun(run.runId, "Không tìm thấy Session để lưu Output.");
      return null;
    }
    const withDraftStatus = updateOutput(saved.session, saved.output.outputId, { approvalStatus: "draft" }, "AI Draft Created");
    completeAgentRun(run.runId, agentResult.isMock);
    return withDraftStatus ? { ...withDraftStatus, agentResult } : { ...saved, agentResult };
  } catch (err) {
    failAgentRun(run.runId, err instanceof Error ? err.message : "Lỗi không xác định.");
    return null;
  }
}

/**
 * AI Agent Integration MVP — Reviewer Agent review Output thật. Reviewer
 * KHÔNG tự approve — chỉ ghi `agentReview` + gợi ý `approvalRecommendation`.
 * "approve" → `approvalStatus: "reviewed"` (chờ User bấm Approve thật qua
 * `approveOutput`); "revise" → `approvalStatus: "needs_revision"`.
 */
export async function runReviewerAgentForOutput(
  sessionId: string,
  outputId: string,
  input: { qaChecklist: string[]; goal: string; expectedOutput?: string }
): Promise<{ session: WorkspaceSessionRecord; output: OutputRecord; agentResult: ReviewerAgentResult } | null> {
  const session = getSession(sessionId);
  const output = session?.outputs.find((o) => o.outputId === outputId);
  if (!session || !output) return null;
  const latestContent = output.versions[output.versions.length - 1]?.content ?? "";

  const run = startAgentRun(sessionId, "Reviewer Agent", outputId);
  const provider = getProviderForCapability("writing.review"); // PHASE 4 EPIC 01: AI Provider Manager
  try {
    const agentResult = await provider.execute<ReviewerAgentResult>("reviewer", {
      draftOutput: latestContent,
      qaChecklist: input.qaChecklist,
      goal: input.goal,
      expectedOutput: input.expectedOutput,
    });
    const approvalStatus: ApprovalStatus = agentResult.approvalRecommendation === "approve" ? "reviewed" : "needs_revision";
    const result = updateOutput(session, outputId, { agentReview: agentResult, approvalStatus }, "Output Reviewed by AI Agent");
    if (!result) {
      failAgentRun(run.runId, "Không cập nhật được Output.");
      return null;
    }
    emitGrowthEvent({ eventType: "OUTPUT_REVIEWED", workspaceSessionId: sessionId, outputId, missionId: session.context.missionId });
    if (approvalStatus === "reviewed") {
      emitGrowthEvent({ eventType: "USER_APPROVAL_REQUIRED", workspaceSessionId: sessionId, outputId, missionId: session.context.missionId });
    }
    completeAgentRun(run.runId, agentResult.isMock);
    return { ...result, agentResult };
  } catch (err) {
    failAgentRun(run.runId, err instanceof Error ? err.message : "Lỗi không xác định.");
    return null;
  }
}

/**
 * User bấm Approve — QUYẾT ĐỊNH CUỐI, không phải Agent. Dùng lại
 * `startReview`/`markOutputReviewed` đã có (Sprint B3) để đặt
 * `reviewStatus: "reviewed"` — KHÔNG nới lỏng điều kiện Portfolio đã khóa
 * (Sprint B4 vẫn yêu cầu thêm `reflectionStatus: "submitted"` trước khi
 * `promoteEligibleOutputs()` nhận Output này).
 */
export function approveOutput(sessionId: string, outputId: string) {
  startReview(sessionId, outputId);
  const reviewed = markOutputReviewed(sessionId, outputId);
  if (!reviewed) return null;
  return updateOutput(reviewed.session, outputId, { approvalStatus: "approved" }, "User Approved Output");
}
