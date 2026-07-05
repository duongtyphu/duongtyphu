/**
 * Provider Wave 1 — Tier: Development — MockProviderAdapter.
 *
 * Không gọi mạng, không cần API key — luôn `isAvailable() === true`.
 * `ModelRouter` chọn Adapter này khi KHÔNG có Provider thật nào sẵn sàng
 * (đúng hành vi mock đã có từ AI Agent Integration MVP, nay chính thức
 * hoá thành 1 Provider trong Registry thay vì logic rẽ nhánh rời rạc).
 */
import "server-only";
import type {
  ProviderAdapter,
  ProviderExecuteRequest,
  ProviderExecuteResult,
  ProviderHealth,
  ProviderCostEstimate,
  ProviderBenchmarkResult,
} from "./types";
import { runAdapterBenchmark } from "./benchmark-utils";
import { ALL_TEXT_CAPABILITIES } from "./capability-list";

export class MockProviderAdapter implements ProviderAdapter {
  readonly providerId = "mock";
  readonly name = "Mock Provider";
  readonly tier = "development" as const;
  readonly providerType = "llm" as const;
  readonly supportedModels = ["mock-model"];
  readonly supportedCapabilities = ALL_TEXT_CAPABILITIES;
  readonly modelRegistry = [{ modelId: "mock-model", contextWindow: 0, description: "Không gọi mạng — trả JSON placeholder có cấu trúc." }];
  readonly costProfile = { inputPer1kTokens: 0, outputPer1kTokens: 0, currency: "USD" as const };
  readonly qualityProfile = { reportedQuality: 0 };
  readonly speedProfile = { reportedSpeed: 100 };
  readonly reliabilityProfile = { reportedReliability: 100 };
  readonly privacyProfile = { sendsDataExternally: false, dataResidencyNote: "Không gọi mạng — không có dữ liệu nào rời khỏi tiến trình." };
  readonly configuration = { envVar: "" }; // không cần ENV nào
  readonly securityProfile = {
    keyStorage: "server-only-env" as const,
    loggingPolicy: "never-log-key-or-raw-content" as const,
    dataRetentionNote: "Không gửi dữ liệu ra ngoài — không có vendor thật nào nhận request.",
  };

  isAvailable(): boolean {
    return true;
  }

  async execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult> {
    const startedAt = Date.now();
    return {
      raw: JSON.stringify({
        mock: true,
        note: "[MOCK — chưa cấu hình API key Provider thật nào]",
        taskType: request.taskType,
      }),
      model: this.supportedModels[0],
      providerId: this.providerId,
      isMock: true,
      latencyMs: Date.now() - startedAt,
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return { providerId: this.providerId, available: true, checkedAt: new Date().toISOString() };
  }

  estimateCost(): ProviderCostEstimate {
    return { unit: "per-request", estimate: 0, currency: "USD" };
  }

  async benchmark(request: ProviderExecuteRequest): Promise<ProviderBenchmarkResult> {
    return runAdapterBenchmark(this, request);
  }

  getCapabilities() {
    return this.supportedCapabilities;
  }
}
