/**
 * Provider Wave 1 — Tier: Specialized — CohereProviderAdapter.
 *
 * Nơi DUY NHẤT được phép gọi thẳng `api.cohere.ai`. Chuyên biệt cho các
 * tác vụ doanh nghiệp/phân loại/enterprise text-generation.
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

const DEFAULT_MODEL = "command-r";
const ENV_VAR = "COHERE_API_KEY";

export class CohereProviderAdapter implements ProviderAdapter {
  readonly providerId = "cohere";
  readonly name = "Cohere Provider";
  readonly tier = "specialized" as const;
  readonly providerType = "llm" as const;
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ALL_TEXT_CAPABILITIES;
  readonly modelRegistry = [{ modelId: DEFAULT_MODEL, contextWindow: 128_000, description: "Cohere — mạnh về tác vụ doanh nghiệp/phân loại văn bản." }];
  readonly costProfile = { inputPer1kTokens: 0.0005, outputPer1kTokens: 0.0015, currency: "USD" as const };
  readonly qualityProfile = { reportedQuality: 75 };
  readonly speedProfile = { reportedSpeed: 78 };
  readonly reliabilityProfile = { reportedReliability: 80 };
  readonly privacyProfile = { sendsDataExternally: true, dataResidencyNote: "Dữ liệu gửi tới hạ tầng vendor bên thứ ba theo chính sách dữ liệu công khai của vendor." };
  readonly configuration = { envVar: ENV_VAR };
  readonly securityProfile = {
    keyStorage: "server-only-env" as const,
    loggingPolicy: "never-log-key-or-raw-content" as const,
    dataRetentionNote: "Theo chính sách dữ liệu công khai của Cohere — Owner tự rà soát trước khi gửi dữ liệu nhạy cảm.",
  };

  isAvailable(): boolean {
    return Boolean(process.env[ENV_VAR]);
  }

  async execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult> {
    const startedAt = Date.now();
    const apiKey = process.env[ENV_VAR];
    if (!apiKey) throw new Error(`Chưa cấu hình ${ENV_VAR}.`);

    const model = request.model ?? DEFAULT_MODEL;
    const prompt = String(request.input.prompt ?? "");
    const res = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, message: prompt }),
    });
    if (!res.ok) throw new Error(`Cohere API lỗi: ${res.status}`);
    const json = await res.json();
    return {
      raw: json.text ?? "",
      model,
      providerId: this.providerId,
      isMock: false,
      latencyMs: Date.now() - startedAt,
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    const available = this.isAvailable();
    return {
      providerId: this.providerId,
      available,
      reason: available ? undefined : `Thiếu ${ENV_VAR}.`,
      checkedAt: new Date().toISOString(),
    };
  }

  estimateCost(): ProviderCostEstimate {
    return { unit: "per-1k-tokens", estimate: this.costProfile.inputPer1kTokens, currency: "USD" };
  }

  async benchmark(request: ProviderExecuteRequest): Promise<ProviderBenchmarkResult> {
    return runAdapterBenchmark(this, request);
  }

  getCapabilities() {
    return this.supportedCapabilities;
  }
}
