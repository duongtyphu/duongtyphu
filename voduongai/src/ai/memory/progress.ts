/**
 * SPRINT A06 — Memory & Reflection Engine: Progress.
 *
 * `buildProgressSnapshot()` tổng hợp 1 bức tranh tiến độ NGẮN từ dữ liệu
 * ĐÃ CÓ SẴN (số goal đang theo đuổi/đã hoàn thành do nơi gọi cung cấp +
 * `MemoryEntry[]` gần đây) — KHÔNG tự đọc Goal Runtime (`/portal/goals`)
 * hay bất kỳ nguồn thật nào.
 */

import { clampUnitInterval, type MemoryEntry } from "./memory-model";
import { buildReflection } from "./reflection";

export type LearningTrend = "improving" | "steady" | "declining" | "unknown";

export type ProgressSnapshot = {
  activeGoals: number;
  completedGoals: number;
  learningTrend: LearningTrend;
  confidence: number;
  recommendedFocus: string;
};

/** Suy xu hướng học tập từ tỉ lệ thành tựu/khó khăn đã tổng hợp được —
    tái dùng `buildReflection()` thay vì viết lại logic phân loại. */
function inferLearningTrend(achievementsCount: number, difficultiesCount: number): LearningTrend {
  if (achievementsCount === 0 && difficultiesCount === 0) return "unknown";
  if (achievementsCount > difficultiesCount) return "improving";
  if (difficultiesCount > achievementsCount) return "declining";
  return "steady";
}

function recommendedFocusFor(activeGoals: number, trend: LearningTrend): string {
  if (activeGoals === 0) {
    return "Nên xác định 1 mục tiêu học tập rõ ràng để bắt đầu theo dõi tiến độ.";
  }
  if (trend === "declining") {
    return "Nên xem lại các khó khăn gần đây trước khi tiếp tục mục tiêu hiện tại.";
  }
  if (trend === "improving") {
    return "Tiếp tục đà tiến bộ hiện tại với mục tiêu đang theo đuổi.";
  }
  return "Duy trì nhịp học đều đặn với mục tiêu hiện tại.";
}

/**
 * Helper thuần — `activeGoals`/`completedGoals` PHẢI do nơi gọi truyền
 * vào (không tự đọc đâu cả). `confidence` suy từ số lượng
 * `recentMemoryEntries` có sẵn (càng nhiều dữ liệu gần đây, càng tự tin
 * về bức tranh tiến độ) — công thức cố định, không ngẫu nhiên. Không
 * mutate `recentMemoryEntries`.
 */
export function buildProgressSnapshot(input: {
  activeGoals: number;
  completedGoals: number;
  recentMemoryEntries: MemoryEntry[];
}): ProgressSnapshot {
  const reflection = buildReflection(input.recentMemoryEntries);
  const learningTrend = inferLearningTrend(reflection.achievements.length, reflection.difficulties.length);
  const confidence = clampUnitInterval(input.recentMemoryEntries.length * 0.2);

  return {
    activeGoals: input.activeGoals,
    completedGoals: input.completedGoals,
    learningTrend,
    confidence,
    recommendedFocus: recommendedFocusFor(input.activeGoals, learningTrend),
  };
}
