/**
 * PHASE 4 EPIC 01 — GeminiProviderAdapter.
 *
 * Nơi DUY NHẤT được phép gọi thẳng `generativelanguage.googleapis.com`.
 * Đọc key từ `process.env.GEMINI_API_KEY` tại thời điểm gọi — không
 * hard-code. Đây là Provider thứ 3 (bên cạnh Anthropic/OpenAI đã có từ
 * MVP) — chứng minh kiến trúc mở: thêm 1 file Adapter + đăng ký vào
 * Registry, không sửa Companion/Workspace/Blueprint nào.
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

const DEFAULT_MODEL = "gemini-1.5-flash";

export class GeminiProviderAdapter implements ProviderAdapter {
  readonly providerId = "gemini";
  readonly name = "Gemini Provider";
  readonly supportedModels = [DEFAULT_MODEL];
  readonly supportedCapabilities = ["writing.draft", "writing.review", "coding.general", "research.market-analysis"];

  isAvailable(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  async execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult> {
    const startedAt = Date.now();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Chưa cấu hình GEMINI_API_KEY.");

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
      reason: available ? undefined : "Thiếu GEMINI_API_KEY.",
      checkedAt: new Date().toISOString(),
    };
  }

  estimateCost(): ProviderCostEstimate {
    return { unit: "per-1k-tokens", estimate: 0.000075, currency: "USD" };
  }

  async benchmark(request: ProviderExecuteRequest): Promise<ProviderBenchmarkResult> {
    return runAdapterBenchmark(this, request);
  }
}
