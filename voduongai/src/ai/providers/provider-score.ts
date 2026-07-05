/**
 * Provider Wave 1 — ProviderScore.
 *
 * View tính toán (không lưu trữ riêng) từ `ProviderExecutionLog` +
 * `adapter.costProfile`/`adapter.qualityProfile`/`speedProfile`/`reliabilityProfile` — dùng để `ModelRouter`
 * xếp hạng Provider nào nên được ưu tiên chọn khi có nhiều Provider cùng
 * khả dụng cho 1 capability ("Benchmark Selection").
 *
 * 6 trục điểm theo đúng yêu cầu EPIC 01 (`quality`, `speed`, `cost`,
 * `reliability`, `blueprintCompliance`, `userApprovalRate`), mỗi trục
 * 0-100. Khi CHƯA có `ProviderExecutionLog` thật (`totalRuns === 0`),
 * `quality`/`speed`/`reliability` dùng `adapter.qualityProfile`/`speedProfile`/`reliabilityProfile` (Provider
 * Wave 1, tự khai báo) làm PRIOR — rõ ràng khác điểm đo thật, không trộn
 * lẫn 2 khái niệm; khi đã có dữ liệu thật, chỉ dùng dữ liệu thật, không
 * còn pha trộn với con số tự khai báo. `blueprintCompliance`/
 * `userApprovalRate` vẫn là placeholder trung tính cho tới khi nối dữ
 * liệu QA/Certification/Approval thật (ngoài phạm vi Sprint này).
 */
import "server-only";
import { listExecutions } from "./provider-execution-log";
import { providerRegistry } from "./registry";

export type ProviderScoreRecord = {
  providerId: string;
  totalRuns: number;
  quality: number;
  speed: number;
  cost: number;
  reliability: number;
  blueprintCompliance: number;
  userApprovalRate: number;
  /** Tổng hợp có trọng số — dùng để ModelRouter xếp hạng. */
  overallScore: number;
};

const NEUTRAL_PLACEHOLDER = 50; // chưa có dữ liệu thật/tự khai báo — không thiên vị Provider nào

/** Trọng số MVP — tổng = 1. Ưu tiên độ tin cậy + tốc độ (đo được thật
    hôm nay) hơn 3 trục còn placeholder. */
const WEIGHTS = {
  reliability: 0.35,
  speed: 0.25,
  cost: 0.15,
  quality: 0.1,
  blueprintCompliance: 0.1,
  userApprovalRate: 0.05,
} as const;

function computeCostScore(providerId: string): number {
  const adapter = providerRegistry.get(providerId);
  if (!adapter) return NEUTRAL_PLACEHOLDER;
  const { estimate } = adapter.estimateCost({ taskType: "", input: {} });
  if (estimate <= 0) return 100; // Mock/Ollama — miễn phí
  // Thang so sánh tương đối MVP: 0.01 USD/1k token trở lên coi là "đắt" (điểm thấp).
  const normalized = Math.max(0, 100 - Math.round((estimate / 0.01) * 100));
  return Math.min(100, normalized);
}

export function computeProviderScore(providerId: string): ProviderScoreRecord {
  const runs = listExecutions(providerId);
  const adapter = providerRegistry.get(providerId);
  const priorQuality = adapter?.qualityProfile.reportedQuality ?? NEUTRAL_PLACEHOLDER;
  const priorSpeed = adapter?.speedProfile.reportedSpeed ?? NEUTRAL_PLACEHOLDER;
  const priorReliability = adapter?.reliabilityProfile.reportedReliability ?? NEUTRAL_PLACEHOLDER;

  let reliability = priorReliability;
  let speed = priorSpeed;
  const quality = priorQuality; // chưa có cách đo chất lượng nội dung thật ở Provider Layer — luôn dùng prior tự khai báo (xem docs/AI_SANDBOX.md Phần I)

  if (runs.length > 0) {
    const successCount = runs.filter((r) => r.success).length;
    reliability = Math.round((successCount / runs.length) * 100);
    const averageLatencyMs = runs.reduce((sum, r) => sum + r.latencyMs, 0) / runs.length;
    speed = Math.max(0, 100 - Math.floor(averageLatencyMs / 50));
  }

  const cost = computeCostScore(providerId);
  const blueprintCompliance = NEUTRAL_PLACEHOLDER;
  const userApprovalRate = NEUTRAL_PLACEHOLDER;

  const overallScore = Math.round(
    reliability * WEIGHTS.reliability +
      speed * WEIGHTS.speed +
      cost * WEIGHTS.cost +
      quality * WEIGHTS.quality +
      blueprintCompliance * WEIGHTS.blueprintCompliance +
      userApprovalRate * WEIGHTS.userApprovalRate
  );

  return {
    providerId,
    totalRuns: runs.length,
    quality,
    speed,
    cost,
    reliability,
    blueprintCompliance,
    userApprovalRate,
    overallScore,
  };
}
