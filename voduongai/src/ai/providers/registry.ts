/**
 * AI Service Registry (server-side, thật) — tổ chức theo Tier
 * (Core/Recommended/Specialized/Development) và theo `providerType`
 * (`llm`/`search`/`image`/`video`/`voice`/`automation`/`local_runtime`/
 * `embedding`/`rag`/`code`/`browser`/`data`/`other`).
 *
 * Provider Wave 1 (10 Provider, toàn bộ `providerType: "llm"`) là lứa
 * đầu tiên — Registry không hard-code chỉ cho LLM, `listByType()` sẵn
 * sàng cho Image/Video/Voice/Search/Automation/Local Runtime Sprint sau
 * (xem `docs/AI_SERVICE_REGISTRY.md` §Future Expansion), không tích hợp
 * ngay.
 *
 * Khác `src/lib/portal/foundation/provider-registry.ts` (client-safe,
 * chỉ chứa metadata tĩnh để UI/Companion tham chiếu) — registry này
 * nắm giữ INSTANCE thật của từng `AIServiceAdapter` (có hàm `execute`,
 * chạm API key), nên bắt buộc `server-only`, không bao giờ import vào
 * component client.
 *
 * Thêm 1 AI Service mới (bất kỳ `providerType` nào, Sprint sau) = thêm
 * 1 file Adapter implement `AIServiceAdapter` + 1 dòng
 * `register(new X())` ở đây — không sửa `AIServiceManager`/
 * `ModelRouter`/Companion nào khác.
 */
import "server-only";
import type { AIServiceAdapter, AIServiceType, ProviderTier } from "./types";
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

class AIServiceRegistry {
  private readonly adapters = new Map<string, AIServiceAdapter>();

  register(adapter: AIServiceAdapter): void {
    this.adapters.set(adapter.providerId, adapter);
  }

  get(providerId: string): AIServiceAdapter | undefined {
    return this.adapters.get(providerId);
  }

  list(): AIServiceAdapter[] {
    return Array.from(this.adapters.values());
  }

  listAvailable(): AIServiceAdapter[] {
    return this.list().filter((a) => a.isAvailable());
  }

  listSupporting(capability: string): AIServiceAdapter[] {
    return this.list().filter((a) => a.supportedCapabilities.includes(capability));
  }

  listByTier(tier: ProviderTier): AIServiceAdapter[] {
    return this.list().filter((a) => a.tier === tier);
  }

  /** "Không hard-code chỉ cho LLM" — lọc theo loại AI Service, sẵn sàng
      cho Image/Video/Voice/Search/Automation/Local Runtime Sprint sau. */
  listByType(providerType: AIServiceType): AIServiceAdapter[] {
    return this.list().filter((a) => a.providerType === providerType);
  }
}

export const providerRegistry = new AIServiceRegistry();
/** Tên chính thức từ Sprint "AI Service Registry" trở đi — cùng 1 instance. */
export const aiServiceRegistry = providerRegistry;

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
