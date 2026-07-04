/**
 * PHASE 4 EPIC 01 — ProviderRegistry (server-side, thật).
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
import type { ProviderAdapter } from "./types";
import { MockProviderAdapter } from "./mock-provider-adapter";
import { AnthropicProviderAdapter } from "./anthropic-provider-adapter";
import { OpenAIProviderAdapter } from "./openai-provider-adapter";
import { GeminiProviderAdapter } from "./gemini-provider-adapter";

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
}

export const providerRegistry = new ProviderRegistry();

// Đăng ký 4 Adapter mặc định — Mock luôn có, 3 Adapter thật tự
// `isAvailable() === false` cho tới khi ENV var tương ứng được cấu hình.
providerRegistry.register(new MockProviderAdapter());
providerRegistry.register(new AnthropicProviderAdapter());
providerRegistry.register(new OpenAIProviderAdapter());
providerRegistry.register(new GeminiProviderAdapter());
