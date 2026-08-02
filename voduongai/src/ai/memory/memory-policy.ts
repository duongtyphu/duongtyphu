/**
 * SPRINT A06 — Memory & Reflection Engine: Memory Policy.
 *
 * Không phải mọi hội thoại đều đáng ghi nhớ — `decideMemoryDecision()`
 * áp dụng chính sách CỐ ĐỊNH, rule-based lên 1 `MemoryCandidate` để
 * quyết định `keep`/`discard`/`temporary`/`review`.
 */

import type { MemoryCandidate } from "./memory-candidate";

export type MemoryDecisionStatus = "keep" | "discard" | "temporary" | "review";

export type MemoryDecision = {
  status: MemoryDecisionStatus;
  reason: string;
  candidate: MemoryCandidate | null;
};

/** Ngưỡng "đủ tin cậy để ghi chính thức" — khớp đúng ranh giới "clear"
    đã khoá ở A03 (`goal-detector.rules.ts`), không tự đặt ngưỡng riêng. */
const KEEP_THRESHOLD = 0.7;
/** Ngưỡng "còn tín hiệu nhưng cần xác nhận thêm" — khớp ranh giới
    "potential" ở A03. */
const REVIEW_THRESHOLD = 0.4;

/**
 * Chính sách CỐ ĐỊNH:
 * - Không có candidate nào → `discard` (không có gì để ghi nhớ).
 * - `shouldRemember=false` → `discard` (candidate tự đánh giá không đáng
 *   nhớ — vd. `"Xin chào"`).
 * - `shouldRemember=true` và `confidence>=0.70` → `keep`.
 * - `shouldRemember=true` và `confidence>=0.40` → `review` (đáng ngờ,
 *   cần xác nhận thêm trước khi ghi chính thức).
 * - `shouldRemember=true` và `confidence<0.40` → `temporary` (giữ tạm
 *   trong phiên, không đủ chắc chắn để ghi lâu dài).
 */
export function decideMemoryDecision(candidate: MemoryCandidate | null): MemoryDecision {
  if (!candidate) {
    return { status: "discard", reason: "Không có candidate nào để xét.", candidate: null };
  }

  if (!candidate.shouldRemember) {
    return { status: "discard", reason: candidate.reason, candidate };
  }

  if (candidate.confidence >= KEEP_THRESHOLD) {
    return { status: "keep", reason: "Đủ tin cậy để ghi nhớ chính thức.", candidate };
  }

  if (candidate.confidence >= REVIEW_THRESHOLD) {
    return { status: "review", reason: "Có tín hiệu nhưng chưa đủ chắc chắn — cần xác nhận thêm.", candidate };
  }

  return { status: "temporary", reason: "Tín hiệu yếu — chỉ giữ tạm trong phiên.", candidate };
}
