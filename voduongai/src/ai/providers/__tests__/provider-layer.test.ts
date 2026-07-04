import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * PHASE 4 EPIC 01 — AI Provider Layer (server-side, thật).
 *
 * `server-only` throw có chủ đích khi bị import từ bundle client — dưới
 * Vitest (không có "react-server" export condition của Next.js), mọi
 * import trực tiếp các module này sẽ throw ngay từ `server-only/index.js`.
 * `vi.mock("server-only", () => ({}))` là cách chuẩn để test riêng phần
 * logic server-only mà không cần dựng toàn bộ Next.js server runtime —
 * không ảnh hưởng hành vi thật (Next.js vẫn tự chặn import sai ở build
 * thật qua "react-server" export condition, không đi qua nhánh test này).
 */
vi.mock("server-only", () => ({}));

const ENV_KEYS = ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY"] as const;

function clearProviderEnv() {
  for (const key of ENV_KEYS) delete process.env[key];
}

describe("PHASE 4 EPIC 01 — AI Provider Layer (server-side)", () => {
  beforeEach(async () => {
    clearProviderEnv();
    vi.restoreAllMocks();
    const { __resetExecutionLogForTest } = await import("../provider-execution-log");
    __resetExecutionLogForTest();
  });

  afterEach(() => {
    clearProviderEnv();
  });

  it("1. ProviderRegistry đăng ký đúng 4 Provider (Mock/Anthropic/OpenAI/Gemini)", async () => {
    const { providerRegistry } = await import("../registry");
    const ids = providerRegistry.list().map((a) => a.providerId).sort();
    expect(ids).toEqual(["anthropic", "gemini", "mock", "openai"]);
    expect(providerRegistry.get("mock")).toBeDefined();
    expect(providerRegistry.get("khong-ton-tai")).toBeUndefined();
  });

  it("2. ProviderManager fallback sang Mock khi không có API key nào được cấu hình", async () => {
    const { providerManager } = await import("../provider-manager");
    const result = await providerManager.execute({
      capability: "writing.draft",
      taskType: "writer",
      input: { prompt: "Viết một đoạn ngắn." },
    });
    expect(result.isMock).toBe(true);
    expect(result.providerId).toBe("mock");
  });

  it("3. ModelRouter chọn đúng Provider theo capability + thứ tự ưu tiên (writing → anthropic trước)", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key-not-real";
    const { selectAdapter } = await import("../model-router");
    const adapter = selectAdapter({ capability: "writing.draft" });
    expect(adapter.providerId).toBe("anthropic");
  });

  it("3b. ModelRouter chọn Gemini trước cho capability research (Gemini ưu tiên nhóm research)", async () => {
    process.env.GEMINI_API_KEY = "test-key-not-real";
    process.env.ANTHROPIC_API_KEY = "test-key-not-real";
    const { selectAdapter } = await import("../model-router");
    const adapter = selectAdapter({ capability: "research.market-analysis" });
    expect(adapter.providerId).toBe("gemini");
  });

  it("3c. ModelRouter tôn trọng preferredProvider khi Provider đó khả dụng", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key-not-real";
    process.env.OPENAI_API_KEY = "test-key-not-real";
    const { selectAdapter } = await import("../model-router");
    const adapter = selectAdapter({ capability: "writing.draft", preferredProvider: "openai" });
    expect(adapter.providerId).toBe("openai");
  });

  it("3d. ModelRouter ném lỗi khi fallbackAllowed=false và không có Provider thật nào khả dụng", async () => {
    const { selectAdapter } = await import("../model-router");
    expect(() => selectAdapter({ capability: "writing.draft", fallbackAllowed: false })).toThrow();
  });

  it("4. Anthropic/OpenAI/Gemini adapter không crash khi thiếu key — isAvailable()=false, execute() ném lỗi rõ ràng, healthCheck() báo lý do", async () => {
    const { AnthropicProviderAdapter } = await import("../anthropic-provider-adapter");
    const { OpenAIProviderAdapter } = await import("../openai-provider-adapter");
    const { GeminiProviderAdapter } = await import("../gemini-provider-adapter");

    for (const AdapterClass of [AnthropicProviderAdapter, OpenAIProviderAdapter, GeminiProviderAdapter]) {
      const adapter = new AdapterClass();
      expect(adapter.isAvailable()).toBe(false);
      await expect(adapter.execute({ taskType: "writer", input: { prompt: "x" } })).rejects.toThrow();
      const health = await adapter.healthCheck();
      expect(health.available).toBe(false);
      expect(health.reason).toBeTruthy();
    }
  });

  it("5. MockProvider trả output đúng cấu trúc ProviderExecuteResult", async () => {
    const { MockProviderAdapter } = await import("../mock-provider-adapter");
    const adapter = new MockProviderAdapter();
    expect(adapter.isAvailable()).toBe(true);
    const result = await adapter.execute({ taskType: "writer", input: { prompt: "x" } });
    expect(typeof result.raw).toBe("string");
    expect(result.providerId).toBe("mock");
    expect(result.isMock).toBe(true);
    expect(typeof result.latencyMs).toBe("number");
    expect(() => JSON.parse(result.raw)).not.toThrow();
  });

  it("6. ProviderExecutionLog ghi đúng sự kiện sau khi ProviderManager.execute chạy", async () => {
    const { providerManager } = await import("../provider-manager");
    const { listExecutions } = await import("../provider-execution-log");

    await providerManager.execute({ capability: "writing.review", taskType: "reviewer", input: { prompt: "x" } });
    const entries = listExecutions("mock");
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ providerId: "mock", capability: "writing.review", taskType: "reviewer", success: true, isMock: true });
  });

  it("ProviderHealthCheck kiểm tra được toàn bộ Provider đã đăng ký, không gọi mạng thật", async () => {
    const { checkAllProvidersHealth } = await import("../provider-health-check");
    const results = await checkAllProvidersHealth();
    expect(results).toHaveLength(4);
    expect(results.find((r) => r.providerId === "mock")?.available).toBe(true);
  });

  it("ProviderBenchmark chạy 1 request thật qua Mock và trả điểm hợp lệ", async () => {
    const { MockProviderAdapter } = await import("../mock-provider-adapter");
    const adapter = new MockProviderAdapter();
    const run = await adapter.benchmark({ taskType: "writer", input: { prompt: "x" } });
    expect(run.providerId).toBe("mock");
    expect(run.score).toBeGreaterThan(0);
    expect(run.isMock).toBe(true);
  });
});
