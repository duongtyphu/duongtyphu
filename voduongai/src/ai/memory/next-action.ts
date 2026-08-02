/**
 * SPRINT A06 — Memory & Reflection Engine: Next Action.
 *
 * `buildNextAction()` gợi ý 1 hành động tiếp theo — rule-based,
 * deterministic, dựa trên `MemoryDecision` (Phần 3) + `ProgressSnapshot`
 * (Phần 5) đã có sẵn. KHÔNG kết nối Runtime nào.
 */

import type { MemoryDecision } from "./memory-policy";
import type { ProgressSnapshot } from "./progress";

export type NextActionType =
  | "continue-learning"
  | "clarify-goal"
  | "review"
  | "explore-platform"
  | "practice"
  | "rest";

export type NextAction = {
  actionType: NextActionType;
  reason: string;
  priority: number;
};

/**
 * 6 luật ưu tiên, xét theo thứ tự — đảm bảo cả 6 `NextActionType` đều có
 * đúng 1 điều kiện kích hoạt riêng:
 * 1. Chưa có mục tiêu nào đang theo đuổi → `clarify-goal`.
 * 2. Trí nhớ vừa rồi chưa đủ chắc chắn (`status="review"`) → `review`.
 * 3. Xu hướng học tập đang đi xuống → `rest` (khuyên nghỉ trước khi tiếp
 *    tục, thay vì ép học thêm khi đang gặp khó khăn).
 * 4. Vừa ghi nhận 1 sở thích học tập (`status="keep"`, `type="preference"`)
 *    → `practice` (áp dụng ngay).
 * 5. Vừa ghi nhận tiến bộ học tập (`status="keep"`, `type="learning"`) và
 *    xu hướng đang lên → `continue-learning`.
 * 6. Còn lại → `explore-platform`.
 */
export function buildNextAction(input: { memoryDecision: MemoryDecision; progress: ProgressSnapshot }): NextAction {
  const { memoryDecision, progress } = input;

  if (progress.activeGoals === 0) {
    return {
      actionType: "clarify-goal",
      reason: "Chưa có mục tiêu nào đang theo đuổi — cần xác định trước khi tiếp tục.",
      priority: 1,
    };
  }

  if (memoryDecision.status === "review") {
    return {
      actionType: "review",
      reason: "Có thông tin chưa chắc chắn cần xác nhận lại trước khi ghi nhớ chính thức.",
      priority: 1,
    };
  }

  if (progress.learningTrend === "declining") {
    return {
      actionType: "rest",
      reason: "Xu hướng học tập đang chững lại — nên nghỉ ngơi trước khi tiếp tục.",
      priority: 2,
    };
  }

  if (memoryDecision.status === "keep" && memoryDecision.candidate?.type === "preference") {
    return {
      actionType: "practice",
      reason: "Vừa ghi nhận 1 sở thích học tập — có thể áp dụng ngay vào 1 bài thực hành.",
      priority: 2,
    };
  }

  if (
    memoryDecision.status === "keep" &&
    memoryDecision.candidate?.type === "learning" &&
    progress.learningTrend === "improving"
  ) {
    return {
      actionType: "continue-learning",
      reason: "Đang có tiến bộ rõ rệt — tiếp tục học tiếp.",
      priority: 2,
    };
  }

  return {
    actionType: "explore-platform",
    reason: "Chưa có tín hiệu rõ ràng — gợi ý khám phá thêm các khu vực khác của nền tảng.",
    priority: 3,
  };
}
