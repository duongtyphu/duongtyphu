/**
 * EPIC-A02 — Goal Engine Foundation: Goal Summary.
 *
 * `GoalSummary` tổng kết trạng thái Goal hiện tại của phiên chat, để
 * Companion (Runtime tương lai) biết "đang thiếu gì" trước khi trả lời.
 * CHỈ SHAPE dữ liệu + helper thuần dựng object — không suy luận/AI nào ở
 * đây.
 */

import type { Goal } from "./goal";
import { clampConfidence } from "./goal";

export type GoalSummary = {
  /** Goal chính đang được xem là trọng tâm — `null` nếu chưa xác định
      được Goal nào (trạng thái trung thực, không bịa Goal). */
  primaryGoal: Goal | null;
  /** Mức tự tin tổng thể của toàn bộ summary (0-1) — có thể khác
      `primaryGoal.confidence` nếu summary cân nhắc thêm yếu tố khác. */
  confidence: number;
  /** Những thông tin còn thiếu để hiểu đầy đủ Goal — mỗi phần tử 1 ý
      ngắn, dạng dữ liệu thuần (không phải câu hỏi gửi thẳng cho user). */
  missingInformation: string[];
  /** Câu hỏi Companion NÊN hỏi tiếp — dữ liệu gợi ý; Runtime tương lai
      quyết định có dùng nguyên văn hay không. */
  suggestedQuestions: string[];
};

/** Summary rỗng, trung thực — dùng khi chưa có đủ dữ liệu để tóm tắt Goal
    nào (KHÔNG bịa `primaryGoal`). */
export function createEmptyGoalSummary(): GoalSummary {
  return {
    primaryGoal: null,
    confidence: 0,
    missingInformation: [],
    suggestedQuestions: [],
  };
}

/** Helper thuần dựng `GoalSummary` từ dữ liệu đã có sẵn — không tự suy
    luận thêm gì ngoài giá trị mặc định hợp lý (confidence kế thừa từ
    `primaryGoal` nếu không truyền riêng). */
export function buildGoalSummary(input: {
  primaryGoal: Goal | null;
  confidence?: number;
  missingInformation?: string[];
  suggestedQuestions?: string[];
}): GoalSummary {
  return {
    primaryGoal: input.primaryGoal,
    confidence: clampConfidence(input.confidence ?? input.primaryGoal?.confidence ?? 0),
    missingInformation: input.missingInformation ?? [],
    suggestedQuestions: input.suggestedQuestions ?? [],
  };
}
