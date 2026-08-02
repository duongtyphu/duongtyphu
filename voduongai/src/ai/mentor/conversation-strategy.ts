/**
 * SPRINT A04 — Mentor Conversation Engine: Conversation Strategy.
 *
 * Chọn 1 trong 6 chiến lược hội thoại cho Mentor, dựa HOÀN TOÀN vào tín
 * hiệu đã có sẵn từ A02 (`Goal.status`) và A03 (`ConfidenceBand`,
 * `needsClarification`) cộng 1 giá trị tính sẵn ở nơi gọi
 * (`knowledgeGapCount`). Rule-based, deterministic — KHÔNG Prompt, KHÔNG
 * gọi AI/LLM/Provider nào.
 */

import type { Goal } from "./goal";
import { classifyConfidenceBand, type ConfidenceBand } from "./goal-detector.rules";

export type ConversationStrategyKind = "clarify" | "teach" | "coach" | "recommend" | "encourage" | "reflect";

export type ConversationStrategy = {
  kind: ConversationStrategyKind;
  /** Lý do chọn chiến lược này — phục vụ giải thích/debug, không phải nội
      dung gửi thẳng cho user. */
  reason: string;
};

export type ConversationStrategyInput = {
  /** Goal đang xét — `null` nếu chưa phát hiện được Goal nào. */
  goal: Goal | null;
  /** Đã tính sẵn ở A03 (`ClarificationResult.needsClarification`). */
  needsClarification: boolean;
  /** Số mục thông tin còn thiếu — thường là `GoalPlan.knowledgeGap.length`. */
  knowledgeGapCount: number;
};

/**
 * 7 luật ưu tiên, xét theo thứ tự — đảm bảo cả 6 `ConversationStrategyKind`
 * đều có đúng 1 điều kiện kích hoạt riêng, không chồng lấn:
 * 1. Không có Goal → `clarify`.
 * 2. Goal chưa đủ rõ (`needsClarification`) → `clarify`.
 * 3. Goal đã đạt (`status="achieved"`) → `reflect`.
 * 4. Goal đang dừng/bỏ dở (`status="paused"|"abandoned"`) → `encourage`.
 * 5. Goal đủ rõ (`ConfidenceBand="clear"`) và không còn thiếu thông tin →
 *    `recommend`.
 * 6. Còn thiếu thông tin (`knowledgeGapCount>0`) → `teach`.
 * 7. Còn lại (đủ rõ nhưng chưa xếp được `recommend`/`teach`) → `coach`.
 */
export function selectConversationStrategy(input: ConversationStrategyInput): ConversationStrategy {
  const { goal, needsClarification, knowledgeGapCount } = input;

  if (!goal) {
    return { kind: "clarify", reason: "Chưa xác định được mục tiêu nào — cần hỏi làm rõ trước." };
  }

  if (needsClarification) {
    return { kind: "clarify", reason: "Mục tiêu chưa đủ rõ ở mức phiên chat — cần hỏi thêm." };
  }

  if (goal.status === "achieved") {
    return { kind: "reflect", reason: "Mục tiêu đã đạt được — nên cùng nhìn lại quá trình." };
  }

  if (goal.status === "paused" || goal.status === "abandoned") {
    return { kind: "encourage", reason: "Mục tiêu đang tạm dừng/bỏ dở — cần động viên quay lại." };
  }

  const band: ConfidenceBand = classifyConfidenceBand(goal.confidence);

  if (band === "clear" && knowledgeGapCount === 0) {
    return { kind: "recommend", reason: "Mục tiêu đã rõ và đủ thông tin — có thể đề xuất bước hành động cụ thể." };
  }

  if (knowledgeGapCount > 0) {
    return { kind: "teach", reason: "Còn khoảng trống kiến thức cần lấp trước khi hành động." };
  }

  return { kind: "coach", reason: "Mục tiêu đã rõ — đồng hành để người dùng tự tiến bước tiếp theo." };
}
