/**
 * EPIC 03 — Sprint B3: Companion Orchestrator.
 *
 * Companion không phải chatbot — Companion là lớp điều phối đứng giữa
 * Universal Context, Workspace Session, và Growth Event Bus. Module này
 * KHÔNG lưu dữ liệu riêng ngoài Context tạm thời (Role & Responsibility
 * Matrix mục 4/11) — mọi state thật (Session/Output/Reflection) vẫn nằm
 * trong `workspace-session-store.ts` (Workspace sở hữu). Companion chỉ
 * đọc, hiểu, và gợi ý — không làm thay, không sinh Output thay, không tự
 * Unlock/đổi Journey.
 *
 * KHÔNG implement AI Agent/Multi-Agent thật ở sprint này — chỉ chuẩn bị
 * đúng chỗ cắm (xem mục "AI Agent Orchestration Ready" bên dưới).
 */

import type { WorkspaceSessionRecord, ExecutionStepId } from "./workspace-session-store";
import { EXECUTION_TIMELINE } from "./workspace-session-store";

/**
 * Execution Planner — Companion chia Mission thành các bước nhỏ, mô tả
 * rõ "đang làm gì" + "việc cần làm" cho từng bước trong Execution
 * Timeline (đã có từ Sprint B2). Đây là nguồn DUY NHẤT cho nội dung từng
 * bước — UI (`WorkspaceMvp.tsx`) chỉ hiển thị, không tự định nghĩa lại.
 */
export const EXECUTION_STEP_TASKS: Record<ExecutionStepId, { doing: string; task: string }> = {
  mission_started: { doing: "Bắt đầu Nhiệm vụ", task: "Xác nhận mục tiêu và kết quả mong đợi trước khi bắt tay vào làm." },
  preparing: { doing: "Chuẩn bị", task: "Thu thập thông tin/ngữ cảnh cần thiết trước khi viết." },
  research: { doing: "Nghiên cứu", task: "Tìm dữ liệu, ví dụ, tham khảo liên quan tới việc này." },
  draft: { doing: "Viết bản nháp", task: "Viết/dán bản nháp Kết quả đầu tiên vào khung bên dưới." },
  review: { doing: "Xem lại", task: "Đọc lại bản nháp, đối chiếu với kết quả mong đợi." },
  revision: { doing: "Chỉnh sửa", task: "Sửa lại và lưu thành phiên bản mới, không ghi đè bản cũ." },
  completed: { doing: "Hoàn thành", task: "Nhiệm vụ đã hoàn thành — Kết quả đã sẵn sàng." },
};

/** Reflection Coordination — bộ câu hỏi chuẩn, không AI, không chấm điểm
    (nhất quán Reflection Standard, Learning Asset Standard mục 12). */
export const REFLECTION_QUESTIONS = [
  "Bạn học được gì?",
  "AI giúp bạn ở đâu?",
  "Điều gì cần cải thiện?",
] as const;

/** Universal Entry Point — mọi CTA trên Portal hiển thị đúng 1 trong các
    label này, tất cả đều gọi cùng một Companion Orchestrator (qua
    `startCompanionWorkspace` hoặc các hàm điều phối ở
    `workspace-session-store.ts`). Không tạo CTA/label mới ngoài danh sách
    này khi chưa có Architecture Change Proposal. */
export const COMPANION_ENTRY_LABELS = {
  practiceWithCompanion: "Thực hành cùng Companion",
  useNowWithCompanion: "Dùng ngay cùng Companion",
  assignToCompanion: "Giao việc cho Companion",
  continueMission: "Tiếp tục Nhiệm vụ",
  createVersion2: "Tạo phiên bản 2",
  reviewWithCompanion: "Đánh giá cùng Companion",
} as const;

export type MissionUnderstanding = {
  missionGoal: string;
  expectedOutput?: string;
  currentStepId: ExecutionStepId;
  currentStepLabel: string;
  stepsRemaining: number;
  canResume: boolean;
};

/**
 * Mission Understanding — sau khi Companion nhận Context (đã có sẵn
 * trong `session.context` do Universal Context System mang theo), đọc
 * `WorkspaceSessionRecord` để biết: đang làm Mission nào, mục tiêu gì,
 * đang ở bước nào, còn bao nhiêu bước, có resume được không. KHÔNG hỏi
 * lại người dùng bất kỳ thông tin nào đã có trong Context/Session.
 */
export function buildMissionUnderstanding(session: WorkspaceSessionRecord): MissionUnderstanding {
  const currentIndex = EXECUTION_TIMELINE.findIndex((s) => s.id === session.currentStepId);
  const currentStepLabel = EXECUTION_TIMELINE[currentIndex]?.label ?? session.currentStepId;
  return {
    missionGoal: session.context.userGoal ?? session.context.title ?? "Chưa xác định mục tiêu cụ thể",
    expectedOutput: session.context.expectedOutput,
    currentStepId: session.currentStepId,
    currentStepLabel,
    stepsRemaining: Math.max(EXECUTION_TIMELINE.length - 1 - currentIndex, 0),
    canResume: session.status !== "completed",
  };
}

export type NextAction = {
  label: string;
  kind: "continue_mission" | "create_version" | "review_output" | "start_reflection" | "next_mission";
};

/**
 * Next Action Engine — Companion chỉ gợi ý ĐÚNG MỘT hành động tiếp theo,
 * không đưa danh sách dài lựa chọn. Thứ tự ưu tiên: còn bước chưa xong →
 * tiếp tục Mission; có Output đang chờ review → review; đã review nhưng
 * chưa reflect → phản ánh; đã hoàn thành và đã reflect → gợi ý Mission
 * tiếp theo (placeholder — Mission Engine thật chưa có, xem
 * `docs/SPRINT_B1_FOUNDATION_REPORT.md`); không có Output nào → tạo
 * Version đầu tiên.
 */
export function getNextAction(session: WorkspaceSessionRecord): NextAction {
  if (session.status !== "completed") {
    return { label: COMPANION_ENTRY_LABELS.continueMission, kind: "continue_mission" };
  }
  const latestOutput = session.outputs[session.outputs.length - 1];
  if (!latestOutput) {
    return { label: COMPANION_ENTRY_LABELS.createVersion2, kind: "create_version" };
  }
  if (latestOutput.reviewStatus !== "reviewed") {
    return { label: COMPANION_ENTRY_LABELS.reviewWithCompanion, kind: "review_output" };
  }
  if (latestOutput.reflectionStatus !== "submitted") {
    return { label: "Chia sẻ Chiêm nghiệm", kind: "start_reflection" };
  }
  return { label: "Chuyển sang Nhiệm vụ tiếp theo", kind: "next_mission" };
}

/**
 * AI Agent Orchestration Ready (Sprint B4+/EPIC 04) — Companion CHƯA điều
 * phối Agent thật ở Sprint B3. Đây chỉ là danh mục vai trò chuẩn bị sẵn,
 * khớp `AiProvider`/`ExecutionEngine` (extension-points.ts, Sprint B1) —
 * không implement, không gọi ở bất kỳ đâu.
 */
export const AGENT_ROLES_READY = ["Research Agent", "Writer Agent", "Reviewer Agent", "Designer Agent"] as const;
