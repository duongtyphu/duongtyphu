/**
 * INF-01 — Tier: Specialized — OpenRouterProviderAdapter.
 *
 * OpenRouter là 1 lớp router/aggregator đứng trước nhiều model khác nhau,
 * nhưng expose ra ngoài 1 API OpenAI-compatible Chat Completions (public
 * docs) — cùng shape request/response với `openai-provider-adapter.ts`,
 * chỉ khác endpoint/model/key (`model` dùng format `vendor/model-id`).
 * Nơi DUY NHẤT được phép gọi thẳng `openrouter.ai`.
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

const DEFAULT_MODEL = "openai/gpt-4o-mini";
// FIX INF-01 — thêm làm LỰA CHỌN (không phải mặc định, DEFAULT_MODEL giữ
// nguyên "openai/gpt-4o-mini") — caller có thể tự chọn qua
// `request.model: "openrouter/free"` nếu muốn dùng nhóm model miễn phí
// của OpenRouter. Sprint này KHÔNG đổi mặc định sang lựa chọn này.
const FREE_TIER_MODEL = "openrouter/free";
const ENV_VAR = "OPENROUTER_API_KEY";
const BASE_URL = "https://openrouter.ai/api/v1";

export class OpenRouterProviderAdapter implements ProviderAdapter {
  readonly providerId = "openrouter";
  readonly name = "OpenRouter Provider";
  readonly tier = "specialized" as const;
  readonly providerType = "llm" as const;
  readonly supportedModels = [DEFAULT_MODEL, FREE_TIER_MODEL];
  readonly supportedCapabilities = ALL_TEXT_CAPABILITIES;
  readonly modelRegistry = [
    { modelId: DEFAULT_MODEL, contextWindow: 128_000, description: "OpenRouter — router/aggregator, truy cập nhiều model qua 1 API." },
    {
      modelId: FREE_TIER_MODEL,
      // Context window thay đổi theo model miễn phí đang được route tới
      // tại thời điểm gọi — chưa có 1 con số cố định đáng tin cậy, dùng
      // `0` làm quy ước "chưa xác nhận" (cùng cách Cerebras xử lý).
      contextWindow: 0,
      description: "OpenRouter — nhóm model miễn phí (tuỳ chọn, không phải mặc định), context window đổi theo model đang được route.",
    },
  ];
  readonly costProfile = { inputPer1kTokens: 0.00015, outputPer1kTokens: 0.0006, currency: "USD" as const };
  readonly qualityProfile = { reportedQuality: 80 };
  readonly speedProfile = { reportedSpeed: 75 };
  readonly reliabilityProfile = { reportedReliability: 75 };
  readonly privacyProfile = {
    sendsDataExternally: true,
    dataResidencyNote: "Dữ liệu gửi qua hạ tầng router bên thứ ba rồi tới model đích — theo chính sách dữ liệu công khai của OpenRouter.",
  };
  readonly configuration = { envVar: ENV_VAR };
  readonly securityProfile = {
    keyStorage: "server-only-env" as const,
    loggingPolicy: "never-log-key-or-raw-content" as const,
    dataRetentionNote: "Theo chính sách dữ liệu công khai của OpenRouter — Owner tự rà soát trước khi gửi dữ liệu nhạy cảm.",
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
    if (!res.ok) throw new Error(`OpenRouter API lỗi: ${res.status}`);
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
