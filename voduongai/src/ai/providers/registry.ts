/**
 * Provider Wave 1 — ProviderRegistry (server-side, thật), tổ chức theo
 * Tier (Core/Recommended/Specialized/Development).
 *
 * Khác `src/lib/portal/foundation/provider-registry.ts` (client-safe,
 * chỉ chứa metadata tĩnh để UI/Companion tham chiếu) — registry này
 * nắm giữ INSTANCE thật của từng `ProviderAdapter` (có hàm `execute`,
 * chạm API key), nên bắt buộc `server-only`, không bao giờ import vào
 * component client.
 *
 * Thêm 1 Provider mới (Sprint sau) = thêm 1 dòng `register(new X())` ở
 * đây — không sửa `ProviderManager`/`ModelRouter`/Companion nào khác.
 */
import "server-only";
import type { ProviderAdapter, ProviderTier } from "./types";
import { MockProviderAdapter } from "./mock-provider-adapter";
import { AnthropicProviderAdapter } from "./anthropic-provider-adapter";
import { OpenAIProviderAdapter } from "./openai-provider-adapter";
import { GeminiProviderAdapter } from "./gemini-provider-adapter";
import { DeepSeekProviderAdapter } from "./deepseek-provider-adapter";
import { GrokProviderAdapter } from "./grok-provider-adapter";
import { MistralProviderAdapter } from "./mistral-provider-adapter";
import { OllamaProviderAdapter } from "./ollama-provider-adapter";
import { PerplexityProviderAdapter } from "./perplexity-provider-adapter";
import { CohereProviderAdapter } from "./cohere-provider-adapter";

class ProviderRegistry {
  private readonly adapters = new Map<string, ProviderAdapter>();

  register(adapter: ProviderAdapter): void {
    this.adapters.set(adapter.providerId, adapter);
  }

  get(providerId: string): ProviderAdapter | undefined {
    return this.adapters.get(providerId);
  }

  list(): ProviderAdapter[] {
    return Array.from(this.adapters.values());
  }

  listAvailable(): ProviderAdapter[] {
    return this.list().filter((a) => a.isAvailable());
  }

  listSupporting(capability: string): ProviderAdapter[] {
    return this.list().filter((a) => a.supportedCapabilities.includes(capability));
  }

  listByTier(tier: ProviderTier): ProviderAdapter[] {
    return this.list().filter((a) => a.tier === tier);
  }
}

export const providerRegistry = new ProviderRegistry();

// Provider Wave 1 — 10 Provider chính thức, đăng ký theo đúng 4 Tier.
// Core:
providerRegistry.register(new OpenAIProviderAdapter());
providerRegistry.register(new AnthropicProviderAdapter());
providerRegistry.register(new GeminiProviderAdapter());
providerRegistry.register(new DeepSeekProviderAdapter());
// Recommended:
providerRegistry.register(new GrokProviderAdapter());
providerRegistry.register(new MistralProviderAdapter());
providerRegistry.register(new OllamaProviderAdapter());
// Specialized:
providerRegistry.register(new PerplexityProviderAdapter());
providerRegistry.register(new CohereProviderAdapter());
// Development:
providerRegistry.register(new MockProviderAdapter());
