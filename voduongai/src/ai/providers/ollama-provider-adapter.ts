/**
 * Provider Wave 1 — Tier: Recommended — OllamaProviderAdapter.
 *
 * Khác 9 Provider còn lại: Ollama chạy LOCAL trên máy/server của chính
 * Owner (không phải SaaS có hoá đơn theo token) — vì vậy `configuration`
 * dùng `OLLAMA_BASE_URL` (địa chỉ server local, vd
 * `http://localhost:11434`) thay vì API key, và `costProfile` = 0 (chi
 * phí là phần cứng Owner tự vận hành, không tính theo token qua Provider
 * Layer). Vẫn tuân thủ đúng contract `ProviderAdapter` như mọi Provider
 * khác — không có ngoại lệ kiến trúc.
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

const DEFAULT_MODEL = "llama3.1";
const ENV_VAR = "OLLAMA_BASE_URL";

export class OllamaProviderAdapter implements ProviderAdapter {
  readonly providerId = "ollama";
  readonly name = "Ollama Provider";
  readonly tier = "recommended" as const;
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ALL_TEXT_CAPABILITIES;
  readonly modelRegistry = [{ modelId: DEFAULT_MODEL, contextWindow: 8_000, description: "Ollama — chạy local, riêng tư tuyệt đối, không gửi dữ liệu ra ngoài." }];
  readonly costProfile = { inputPer1kTokens: 0, outputPer1kTokens: 0, currency: "USD" as const };
  readonly benchmarkProfile = { reportedQuality: 65, reportedSpeed: 60, reportedReliability: 70 };
  readonly configuration = { envVar: ENV_VAR };
  readonly securityPolicy = {
    keyStorage: "server-only-env" as const,
    loggingPolicy: "never-log-key-or-raw-content" as const,
    dataRetentionNote: "Chạy local — dữ liệu không rời khỏi hạ tầng Owner, không có bên thứ ba nào nhận request.",
  };

  isAvailable(): boolean {
    return Boolean(process.env[ENV_VAR]);
  }

  async execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult> {
    const startedAt = Date.now();
    const baseUrl = process.env[ENV_VAR];
    if (!baseUrl) throw new Error(`Chưa cấu hình ${ENV_VAR}.`);

    const model = request.model ?? DEFAULT_MODEL;
    const prompt = String(request.input.prompt ?? "");
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }),
    });
    if (!res.ok) throw new Error(`Ollama API lỗi: ${res.status}`);
    const json = await res.json();
    return {
      raw: json.response ?? "",
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
      reason: available ? undefined : `Thiếu ${ENV_VAR} (địa chỉ Ollama server local).`,
      checkedAt: new Date().toISOString(),
    };
  }

  estimateCost(): ProviderCostEstimate {
    return { unit: "per-1k-tokens", estimate: 0, currency: "USD" };
  }

  async benchmark(request: ProviderExecuteRequest): Promise<ProviderBenchmarkResult> {
    return runAdapterBenchmark(this, request);
  }
}
