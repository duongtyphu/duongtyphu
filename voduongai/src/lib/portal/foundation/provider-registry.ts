/**
 * PHASE 4 EPIC 01 — AI Provider Registry (real implementation).
 *
 * Đây là bản triển khai thật đầu tiên của `AiProviderRegistryEntry` đã
 * thiết kế ở `docs/OPEN_AI_WORKFORCE_PLATFORM.md` §2 — chỉ khai báo
 * metadata (không chứa hàm `execute`, không chứa API key). Việc khởi
 * tạo Provider thật thuộc `provider-manager.ts`, không phải file này.
 *
 * Không đổi kiến trúc đã khóa: Registry chỉ MÔ TẢ Provider đã có
 * (`createWorkforceApiProvider`, MVP), không tạo Provider mới, không
 * gọi API nào ở đây.
 */

export type AiProviderKind = "text-generation" | "text-review" | "embedding" | "vision" | "audio";
export type AiProviderTransport = "http-fetch" | "sdk";
export type AiProviderStatusInRegistry = "registered" | "unavailable" | "deprecated";

export type AiProviderRegistryEntry = {
  providerId: string;
  displayName: string;
  kind: AiProviderKind;
  transport: AiProviderTransport;
  /** Tên biến ENV cần có để Provider hoạt động thật — KHÔNG lưu giá trị. */
  configRequirement: string[];
  status: AiProviderStatusInRegistry;
  registeredAt: string;
};

/**
 * Danh mục Provider đã đăng ký — tĩnh, giống cách `mission-catalog.ts`
 * khai báo 10 Golden Mission. Thêm Provider mới = thêm 1 entry ở đây +
 * 1 factory tương ứng trong `provider-manager.ts` — không sửa Workspace/
 * Companion code (đúng kiến trúc mở đã khóa ở EPIC 05).
 */
const AI_PROVIDER_CATALOG: AiProviderRegistryEntry[] = [
  {
    providerId: "workforce-api-v1",
    displayName: "Workforce API Provider",
    kind: "text-generation",
    transport: "http-fetch",
    configRequirement: ["ANTHROPIC_API_KEY", "OPENAI_API_KEY"],
    status: "registered",
    registeredAt: "2026-01-01T00:00:00.000Z",
  },
];

export function listProviders(): AiProviderRegistryEntry[] {
  return AI_PROVIDER_CATALOG;
}

export function getProviderEntry(providerId: string): AiProviderRegistryEntry | undefined {
  return AI_PROVIDER_CATALOG.find((p) => p.providerId === providerId);
}
