/**
 * SPRINT A04 — Mentor Conversation Engine: Goal Planning.
 *
 * `GoalPlan` là bước dịch 1 `Goal` (đã "chốt" ở mức phiên chat, từ A02/A03)
 * thành 1 kế hoạch tối giản: đang thiếu gì, bước đầu tiên nên làm gì, bước
 * tiếp theo là gì. CHỈ helper thuần (string templating deterministic) —
 * KHÔNG AI, KHÔNG gọi Provider/LLM, KHÔNG đọc Database/CKOS/Memory.
 */

import { GOAL_CATEGORY_LABEL, type Goal } from "./goal";
import { classifyConfidenceBand } from "./goal-detector.rules";

export type GoalPlan = {
  goal: Goal;
  /** Kết quả mong muốn — lấy từ `goal.description` nếu có, fallback
      template theo `goal.title`. */
  desiredOutcome: string;
  /** Trạng thái hiện tại — suy ra từ dải confidence (A03), KHÔNG bịa dữ
      liệu trình độ/tiến độ thật (dự án chưa có Memory/Reflection nối vào
      đây). */
  currentState: string;
  /** Khoảng trống kiến thức — tái dùng TRỰC TIẾP `missingInformation` đã
      tính ở Goal Detection (A03), không tính lại. */
  knowledgeGap: string[];
  firstStep: string;
  nextStep: string;
};

function describeCurrentState(goal: Goal): string {
  const band = classifyConfidenceBand(goal.confidence);
  if (band === "clear") return "Đã đủ rõ để bắt đầu từ trạng thái hiện tại.";
  if (band === "potential") return "Đã có manh mối ban đầu nhưng chưa đủ rõ điểm xuất phát.";
  return "Chưa rõ điểm xuất phát hiện tại.";
}

/**
 * Helper thuần dựng `GoalPlan` từ 1 `Goal` đã có. `missingInformation`
 * (nếu truyền) lấy nguyên từ `GoalCandidate`/`ClarificationResult` — nơi
 * gọi (Pipeline) chịu trách nhiệm truyền đúng, hàm này không tự tính lại.
 * Không mutate `goal` truyền vào.
 */
export function buildGoalPlan(input: { goal: Goal; missingInformation?: string[] }): GoalPlan {
  const { goal } = input;
  const knowledgeGap = input.missingInformation ?? [];
  const label = GOAL_CATEGORY_LABEL[goal.category];

  return {
    goal,
    desiredOutcome: goal.description.trim().length > 0 ? goal.description : `Đạt được mục tiêu: ${goal.title}`,
    currentState: describeCurrentState(goal),
    knowledgeGap,
    firstStep: knowledgeGap.length > 0 ? `Làm rõ: ${knowledgeGap[0]}` : `Bắt đầu tìm hiểu về ${label}.`,
    nextStep:
      knowledgeGap.length > 1
        ? `Sau khi rõ hơn, tiếp tục làm rõ: ${knowledgeGap[1]}`
        : `Đề xuất bước hành động cụ thể tiếp theo cho ${label}.`,
  };
}
