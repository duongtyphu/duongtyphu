/**
 * INF-01 — Tier: Specialized — GroqProviderAdapter.
 *
 * Groq (LPU inference — nổi bật vì tốc độ suy luận rất nhanh) expose 1 API
 * OpenAI-compatible Chat Completions (public docs) — cùng shape request/
 * response với `openai-provider-adapter.ts`, chỉ khác endpoint/model/key.
 * Nơi DUY NHẤT được phép gọi thẳng `api.groq.com`.
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

const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const ENV_VAR = "GROQ_API_KEY";
const BASE_URL = "https://api.groq.com/openai/v1";

export class GroqProviderAdapter implements ProviderAdapter {
  readonly providerId = "groq";
  readonly name = "Groq Provider";
  readonly tier = "specialized" as const;
  readonly providerType = "llm" as const;
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ALL_TEXT_CAPABILITIES;
  readonly modelRegistry = [
    // FIX INF-01 — contextWindow cập nhật đúng 131072 theo duyệt có điều kiện.
    { modelId: DEFAULT_MODEL, contextWindow: 131_072, description: "Groq — suy luận cực nhanh (LPU), chi phí thấp." },
  ];
  readonly costProfile = { inputPer1kTokens: 0.00005, outputPer1kTokens: 0.00008, currency: "USD" as const };
  readonly qualityProfile = { reportedQuality: 78 };
  readonly speedProfile = { reportedSpeed: 98 };
  readonly reliabilityProfile = { reportedReliability: 80 };
  readonly privacyProfile = {
    sendsDataExternally: true,
    dataResidencyNote: "Dữ liệu gửi tới hạ tầng vendor bên thứ ba theo chính sách dữ liệu công khai của vendor.",
  };
  readonly configuration = { envVar: ENV_VAR };
  readonly securityProfile = {
    keyStorage: "server-only-env" as const,
    loggingPolicy: "never-log-key-or-raw-content" as const,
    dataRetentionNote: "Theo chính sách dữ liệu công khai của Groq — Owner tự rà soát trước khi gửi dữ liệu nhạy cảm.",
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
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) throw new Error(`Groq API lỗi: ${res.status}`);
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
