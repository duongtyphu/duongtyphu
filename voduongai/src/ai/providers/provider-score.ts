/**
 * PHASE 4 EPIC 01 — ProviderScore.
 *
 * View tính toán (không lưu trữ riêng) từ `ProviderExecutionLog` — dùng
 * để `ModelRouter` xếp hạng Provider nào nên được ưu tiên chọn khi có
 * nhiều Provider cùng khả dụng cho 1 capability. Điểm số ở đây là
 * heuristic MVP (tỷ lệ thành công + tốc độ trung bình), KHÔNG phải điểm
 * chất lượng nội dung — chất lượng nội dung do con người/Reviewer Agent
 * chấm (`docs/AI_SANDBOX.md` Phần I, `docs/AI_CERTIFICATION_SYSTEM.md`).
 */
import "server-only";
import { listExecutions } from "./provider-execution-log";

export type ProviderScoreRecord = {
  providerId: string;
  totalRuns: number;
  successRate: number; // 0-1
  averageLatencyMs: number;
  /** 0-100 — điểm tổng hợp: 70% tỷ lệ thành công + 30% tốc độ. */
  overallScore: number;
};

const NEUTRAL_DEFAULT_SCORE = 50; // chưa có lịch sử — không thiên vị Provider nào

export function computeProviderScore(providerId: string): ProviderScoreRecord {
  const runs = listExecutions(providerId);
  if (runs.length === 0) {
    return { providerId, totalRuns: 0, successRate: 0, averageLatencyMs: 0, overallScore: NEUTRAL_DEFAULT_SCORE };
  }

  const successCount = runs.filter((r) => r.success).length;
  const successRate = successCount / runs.length;
  const averageLatencyMs = runs.reduce((sum, r) => sum + r.latencyMs, 0) / runs.length;
  const speedScore = Math.max(0, 30 - Math.floor(averageLatencyMs / 500));
  const overallScore = Math.round(successRate * 70 + speedScore);

  return { providerId, totalRuns: runs.length, successRate, averageLatencyMs, overallScore };
}
