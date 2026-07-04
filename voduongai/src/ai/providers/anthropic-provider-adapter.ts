/**
 * PHASE 4 EPIC 01 — AnthropicProviderAdapter.
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

const DEFAULT_MODEL = "claude-sonnet-5";

export class AnthropicProviderAdapter implements ProviderAdapter {
  readonly providerId = "anthropic";
  readonly name = "Anthropic Provider";
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ["writing.draft", "writing.review"];

  isAvailable(): boolean {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  }

  async execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult> {
    const startedAt = Date.now();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("Chưa cấu hình ANTHROPIC_API_KEY.");

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
      reason: available ? undefined : "Thiếu ANTHROPIC_API_KEY.",
      checkedAt: new Date().toISOString(),
    };
  }

  estimateCost(): ProviderCostEstimate {
    // Ước tính tham khảo — không phải giá niêm yết chính thức, chỉ dùng để
    // so sánh tương đối giữa các Provider trong Benchmark/Sandbox.
    return { unit: "per-1k-tokens", estimate: 0.003, currency: "USD" };
  }

  async benchmark(request: ProviderExecuteRequest): Promise<ProviderBenchmarkResult> {
    return runAdapterBenchmark(this, request);
  }
}
