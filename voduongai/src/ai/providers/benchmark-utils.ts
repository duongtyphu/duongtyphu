import "server-only";
import type { ProviderExecuteRequest, ProviderAdapter, ProviderBenchmarkResult } from "./types";

/**
 * Chạy 1 `ProviderExecuteRequest` thật qua chính `adapter.execute()` của
 * nó và tính điểm Benchmark MVP — dùng chung cho cả 4 Adapter để không
 * lặp lại logic đo thời gian/tính điểm 4 lần.
 *
 * Công thức điểm (MVP, không phải chấm chất lượng nội dung): thành công
 * → điểm nền 70 + tối đa 30 điểm tốc độ (càng nhanh càng cao, trần ở
 * latency ≤500ms); thất bại → 0. Chấm chất lượng nội dung thật vẫn cần
 * người/Reviewer Agent — xem `docs/AI_SANDBOX.md` Phần I.
 */
export async function runAdapterBenchmark(
  adapter: ProviderAdapter,
  request: ProviderExecuteRequest
): Promise<ProviderBenchmarkResult> {
  const startedAt = Date.now();
  try {
    const result = await adapter.execute(request);
    const latencyMs = Date.now() - startedAt;
    const speedScore = Math.max(0, 30 - Math.floor(latencyMs / 500));
    return {
      providerId: adapter.providerId,
      capability: request.taskType,
      score: 70 + Math.min(30, speedScore),
      latencyMs,
      isMock: result.isMock,
      ranAt: new Date().toISOString(),
    };
  } catch {
    return {
      providerId: adapter.providerId,
      capability: request.taskType,
      score: 0,
      latencyMs: Date.now() - startedAt,
      isMock: false,
      ranAt: new Date().toISOString(),
    };
  }
}
