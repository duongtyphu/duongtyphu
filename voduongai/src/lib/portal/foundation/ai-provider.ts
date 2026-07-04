/**
 * AI Agent Integration MVP — AI Provider Adapter.
 *
 * Lớp trung gian client-side — Workspace/UI KHÔNG gọi thẳng model hay
 * hard-code logic gọi AI vào component. Mọi lời gọi đi qua
 * `execute()` của Provider này, Provider gọi API Route
 * (`/api/ai/workforce`) — API key không bao giờ tới client (đọc ở server
 * qua biến môi trường, xem `src/ai/agents/companion.agent.ts`).
 *
 * Khớp đúng cấu trúc `AIProvider` đã chuẩn bị ở
 * `extension-points.ts` (Sprint B1 Progressive Refactor) — đây là lần
 * đầu tiên extension point đó có 1 implementation thật, không đổi
 * interface gốc.
 */

export type AiProviderStatus = "idle" | "running" | "completed" | "failed";

export type AiProvider = {
  readonly name: string;
  readonly model: string;
  readonly provider: string;
  status: AiProviderStatus;
  error?: string;
  execute<TResult>(agentRole: "writer" | "reviewer", input: Record<string, unknown>): Promise<TResult>;
};

/** Provider MVP duy nhất — gọi qua API Route `/api/ai/workforce`. Model/
    provider hiển thị là nhãn chung ("Companion Model") vì lựa chọn
    Anthropic/OpenAI cụ thể là chi tiết server-side (AI-Agnostic — không
    lộ tên hãng AI cụ thể ra tầng Provider client). */
export function createWorkforceApiProvider(): AiProvider {
  return {
    name: "Workforce API Provider",
    model: "companion-model",
    provider: "internal-api",
    status: "idle",
    error: undefined,

    async execute<TResult>(agentRole: "writer" | "reviewer", input: Record<string, unknown>): Promise<TResult> {
      this.status = "running";
      this.error = undefined;
      try {
        const res = await fetch("/api/ai/workforce", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ agentRole, ...input }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          this.status = "failed";
          this.error = json.error ?? `HTTP ${res.status}`;
          throw new Error(this.error);
        }
        this.status = "completed";
        return json.result as TResult;
      } catch (err) {
        this.status = "failed";
        this.error = err instanceof Error ? err.message : "Lỗi không xác định.";
        throw err;
      }
    },
  };
}
