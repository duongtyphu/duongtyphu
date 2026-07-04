/**
 * PHASE 4 EPIC 01 — OpenAIProviderAdapter.
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

const DEFAULT_MODEL = "gpt-4o-mini";

export class OpenAIProviderAdapter implements ProviderAdapter {
  readonly providerId = "openai";
  readonly name = "OpenAI Provider";
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ["writing.draft", "writing.review"];

  isAvailable(): boolean {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  async execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult> {
    const startedAt = Date.now();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Chưa cấu hình OPENAI_API_KEY.");

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
      reason: available ? undefined : "Thiếu OPENAI_API_KEY.",
      checkedAt: new Date().toISOString(),
    };
  }

  estimateCost(): ProviderCostEstimate {
    return { unit: "per-1k-tokens", estimate: 0.00015, currency: "USD" };
  }

  async benchmark(request: ProviderExecuteRequest): Promise<ProviderBenchmarkResult> {
    return runAdapterBenchmark(this, request);
  }
}
