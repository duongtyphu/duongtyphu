import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * INF-01 — Additional AI Provider Integration: Groq/Cerebras/OpenRouter.
 *
 * Cùng kỹ thuật `vi.mock("server-only", ...)` đã dùng ở
 * `provider-layer.test.ts` — test riêng phần logic server-only mà không
 * cần dựng toàn bộ Next.js server runtime.
 */
vi.mock("server-only", () => ({}));

/** Toàn bộ ENV var Provider (Wave 1 + INF-01) — dọn sạch giữa MỌI test
    trong file này, tránh 1 test set key (vd ANTHROPIC_API_KEY) rò rỉ sang
    test sau (cùng lý do `clearProviderEnv()` ở `provider-layer.test.ts`). */
const ALL_PROVIDER_ENV_KEYS = [
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "GEMINI_API_KEY",
  "DEEPSEEK_API_KEY",
  "GROK_API_KEY",
  "MISTRAL_API_KEY",
  "OLLAMA_BASE_URL",
  "PERPLEXITY_API_KEY",
  "COHERE_API_KEY",
  "GROQ_API_KEY",
  "CEREBRAS_API_KEY",
  "OPENROUTER_API_KEY",
] as const;

function clearNewProviderEnv() {
  for (const key of ALL_PROVIDER_ENV_KEYS) delete process.env[key];
}

describe("INF-01 — Groq/Cerebras/OpenRouter adapters", () => {
  beforeEach(async () => {
    clearNewProviderEnv();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    clearNewProviderEnv();
    vi.unstubAllGlobals();
  });

  const ADAPTERS = [
    {
      label: "Groq",
      envVar: "GROQ_API_KEY",
      importPath: "../groq-provider-adapter",
      className: "GroqProviderAdapter",
      providerId: "groq",
      baseUrl: "https://api.groq.com/openai/v1/chat/completions",
      defaultModel: "llama-3.3-70b-versatile",
    },
    {
      label: "Cerebras",
      envVar: "CEREBRAS_API_KEY",
      importPath: "../cerebras-provider-adapter",
      className: "CerebrasProviderAdapter",
      providerId: "cerebras",
      baseUrl: "https://api.cerebras.ai/v1/chat/completions",
      defaultModel: "gpt-oss-120b", // FIX INF-01
    },
    {
      label: "OpenRouter",
      envVar: "OPENROUTER_API_KEY",
      importPath: "../openrouter-provider-adapter",
      className: "OpenRouterProviderAdapter",
      providerId: "openrouter",
      baseUrl: "https://openrouter.ai/api/v1/chat/completions",
      defaultModel: "openai/gpt-4o-mini",
    },
  ] as const;

  for (const spec of ADAPTERS) {
    describe(spec.label, () => {
      it("Missing credential: isAvailable()=false, execute() ném lỗi rõ ràng (không gọi mạng), healthCheck() báo đúng lý do", async () => {
        const mod = await import(spec.importPath);
        const AdapterClass = mod[spec.className];
        const adapter = new AdapterClass();
        const fetchSpy = vi.fn();
        vi.stubGlobal("fetch", fetchSpy);

        expect(adapter.isAvailable()).toBe(false);
        await expect(adapter.execute({ taskType: "writer", input: { prompt: "x" } })).rejects.toThrow(spec.envVar);
        expect(fetchSpy).not.toHaveBeenCalled(); // thiếu key phải chặn TRƯỚC khi gọi mạng

        const health = await adapter.healthCheck();
        expect(health.providerId).toBe(spec.providerId);
        expect(health.available).toBe(false);
        expect(health.reason).toContain(spec.envVar);
      });

      it("Adapter request mapping: đúng base URL/method/header Authorization Bearer/body {model, messages}", async () => {
        process.env[spec.envVar] = "test-key-not-real";
        const mod = await import(spec.importPath);
        const AdapterClass = mod[spec.className];
        const adapter = new AdapterClass();

        const fetchSpy = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: "phản hồi thật" } }] }),
        });
        vi.stubGlobal("fetch", fetchSpy);

        await adapter.execute({ taskType: "writer", input: { prompt: "Xin chào" } });

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        const [url, init] = fetchSpy.mock.calls[0];
        expect(url).toBe(spec.baseUrl);
        expect(init.method).toBe("POST");
        expect(init.headers.authorization).toBe("Bearer test-key-not-real");
        expect(init.headers["content-type"]).toBe("application/json");
        const body = JSON.parse(init.body);
        expect(body.model).toBe(spec.defaultModel);
        expect(body.messages).toEqual([{ role: "user", content: "Xin chào" }]);
      });

      it("Adapter request mapping: request.model tuỳ chỉnh ghi đè đúng model mặc định", async () => {
        process.env[spec.envVar] = "test-key-not-real";
        const mod = await import(spec.importPath);
        const AdapterClass = mod[spec.className];
        const adapter = new AdapterClass();

        const fetchSpy = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: "ok" } }] }),
        });
        vi.stubGlobal("fetch", fetchSpy);

        const result = await adapter.execute({ taskType: "writer", input: { prompt: "x" }, model: "custom-model-id" });
        const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
        expect(body.model).toBe("custom-model-id");
        expect(result.model).toBe("custom-model-id");
      });

      it("Successful response parsing: trả đúng ProviderExecuteResult (raw/model/providerId/isMock=false/latencyMs)", async () => {
        process.env[spec.envVar] = "test-key-not-real";
        const mod = await import(spec.importPath);
        const AdapterClass = mod[spec.className];
        const adapter = new AdapterClass();

        vi.stubGlobal(
          "fetch",
          vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ choices: [{ message: { content: "Đây là câu trả lời thật." } }] }),
          })
        );

        const result = await adapter.execute({ taskType: "writer", input: { prompt: "x" } });
        expect(result.raw).toBe("Đây là câu trả lời thật.");
        expect(result.model).toBe(spec.defaultModel);
        expect(result.providerId).toBe(spec.providerId);
        expect(result.isMock).toBe(false);
        expect(typeof result.latencyMs).toBe("number");
      });

      it("Successful response parsing: choices rỗng/thiếu → raw = chuỗi rỗng, không throw", async () => {
        process.env[spec.envVar] = "test-key-not-real";
        const mod = await import(spec.importPath);
        const AdapterClass = mod[spec.className];
        const adapter = new AdapterClass();

        vi.stubGlobal(
          "fetch",
          vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ choices: [] }) })
        );

        const result = await adapter.execute({ taskType: "writer", input: { prompt: "x" } });
        expect(result.raw).toBe("");
      });

      it("Provider error normalization: HTTP lỗi (vd 401/429/500) ném Error rõ ràng kèm status, không throw lỗi thô của fetch", async () => {
        process.env[spec.envVar] = "test-key-not-real";
        const mod = await import(spec.importPath);
        const AdapterClass = mod[spec.className];
        const adapter = new AdapterClass();

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({}) }));
        await expect(adapter.execute({ taskType: "writer", input: { prompt: "x" } })).rejects.toThrow("401");

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429, json: async () => ({}) }));
        await expect(adapter.execute({ taskType: "writer", input: { prompt: "x" } })).rejects.toThrow("429");
      });

      it("Provider error normalization: fetch network throw (mất mạng) — lỗi truyền nguyên vẹn lên caller, không nuốt lỗi", async () => {
        process.env[spec.envVar] = "test-key-not-real";
        const mod = await import(spec.importPath);
        const AdapterClass = mod[spec.className];
        const adapter = new AdapterClass();

        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
        await expect(adapter.execute({ taskType: "writer", input: { prompt: "x" } })).rejects.toThrow("network down");
      });

      it("Metadata: displayName/defaultModel/modelRegistry/capabilities/environmentVariable/baseUrl khai báo đầy đủ, không hard-code secret", async () => {
        const mod = await import(spec.importPath);
        const AdapterClass = mod[spec.className];
        const adapter = new AdapterClass();

        expect(adapter.name).toBeTruthy(); // displayName
        expect(adapter.supportedModels[0]).toBe(spec.defaultModel);
        expect(adapter.modelRegistry.length).toBeGreaterThan(0);
        expect(adapter.modelRegistry[0].modelId).toBe(spec.defaultModel);
        expect(adapter.supportedCapabilities.length).toBeGreaterThan(0);
        expect(adapter.configuration.envVar).toBe(spec.envVar);
        expect(adapter.securityProfile.keyStorage).toBe("server-only-env");
        expect(adapter.securityProfile.loggingPolicy).toBe("never-log-key-or-raw-content");
        // Không có literal API key nào trong toàn bộ giá trị field — chỉ tên biến ENV.
        expect(JSON.stringify(adapter)).not.toMatch(/sk-|gsk_|csk-/);
      });
    });
  }

  it("Registry registration: cả 3 Provider đã đăng ký trong providerRegistry, đúng tier 'specialized', providerType 'llm'", async () => {
    const { providerRegistry } = await import("../registry");
    for (const providerId of ["groq", "cerebras", "openrouter"]) {
      const adapter = providerRegistry.get(providerId);
      expect(adapter).toBeDefined();
      expect(adapter!.tier).toBe("specialized");
      expect(adapter!.providerType).toBe("llm");
    }
    expect(providerRegistry.listByTier("specialized").map((a) => a.providerId).sort()).toEqual([
      "cerebras",
      "cohere",
      "groq",
      "openrouter",
      "perplexity",
    ]);
  });

  it("Manifest registration: cả 3 Provider có entry Manifest với registeredInRuntime=true và đúng env var", async () => {
    const { getProviderManifestEntry } = await import("../manifest");
    const groq = getProviderManifestEntry("groq");
    const cerebras = getProviderManifestEntry("cerebras");
    const openrouter = getProviderManifestEntry("openrouter");
    expect(groq?.registeredInRuntime).toBe(true);
    expect(groq?.connection.environmentVariableName).toBe("GROQ_API_KEY");
    expect(cerebras?.registeredInRuntime).toBe(true);
    expect(cerebras?.connection.environmentVariableName).toBe("CEREBRAS_API_KEY");
    expect(openrouter?.registeredInRuntime).toBe(true);
    expect(openrouter?.connection.environmentVariableName).toBe("OPENROUTER_API_KEY");
  });

  it("FIX INF-01 — Cerebras: model đổi thành gpt-oss-120b, contextWindow KHÔNG bịa số (adapter dùng 0, Manifest dùng null — cả 2 đều là quy ước 'chưa xác nhận')", async () => {
    const { CerebrasProviderAdapter } = await import("../cerebras-provider-adapter");
    const adapter = new CerebrasProviderAdapter();
    expect(adapter.supportedModels[0]).toBe("gpt-oss-120b");
    expect(adapter.modelRegistry[0].modelId).toBe("gpt-oss-120b");
    expect(adapter.modelRegistry[0].contextWindow).toBe(0);

    const { getProviderManifestEntry } = await import("../manifest");
    const cerebras = getProviderManifestEntry("cerebras");
    expect(cerebras?.models.chatModel).toBe("gpt-oss-120b");
    expect(cerebras?.limits.contextWindow).toBeNull();
  });

  it("FIX INF-01 — Groq: giữ nguyên llama-3.3-70b-versatile, contextWindow=131072 (adapter + Manifest), Manifest maxOutput=32768", async () => {
    const { GroqProviderAdapter } = await import("../groq-provider-adapter");
    const adapter = new GroqProviderAdapter();
    expect(adapter.supportedModels[0]).toBe("llama-3.3-70b-versatile");
    expect(adapter.modelRegistry[0].contextWindow).toBe(131_072);

    const { getProviderManifestEntry } = await import("../manifest");
    const groq = getProviderManifestEntry("groq");
    expect(groq?.models.chatModel).toBe("llama-3.3-70b-versatile");
    expect(groq?.limits.contextWindow).toBe(131_072);
    expect(groq?.limits.maxOutput).toBe(32_768);
  });

  it("FIX INF-01 — OpenRouter: mặc định vẫn openai/gpt-4o-mini, 'openrouter/free' chỉ là LỰA CHỌN thêm trong modelRegistry/supportedModels, không phải mặc định", async () => {
    const { OpenRouterProviderAdapter } = await import("../openrouter-provider-adapter");
    const adapter = new OpenRouterProviderAdapter();
    expect(adapter.supportedModels[0]).toBe("openai/gpt-4o-mini"); // vẫn là mặc định
    expect(adapter.supportedModels).toContain("openrouter/free"); // có mặt như 1 lựa chọn
    expect(adapter.modelRegistry.map((m) => m.modelId)).toEqual(["openai/gpt-4o-mini", "openrouter/free"]);

    // execute() không truyền model → vẫn dùng đúng DEFAULT_MODEL cũ, không tự chuyển sang free tier.
    process.env.OPENROUTER_API_KEY = "test-key-not-real";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: "ok" } }] }) })
    );
    const result = await adapter.execute({ taskType: "writer", input: { prompt: "x" } });
    expect(result.model).toBe("openai/gpt-4o-mini");
  });

  it("Health check: checkAllProvidersHealth() trả đúng trạng thái available/unavailable cho cả 3 Provider mới, không gọi mạng", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    process.env.GROQ_API_KEY = "test-key-not-real";
    const { checkAllProvidersHealth } = await import("../provider-health-check");
    const results = await checkAllProvidersHealth();

    const groqHealth = results.find((r) => r.providerId === "groq");
    const cerebrasHealth = results.find((r) => r.providerId === "cerebras");
    const openrouterHealth = results.find((r) => r.providerId === "openrouter");
    expect(groqHealth?.available).toBe(true);
    expect(cerebrasHealth?.available).toBe(false);
    expect(openrouterHealth?.available).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled(); // healthCheck() không gọi mạng thật
  });

  it("Không tự đặt Provider mới làm mặc định: khi Anthropic VÀ Groq đều khả dụng, ModelRouter vẫn ưu tiên Anthropic (bảng ưu tiên mặc định của nhóm 'writing' không có Groq/Cerebras/OpenRouter) — Groq CHỈ được chọn khi caller chỉ định preferredProvider tường minh", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key-not-real";
    process.env.GROQ_API_KEY = "test-key-not-real";
    const { selectAdapter } = await import("../model-router");

    const byDefault = selectAdapter({ capability: "writing.draft" });
    expect(byDefault.providerId).toBe("anthropic"); // KHÔNG phải "groq" — bảng ưu tiên mặc định không đổi

    const explicit = selectAdapter({ capability: "writing.draft", preferredProvider: "groq" });
    expect(explicit.providerId).toBe("groq"); // chỉ chọn được khi chỉ định tường minh
  });

  it("Không tự đặt Provider mới làm mặc định: khi CHỈ Groq/Cerebras/OpenRouter khả dụng (không có Provider Wave 1 nào), ModelRouter vẫn chọn được qua bước xếp hạng chung (fallback tự động khi không còn Provider thật nào khác) — không phải vì được ưu tiên mặc định", async () => {
    process.env.GROQ_API_KEY = "test-key-not-real";
    const { selectAdapter } = await import("../model-router");
    const adapter = selectAdapter({ capability: "writing.draft" });
    expect(adapter.providerId).toBe("groq"); // candidate thật DUY NHẤT khả dụng — đúng hành vi fallback, không phải ưu tiên cố định
  });

  it("Fallback safety: đăng ký 3 Provider mới KHÔNG làm hỏng fallback Mock hiện có khi mọi Provider (kể cả 3 Provider mới) đều thiếu key", async () => {
    const { providerManager } = await import("../provider-manager");
    const result = await providerManager.execute({
      capability: "writing.draft",
      taskType: "writer",
      input: { prompt: "Viết một đoạn ngắn." },
    });
    expect(result.isMock).toBe(true);
    expect(result.providerId).toBe("mock");
  });

  it("Fallback safety: 1 trong 3 Provider mới lỗi runtime (fetch throw) không làm crash toàn bộ ProviderManager — lỗi được ném rõ ràng, ghi log thất bại", async () => {
    process.env.GROQ_API_KEY = "test-key-not-real";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Groq tạm thời quá tải")));

    const { providerManager } = await import("../provider-manager");
    const { listExecutions, __resetExecutionLogForTest } = await import("../provider-execution-log");
    __resetExecutionLogForTest();

    await expect(
      providerManager.execute({ capability: "writing.draft", taskType: "writer", input: { prompt: "x" }, preferredProvider: "groq" })
    ).rejects.toThrow("Groq tạm thời quá tải");

    const entries = listExecutions("groq");
    expect(entries).toHaveLength(1);
    expect(entries[0].success).toBe(false);
  });
});
