/**
 * Provider Wave 1 — Tier: Core — AnthropicProviderAdapter ("Claude").
 *
 * Nơi DUY NHẤT trong toàn bộ AI Workforce được phép gọi thẳng
 * `api.anthropic.com`. Không Companion/Agent nào khác được gọi trực
 * tiếp — mọi lời gọi phải đi qua `ProviderManager.execute()`
 * (`provider-manager.ts`), không có ngoại lệ.
 *
 * Đọc key từ `process.env.ANTHROPIC_API_KEY` tại thời điểm gọi — không
 * hard-code, không log giá trị key.
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

const DEFAULT_MODEL = "claude-sonnet-5";
const ENV_VAR = "ANTHROPIC_API_KEY";

export class AnthropicProviderAdapter implements ProviderAdapter {
  readonly providerId = "anthropic";
  readonly name = "Anthropic Provider";
  readonly tier = "core" as const;
  readonly providerType = "llm" as const;
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ALL_TEXT_CAPABILITIES;
  readonly modelRegistry = [{ modelId: DEFAULT_MODEL, contextWindow: 200_000, description: "Claude — mạnh về viết/reasoning dài." }];
  readonly costProfile = { inputPer1kTokens: 0.003, outputPer1kTokens: 0.015, currency: "USD" as const };
  readonly qualityProfile = { reportedQuality: 90 };
  readonly speedProfile = { reportedSpeed: 70 };
  readonly reliabilityProfile = { reportedReliability: 90 };
  readonly privacyProfile = { sendsDataExternally: true, dataResidencyNote: "Dữ liệu gửi tới hạ tầng vendor bên thứ ba theo chính sách dữ liệu công khai của vendor." };
  readonly configuration = { envVar: ENV_VAR };
  readonly securityProfile = {
    keyStorage: "server-only-env" as const,
    loggingPolicy: "never-log-key-or-raw-content" as const,
    dataRetentionNote: "Theo chính sách dữ liệu công khai của Anthropic — Owner tự rà soát trước khi gửi dữ liệu nhạy cảm.",
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
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens: 4096, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) throw new Error(`Anthropic API lỗi: ${res.status}`);
    const json = await res.json();
    return {
      raw: json.content?.[0]?.text ?? "",
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
