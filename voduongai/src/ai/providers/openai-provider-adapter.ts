/**
 * Provider Wave 1 — Tier: Core — OpenAIProviderAdapter.
 *
 * Nơi DUY NHẤT được phép gọi thẳng `api.openai.com`. Đọc key từ
 * `process.env.OPENAI_API_KEY` tại thời điểm gọi — không hard-code.
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

const DEFAULT_MODEL = "gpt-4o-mini";
const ENV_VAR = "OPENAI_API_KEY";

export class OpenAIProviderAdapter implements ProviderAdapter {
  readonly providerId = "openai";
  readonly name = "OpenAI Provider";
  readonly tier = "core" as const;
  readonly providerType = "llm" as const;
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ALL_TEXT_CAPABILITIES;
  readonly modelRegistry = [{ modelId: DEFAULT_MODEL, contextWindow: 128_000, description: "OpenAI — mạnh về coding/tool-use." }];
  readonly costProfile = { inputPer1kTokens: 0.00015, outputPer1kTokens: 0.0006, currency: "USD" as const };
  readonly qualityProfile = { reportedQuality: 85 };
  readonly speedProfile = { reportedSpeed: 85 };
  readonly reliabilityProfile = { reportedReliability: 90 };
  readonly privacyProfile = { sendsDataExternally: true, dataResidencyNote: "Dữ liệu gửi tới hạ tầng vendor bên thứ ba theo chính sách dữ liệu công khai của vendor." };
  readonly configuration = { envVar: ENV_VAR };
  readonly securityProfile = {
    keyStorage: "server-only-env" as const,
    loggingPolicy: "never-log-key-or-raw-content" as const,
    dataRetentionNote: "Theo chính sách dữ liệu công khai của OpenAI — Owner tự rà soát trước khi gửi dữ liệu nhạy cảm.",
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
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) throw new Error(`OpenAI API lỗi: ${res.status}`);
    const json = await res.json();
    return {
      raw: json.choices?.[0]?.message?.content ?? "",
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
