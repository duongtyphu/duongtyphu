/**
 * SPRINT A04 — Mentor Conversation Engine: Mentor Pipeline.
 *
 * Nối các mảnh đã có sẵn từ A02/A03/A04 thành 1 pipeline:
 * Conversation → Goal Detection → Goal Planning → Conversation Strategy →
 * Mentor Response → Next Step. CHỈ orchestration — không phát minh logic
 * mới, không kết nối Runtime/Chat API/UI/Database nào.
 */

import type { Conversation } from "./goal-detector";
import { goalCandidateToGoal } from "./goal-detector";
import type { Goal } from "./goal";
import { detectGoalCandidates, pickPrimaryCandidate } from "./goal-detector.rules";
import { buildClarification } from "./goal-clarification";
import { buildGoalPlan, type GoalPlan } from "./goal-plan";
import { selectConversationStrategy, type ConversationStrategy } from "./conversation-strategy";
import { buildMentorResponse, type MentorResponse } from "./mentor-response";
import { nextMentorState, type MentorState } from "./mentor-state";

export type MentorPipelineResult = {
  detectedGoal: Goal | null;
  goalPlan: GoalPlan | null;
  strategy: ConversationStrategy;
  mentorResponse: MentorResponse;
  state: MentorState;
};

/**
 * Helper thuần — chạy trọn 1 lượt pipeline cho 1 `Conversation`. Không
 * mutate `conversation` truyền vào (mọi hàm con đã tự đảm bảo điều này ở
 * A02/A03). `currentState` mặc định `"greeting"` — đúng điểm bắt đầu 1
 * phiên chat mới.
 *
 * Id của `detectedGoal` = `category` của candidate được chọn — cùng chiến
 * lược deterministic đã dùng ở `updateGoalSessionFromCandidates()` (A03),
 * vì detector chỉ sinh tối đa 1 candidate/category mỗi lần detect.
 */
export function runMentorPipeline(conversation: Conversation, currentState: MentorState = "greeting"): MentorPipelineResult {
  const candidates = detectGoalCandidates(conversation);
  const primary = pickPrimaryCandidate(candidates);
  const clarification = buildClarification(primary);

  const detectedGoal = primary ? goalCandidateToGoal(primary, primary.category) : null;
  const goalPlan = detectedGoal
    ? buildGoalPlan({ goal: detectedGoal, missingInformation: primary?.missingInformation })
    : null;

  const strategy = selectConversationStrategy({
    goal: detectedGoal,
    needsClarification: clarification.needsClarification,
    knowledgeGapCount: goalPlan?.knowledgeGap.length ?? 0,
  });

  const mentorResponse = buildMentorResponse({ strategy, goalPlan, clarification });

  const state = nextMentorState({
    currentState,
    hasGoal: detectedGoal !== null,
    needsClarification: clarification.needsClarification,
    strategy: strategy.kind,
  });

  return { detectedGoal, goalPlan, strategy, mentorResponse, state };
}
