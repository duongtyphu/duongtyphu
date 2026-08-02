/**
 * SPRINT A04 — Mentor Conversation Engine: Mentor Response.
 *
 * `MentorResponse` CHỈ là SCHEMA cho phản hồi Mentor sẽ gửi tới người
 * dùng — mọi field lấy nguyên từ dữ liệu đã tính sẵn ở các mảnh trước đó
 * (`GoalPlan`, `ConversationStrategy`, `ClarificationResult`). KHÔNG sinh
 * nội dung AI/văn bản tự do nào ở đây.
 */

import type { GoalPlan } from "./goal-plan";
import type { ConversationStrategy } from "./conversation-strategy";
import type { ClarificationResult } from "./goal-clarification";

export type MentorResponse = {
  /** Mentor "hiểu" gì về mục tiêu hiện tại — lấy từ `GoalPlan.desiredOutcome`. */
  understanding: string;
  strategy: ConversationStrategy;
  /** Đề xuất hành động — `null` khi chiến lược là `"clarify"` (chưa đủ rõ
      để đề xuất) hoặc chưa có `GoalPlan`. */
  recommendation: string | null;
  /** Bước tiếp theo — cùng điều kiện `null` với `recommendation`. */
  nextStep: string | null;
  /** Câu hỏi làm rõ — chỉ có giá trị khi chiến lược là `"clarify"`. */
  clarification: ClarificationResult | null;
};

/** Helper thuần dựng `MentorResponse` — không tự suy luận thêm, chỉ lắp
    ráp dữ liệu đã có sẵn theo đúng chiến lược đã chọn. */
export function buildMentorResponse(input: {
  strategy: ConversationStrategy;
  goalPlan: GoalPlan | null;
  clarification: ClarificationResult | null;
}): MentorResponse {
  const { strategy, goalPlan, clarification } = input;
  const isClarifying = strategy.kind === "clarify";

  return {
    understanding: goalPlan ? goalPlan.desiredOutcome : "Chưa xác định được mục tiêu nào.",
    strategy,
    recommendation: isClarifying ? null : (goalPlan?.firstStep ?? null),
    nextStep: isClarifying ? null : (goalPlan?.nextStep ?? null),
    clarification: isClarifying ? clarification : null,
  };
}
