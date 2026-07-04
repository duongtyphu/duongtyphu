/**
 * Provider Wave 1 — Tier: Specialized — PerplexityProviderAdapter.
 *
 * Nơi DUY NHẤT được phép gọi thẳng `api.perplexity.ai`. Chuyên biệt cho
 * Research (model có truy cập web-search thật ở phía vendor) — vì vậy
 * được ưu tiên cho nhóm capability "research" trong `model-router.ts`.
 * API tương thích OpenAI Chat Completions (public docs).
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

const DEFAULT_MODEL = "sonar";
const ENV_VAR = "PERPLEXITY_API_KEY";

export class PerplexityProviderAdapter implements ProviderAdapter {
  readonly providerId = "perplexity";
  readonly name = "Perplexity Provider";
  readonly tier = "specialized" as const;
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ALL_TEXT_CAPABILITIES;
  readonly modelRegistry = [{ modelId: DEFAULT_MODEL, contextWindow: 128_000, description: "Perplexity — có truy cập web-search thật ở phía vendor, mạnh về Research." }];
  readonly costProfile = { inputPer1kTokens: 0.001, outputPer1kTokens: 0.001, currency: "USD" as const };
  readonly benchmarkProfile = { reportedQuality: 82, reportedSpeed: 65, reportedReliability: 78 };
  readonly configuration = { envVar: ENV_VAR };
  readonly securityPolicy = {
    keyStorage: "server-only-env" as const,
    loggingPolicy: "never-log-key-or-raw-content" as const,
    dataRetentionNote: "Perplexity có thể truy vấn web thật để trả lời — Owner cân nhắc trước khi gửi dữ liệu nội bộ nhạy cảm.",
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
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) throw new Error(`Perplexity API lỗi: ${res.status}`);
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
}
