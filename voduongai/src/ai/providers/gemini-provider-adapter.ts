/**
 * Provider Wave 1 — Tier: Core — GeminiProviderAdapter.
 *
 * Nơi DUY NHẤT được phép gọi thẳng `generativelanguage.googleapis.com`.
 * Đọc key từ `process.env.GEMINI_API_KEY` tại thời điểm gọi — không
 * hard-code.
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

const DEFAULT_MODEL = "gemini-1.5-flash";
const ENV_VAR = "GEMINI_API_KEY";

export class GeminiProviderAdapter implements ProviderAdapter {
  readonly providerId = "gemini";
  readonly name = "Gemini Provider";
  readonly tier = "core" as const;
  readonly providerType = "llm" as const;
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ALL_TEXT_CAPABILITIES;
  readonly modelRegistry = [{ modelId: DEFAULT_MODEL, contextWindow: 1_000_000, description: "Gemini — context window lớn, mạnh về research/tổng hợp." }];
  readonly costProfile = { inputPer1kTokens: 0.000075, outputPer1kTokens: 0.0003, currency: "USD" as const };
  readonly qualityProfile = { reportedQuality: 82 };
  readonly speedProfile = { reportedSpeed: 80 };
  readonly reliabilityProfile = { reportedReliability: 85 };
  readonly privacyProfile = { sendsDataExternally: true, dataResidencyNote: "Dữ liệu gửi tới hạ tầng vendor bên thứ ba theo chính sách dữ liệu công khai của vendor." };
  readonly configuration = { envVar: ENV_VAR };
  readonly securityProfile = {
    keyStorage: "server-only-env" as const,
    loggingPolicy: "never-log-key-or-raw-content" as const,
    dataRetentionNote: "Theo chính sách dữ liệu công khai của Google — Owner tự rà soát trước khi gửi dữ liệu nhạy cảm.",
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
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    if (!res.ok) throw new Error(`Gemini API lỗi: ${res.status}`);
    const json = await res.json();
    return {
      raw: json.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
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
