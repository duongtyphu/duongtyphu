/**
 * SPRINT A04 — Mentor Conversation Engine: Mentor State.
 *
 * 7 trạng thái hội thoại của Mentor — STATE MACHINE THUẦN, chỉ đọc tín
 * hiệu đã có sẵn (`hasGoal`/`needsClarification`/`strategy`) để suy ra
 * trạng thái tiếp theo. Không AI, không side-effect, không đọc/ghi đâu.
 */

import type { ConversationStrategyKind } from "./conversation-strategy";

export type MentorState = "greeting" | "discover" | "clarify" | "plan" | "guide" | "reflect" | "summarize";

export type MentorStateInput = {
  currentState: MentorState;
  /** Đã phát hiện được Goal nào chưa (`detectedGoal !== null`). */
  hasGoal: boolean;
  needsClarification: boolean;
  strategy: ConversationStrategyKind;
};

/**
 * `"greeting"` dùng ĐÚNG luật giống `"discover"` (không tự động
 * "greeting → discover" vô điều kiện) — vì lượt hội thoại ĐẦU TIÊN vẫn
 * có thể đã đủ rõ ràng (Goal Detection ở A03 không cần nhiều lượt), nên
 * pipeline phải cho phép nhảy thẳng `"greeting" → "plan"` khi tín hiệu đã
 * đủ rõ ngay từ câu đầu.
 */
export function nextMentorState(input: MentorStateInput): MentorState {
  const { currentState, hasGoal, needsClarification, strategy } = input;

  switch (currentState) {
    case "greeting":
    case "discover":
      if (!hasGoal) return "discover";
      if (needsClarification) return "clarify";
      return "plan";
    case "clarify":
      return needsClarification ? "clarify" : "plan";
    case "plan":
      return strategy === "reflect" ? "reflect" : "guide";
    case "guide":
      return strategy === "reflect" ? "reflect" : "guide";
    case "reflect":
      return "summarize";
    case "summarize":
      return "summarize";
    default:
      return "discover";
  }
}
