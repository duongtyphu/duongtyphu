/**
 * Sprint CS-03 — Provider Manifest Registry (Foundation).
 *
 * Tách metadata QUẢN TRỊ (hiển thị/business — mô tả, category, URL tài
 * liệu/trang chủ/giá, vai trò model, capability, giới hạn, kiểu xác thực)
 * ra khỏi `AIServiceAdapter` (chỉ còn chịu trách nhiệm INFERENCE — gọi
 * model thật). File này KHÔNG import bất kỳ Adapter/`registry.ts` nào —
 * độc lập hoàn toàn, đúng tinh thần "Provider Manifest chịu trách nhiệm
 * metadata" tách biệt khỏi Adapter.
 *
 * KHÔNG có secret nào ở đây (không phải "server-only" — thuần dữ liệu
 * tĩnh, giống `types.ts`).
 *
 * NGUYÊN TẮC TRUNG THỰC (bắt buộc, xuyên suốt dự án — xem CLAUDE.md
 * NO-FAKE-DATA): mọi field yêu cầu hiểu biết về vendor bên ngoài
 * (description văn phong marketing, category sản phẩm, URL tài liệu/
 * trang chủ/giá, vai trò Reasoning/Vision/Embedding Model, 6/7 cờ
 * Capabilities, maxOutput) đều để `null`/`"unknown"` — KHÔNG suy đoán
 * theo hiểu biết chung về vendor. Chỉ những field là SỰ THẬT KỸ THUẬT đã
 * biết CHẮC CHẮN trong chính dự án này (tên biến ENV, model đã đăng ký,
 * context window đã khai báo, tier đã gán từ trước) mới được điền —
 * KHÔNG đọc các giá trị này TỪ Adapter tại runtime (UI/Server Action
 * không import Adapter cho các field này), chỉ ghi lại 1 lần làm dữ liệu
 * tĩnh của chính file Manifest, y hệt các giá trị công khai đã hiển thị
 * từ Sprint CS-01/CS-02.
 */

export type ManifestTier = "core" | "recommended" | "specialized" | "development" | null;

export type ManifestCapabilityFlag = "yes" | "no" | "unknown";

export type ProviderModelRoles = {
  chatModel: string | null;
  reasoningModel: string | null;
  visionModel: string | null;
  embeddingModel: string | null;
};

export type ProviderCapabilitiesManifest = {
  chat: ManifestCapabilityFlag;
  vision: ManifestCapabilityFlag;
  embedding: ManifestCapabilityFlag;
  streaming: ManifestCapabilityFlag;
  functionCalling: ManifestCapabilityFlag;
  structuredOutput: ManifestCapabilityFlag;
  jsonMode: ManifestCapabilityFlag;
};

export type ProviderLimitsManifest = {
  contextWindow: number | null;
  maxOutput: number | null;
  recommendedUse: string | null;
};

export type ProviderAuthenticationType = "api-key" | "base-url" | "none" | null;

export type ProviderConnectionManifest = {
  authenticationType: ProviderAuthenticationType;
  environmentVariableName: string | null;
  supportsBaseUrl: boolean;
  supportsLocalRuntime: boolean;
};

export type ProviderManifestEntry = {
  providerId: string;
  displayName: string;
  description: string | null;
  category: string | null;
  tier: ManifestTier;
  /** Placeholder — chưa có hạ tầng upload logo thật trong dự án (xem
      Sprint ADM-V2-04). Chỉ là chữ cái viết tắt tính toán từ providerId,
      không phải nhận diện thương hiệu thật. */
  logoPlaceholder: string;
  documentationUrl: string | null;
  websiteUrl: string | null;
  pricingUrl: string | null;
  /** true nếu Provider này đã có Adapter thật đăng ký trong
      `providerRegistry` (10 Provider Wave 1) — false nếu Manifest khai
      báo trước nhưng CHƯA có Adapter/Runtime Binding (vd "groq", chuẩn
      bị cho Sprint sau). Health Check chỉ có kết quả thật khi field này
      = true. */
  registeredInRuntime: boolean;
  models: ProviderModelRoles;
  capabilities: ProviderCapabilitiesManifest;
  limits: ProviderLimitsManifest;
  connection: ProviderConnectionManifest;
};

const UNKNOWN_CAPABILITIES: ProviderCapabilitiesManifest = {
  chat: "unknown",
  vision: "unknown",
  embedding: "unknown",
  streaming: "unknown",
  functionCalling: "unknown",
  structuredOutput: "unknown",
  jsonMode: "unknown",
};

const PROVIDER_MANIFEST: ProviderManifestEntry[] = [
  {
    providerId: "openai",
    displayName: "OpenAI Provider",
    description: null,
    category: null,
    tier: "core",
    logoPlaceholder: "OP",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "gpt-4o-mini", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 128_000, maxOutput: null, recommendedUse: "OpenAI — mạnh về coding/tool-use." },
    connection: { authenticationType: "api-key", environmentVariableName: "OPENAI_API_KEY", supportsBaseUrl: false, supportsLocalRuntime: false },
  },
  {
    providerId: "anthropic",
    displayName: "Anthropic Provider",
    description: null,
    category: null,
    tier: "core",
    logoPlaceholder: "AN",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "claude-sonnet-5", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 200_000, maxOutput: null, recommendedUse: "Claude — mạnh về viết/reasoning dài." },
    connection: { authenticationType: "api-key", environmentVariableName: "ANTHROPIC_API_KEY", supportsBaseUrl: false, supportsLocalRuntime: false },
  },
  {
    providerId: "gemini",
    displayName: "Gemini Provider",
    description: null,
    category: null,
    tier: "core",
    logoPlaceholder: "GE",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "gemini-1.5-flash", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 1_000_000, maxOutput: null, recommendedUse: "Gemini — context window lớn, mạnh về research/tổng hợp." },
    connection: { authenticationType: "api-key", environmentVariableName: "GEMINI_API_KEY", supportsBaseUrl: false, supportsLocalRuntime: false },
  },
  {
    providerId: "deepseek",
    displayName: "DeepSeek Provider",
    description: null,
    category: null,
    tier: "core",
    logoPlaceholder: "DE",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "deepseek-chat", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 64_000, maxOutput: null, recommendedUse: "DeepSeek — mạnh về coding, chi phí thấp." },
    connection: { authenticationType: "api-key", environmentVariableName: "DEEPSEEK_API_KEY", supportsBaseUrl: false, supportsLocalRuntime: false },
  },
  {
    providerId: "grok",
    displayName: "Grok Provider",
    description: null,
    category: null,
    tier: "recommended",
    logoPlaceholder: "GR",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "grok-beta", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 128_000, maxOutput: null, recommendedUse: "Grok (xAI) — cập nhật tín hiệu thời sự nhanh." },
    connection: { authenticationType: "api-key", environmentVariableName: "GROK_API_KEY", supportsBaseUrl: false, supportsLocalRuntime: false },
  },
  {
    providerId: "mistral",
    displayName: "Mistral Provider",
    description: null,
    category: null,
    tier: "recommended",
    logoPlaceholder: "MI",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "mistral-large-latest", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 128_000, maxOutput: null, recommendedUse: "Mistral — model châu Âu, tối ưu chi phí." },
    connection: { authenticationType: "api-key", environmentVariableName: "MISTRAL_API_KEY", supportsBaseUrl: false, supportsLocalRuntime: false },
  },
  {
    providerId: "ollama",
    displayName: "Ollama Provider",
    description: null,
    category: "Local Runtime",
    tier: "recommended",
    logoPlaceholder: "OL",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "llama3.1", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 8_000, maxOutput: null, recommendedUse: "Ollama — chạy local, riêng tư tuyệt đối, không gửi dữ liệu ra ngoài." },
    connection: { authenticationType: "base-url", environmentVariableName: "OLLAMA_BASE_URL", supportsBaseUrl: true, supportsLocalRuntime: true },
  },
  {
    providerId: "perplexity",
    displayName: "Perplexity Provider",
    description: null,
    category: null,
    tier: "specialized",
    logoPlaceholder: "PE",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "sonar", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 128_000, maxOutput: null, recommendedUse: "Perplexity — có truy cập web-search thật ở phía vendor, mạnh về Research." },
    connection: { authenticationType: "api-key", environmentVariableName: "PERPLEXITY_API_KEY", supportsBaseUrl: false, supportsLocalRuntime: false },
  },
  {
    providerId: "cohere",
    displayName: "Cohere Provider",
    description: null,
    category: null,
    tier: "specialized",
    logoPlaceholder: "CO",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "command-r", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 128_000, maxOutput: null, recommendedUse: "Cohere — mạnh về tác vụ doanh nghiệp/phân loại văn bản." },
    connection: { authenticationType: "api-key", environmentVariableName: "COHERE_API_KEY", supportsBaseUrl: false, supportsLocalRuntime: false },
  },
  {
    providerId: "mock",
    displayName: "Mock Provider",
    description: null,
    category: null,
    tier: "development",
    logoPlaceholder: "MO",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: true,
    models: { chatModel: "mock-model", reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: 0, maxOutput: null, recommendedUse: "Không gọi mạng — trả JSON placeholder có cấu trúc." },
    connection: { authenticationType: "none", environmentVariableName: null, supportsBaseUrl: false, supportsLocalRuntime: false },
  },
  {
    // Đề bài CS-03 liệt kê "Groq" (khác "Grok" đã có ở trên, xem tách bạch
    // trong báo cáo) như 1 Provider mẫu — CHƯA có Adapter/Registry thật
    // (grep xác nhận `src/ai/providers/` không có file nào cho Groq).
    // Khai báo trước trong Manifest (đúng mục tiêu "chuẩn bị cho Runtime
    // Binding") nhưng KHÔNG bịa bất kỳ field kỹ thuật nào chưa xác nhận
    // được (env var/context window/model...) — để trống trung thực.
    providerId: "groq",
    displayName: "Groq (chưa có Adapter/Registry)",
    description: null,
    category: null,
    tier: null,
    logoPlaceholder: "GQ",
    documentationUrl: null,
    websiteUrl: null,
    pricingUrl: null,
    registeredInRuntime: false,
    models: { chatModel: null, reasoningModel: null, visionModel: null, embeddingModel: null },
    capabilities: UNKNOWN_CAPABILITIES,
    limits: { contextWindow: null, maxOutput: null, recommendedUse: null },
    connection: { authenticationType: null, environmentVariableName: null, supportsBaseUrl: false, supportsLocalRuntime: false },
  },
];

export function listProviderManifest(): ProviderManifestEntry[] {
  return PROVIDER_MANIFEST;
}

export function getProviderManifestEntry(providerId: string): ProviderManifestEntry | undefined {
  return PROVIDER_MANIFEST.find((p) => p.providerId === providerId);
}
