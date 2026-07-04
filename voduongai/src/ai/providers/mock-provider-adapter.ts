/**
 * PHASE 4 EPIC 01 — MockProviderAdapter.
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

export class MockProviderAdapter implements ProviderAdapter {
  readonly providerId = "mock";
  readonly name = "Mock Provider";
  readonly supportedModels = ["mock-model"];
  readonly supportedCapabilities = [
    "writing.draft",
    "writing.review",
    "writing.edit",
    "coding.general",
    "research.market-analysis",
    "research.knowledge-synthesis",
    "strategy.planning",
    "qa.review",
    "office.spreadsheet",
    "growth.goal-coaching",
    "growth.reflection-coaching",
    "research.fact-checking",
    "research.trend-scouting",
    "writing.copywriting",
    "writing.seo",
    "business.sales",
    "business.finance",
    "design.visual",
    "automation.workflow",
    "office.dashboard",
    "growth.learning-coaching",
  ];

  isAvailable(): boolean {
    return true;
  }

  async execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult> {
    const startedAt = Date.now();
    return {
      raw: JSON.stringify({
        mock: true,
        note: "[MOCK — chưa cấu hình ANTHROPIC_API_KEY/OPENAI_API_KEY/GEMINI_API_KEY]",
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
}
