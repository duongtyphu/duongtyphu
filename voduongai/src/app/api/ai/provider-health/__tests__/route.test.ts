import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * FIX INF-02 — Provider Health Boundary.
 *
 * `vi.mock("server-only", () => ({}))` — cùng lý do đã ghi trong
 * `provider-layer.test.ts`: dưới Vitest (không có "react-server" export
 * condition của Next.js), import trực tiếp module `server-only` sẽ throw.
 * Route handler này transitively import `providerRegistry`/
 * `getProviderPriorityOrder()` (cả 2 đều `server-only`).
 */
vi.mock("server-only", () => ({}));

const ENV_KEYS = [
  "GEMINI_API_KEY",
  "GROQ_API_KEY",
  "OPENROUTER_API_KEY",
  "CEREBRAS_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "DEEPSEEK_API_KEY",
  "GROK_API_KEY",
  "PERPLEXITY_API_KEY",
  "MISTRAL_API_KEY",
  "COHERE_API_KEY",
  "OLLAMA_BASE_URL",
] as const;

let savedEnv: Record<string, string | undefined> = {};

beforeEach(() => {
  savedEnv = {};
  for (const k of ENV_KEYS) {
    savedEnv[k] = process.env[k];
    delete process.env[k];
  }
  vi.resetModules();
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
  vi.doUnmock("@/ai/providers/priority-store");
  vi.resetModules();
});

describe("FIX INF-02 — /api/ai/provider-health boundary", () => {
  it("response CHỈ có đúng field 'status' — không lộ providerId/model/priorityOrder/metadata hạ tầng nào", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const { GET } = await import("../route");
    const res = await GET();
    const json = await res.json();

    expect(Object.keys(json)).toEqual(["status"]);
    expect(["ready", "degraded", "unavailable"]).toContain(json.status);
    // Xác nhận thêm — toàn bộ response body serialize thành chuỗi không
    // chứa bất kỳ providerId/model nào (phòng trường hợp field ẩn dưới
    // tên khác trong tương lai lỡ thêm vào).
    const raw = JSON.stringify(json);
    for (const leak of ["gemini", "groq", "openrouter", "anthropic", "openai", "mock-model", "GEMINI_API_KEY"]) {
      expect(raw.toLowerCase()).not.toContain(leak.toLowerCase());
    }
  });

  it("unavailable khi KHÔNG có Provider thật nào khả dụng (mọi request thật sẽ rơi về Mock)", async () => {
    const { GET } = await import("../route");
    const res = await GET();
    const json = await res.json();
    expect(json.status).toBe("unavailable");
  });

  it("ready khi Provider ĐỨNG ĐẦU danh sách ưu tiên (DEFAULT_PRIORITY_ORDER[0] = gemini) khả dụng", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const { GET } = await import("../route");
    const res = await GET();
    const json = await res.json();
    expect(json.status).toBe("ready");
  });

  it("degraded khi Provider đứng đầu KHÔNG khả dụng nhưng vẫn còn Provider khác trong danh sách ưu tiên khả dụng (fallback hạn chế)", async () => {
    // Groq đứng vị trí #2 trong DEFAULT_PRIORITY_ORDER (Gemini đứng #1,
    // không cấu hình) — đúng tình huống "chỉ còn fallback".
    process.env.GROQ_API_KEY = "test-key";
    const { GET } = await import("../route");
    const res = await GET();
    const json = await res.json();
    expect(json.status).toBe("degraded");
  });

  it("Priority source PHẢI là getProviderPriorityOrder() — đổi thứ tự qua nguồn này phải phản ánh đúng, KHÔNG dùng CAPABILITY_FAMILY_PREFERENCE cũ", async () => {
    // Giả lập Founder đã đổi thứ tự ưu tiên qua Admin — đặt "openai" lên
    // đầu. Nếu route còn dùng bảng CAPABILITY_FAMILY_PREFERENCE cũ (từng
    // ưu tiên anthropic trước openai cho family "writing"/"growth"), test
    // dưới đây sẽ cho kết quả SAI (degraded thay vì ready) vì OPENAI_API_KEY
    // không phải Provider #1 theo bảng cũ.
    vi.doMock("@/ai/providers/priority-store", () => ({
      getProviderPriorityOrder: async () => ["openai", "anthropic", "gemini"],
    }));
    process.env.OPENAI_API_KEY = "test-key";
    const { GET } = await import("../route");
    const res = await GET();
    const json = await res.json();
    expect(json.status).toBe("ready");
  });

  it("Priority source (mock) đổi thứ tự → provider #1 down, #2 up → degraded (xác nhận route đọc ĐÚNG thứ tự trả về, không hard-code vị trí)", async () => {
    vi.doMock("@/ai/providers/priority-store", () => ({
      getProviderPriorityOrder: async () => ["openai", "anthropic", "gemini"],
    }));
    // "openai" (vị trí #1 trong mock) không có key — chỉ "anthropic" (#2) có.
    process.env.ANTHROPIC_API_KEY = "test-key";
    const { GET } = await import("../route");
    const res = await GET();
    const json = await res.json();
    expect(json.status).toBe("degraded");
  });
});
