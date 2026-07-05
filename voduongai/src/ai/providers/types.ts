/**
 * AI Service Registry — hợp đồng dữ liệu dùng chung.
 *
 * "server-only" theo tinh thần chung của toàn bộ layer này (không import
 * vào component client — chỉ dùng trong route handler/agent server-side).
 * Không có API key nào được hard-code ở đây — mọi Adapter tự đọc key
 * riêng từ `process.env` tại thời điểm `execute()`/`isAvailable()`.
 *
 * Đổi tư duy: đây KHÔNG chỉ là Registry cho LLM — `AIServiceType` mở ra
 * cho mọi loại AI Service tương lai (image/video/voice/search/automation/
 * local_runtime/embedding/rag/code/browser/data/...), Provider Wave 1
 * (10 Provider) chỉ là lứa đầu tiên, toàn bộ đều `providerType: "llm"`.
 */
import "server-only";

/** Capability id — dùng chung với `docs/OPEN_AI_WORKFORCE_PLATFORM.md` §3
    (AI Capability Registry), vd "writing.draft", "writing.review". Không
    giới hạn cứng thành union — Capability Registry là nơi mở rộng danh
    sách, Provider Layer chỉ cần biết chuỗi id để định tuyến. */
export type ProviderCapability = string;

/** 4 Tier chính thức của Provider Wave 1 — quyết định thứ tự ưu tiên mặc
    định khi không có tín hiệu nào khác (điểm/preference/fallback). */
export type ProviderTier = "core" | "recommended" | "specialized" | "development";

/**
 * Loại AI Service — KHÔNG giới hạn chỉ cho LLM. Provider Wave 1 (10
 * Provider hiện có) đều là `"llm"`; các loại còn lại chuẩn bị sẵn chỗ
 * đứng trong Registry cho Sprint sau (Image/Video/Voice/Search/
 * Automation/Local Runtime — xem `docs/AI_SERVICE_REGISTRY.md` §Future
 * Expansion), không tích hợp ngay.
 */
export type AIServiceType =
  | "llm"
  | "search"
  | "image"
  | "video"
  | "voice"
  | "automation"
  | "local_runtime"
  | "embedding"
  | "rag"
  | "code"
  | "browser"
  | "data"
  | "other";

export type ModelRegistryEntry = {
  modelId: string;
  contextWindow: number; // tokens — số công khai của vendor, ước tính tham khảo
  description: string;
};

export type ProviderCostProfile = {
  inputPer1kTokens: number; // USD — ước tính tham khảo, KHÔNG phải giá niêm yết chính thức
  outputPer1kTokens: number;
  currency: "USD";
};

/** Baseline TỰ KHAI BÁO (self-declared), KHÔNG phải điểm đo thật — điểm
    đo thật (dựa trên `ProviderExecutionLog` thật) là `ProviderScore`
    (`provider-score.ts`), dùng 3 profile này làm "prior" trước khi có đủ
    dữ liệu thật. Không được nhầm 2 khái niệm này với nhau. Tách thành 3
    field riêng (thay vì 1 `benchmarkProfile` gộp) để khớp đúng cấu trúc
    AI Service Registry — mỗi trục là 1 "hồ sơ" độc lập, dễ mở rộng thêm
    field cho từng trục sau này (vd `qualityProfile` có thể thêm
    `benchmarkSuite` cụ thể mà không ảnh hưởng `speedProfile`). */
export type ProviderQualityProfile = { reportedQuality: number }; // 0-100
export type ProviderSpeedProfile = { reportedSpeed: number }; // 0-100
export type ProviderReliabilityProfile = { reportedReliability: number }; // 0-100

/** Có gửi dữ liệu ra ngoài hạ tầng Owner hay không — quan trọng cho
    Routing "Local / Privacy" (vd Ollama luôn `sendsDataExternally: false`). */
export type ProviderPrivacyProfile = {
  sendsDataExternally: boolean;
  dataResidencyNote: string;
};

export type ProviderConfiguration = {
  /** Tên biến ENV cần có để Provider hoạt động thật — KHÔNG lưu giá trị. */
  envVar: string;
  /** Ollama (local runtime) cần thêm Base URL, không phải API key — các
      Provider khác để trống. */
  optionalEnvVar?: string;
};

export type ProviderSecurityProfile = {
  /** Cố định cho MỌI Provider — không có ngoại lệ. */
  keyStorage: "server-only-env";
  loggingPolicy: "never-log-key-or-raw-content";
  dataRetentionNote: string;
};

export type ProviderExecuteRequest = {
  /** Loại Task cụ thể — giữ tương thích với `agentRole` đã khóa ở
      `/api/ai/workforce` ("writer" | "reviewer"), nhưng để dạng chuỗi mở
      để Provider Layer không phải sửa mỗi khi có Companion mới. */
  taskType: string;
  /** Input chuẩn hoá — quy ước: `input.prompt` là văn bản prompt đầy đủ
      Agent gọi đã tự dựng (Provider Layer không tự soạn Prompt). */
  input: Record<string, unknown>;
  context?: string;
  /** Cho phép Agent yêu cầu 1 model cụ thể của Provider — tuỳ chọn. */
  model?: string;
};

export type ProviderExecuteResult = {
  /** Văn bản thô model trả về — Agent tự `extractJson` nếu cần. */
  raw: string;
  model: string;
  providerId: string;
  isMock: boolean;
  latencyMs: number;
};

export type ProviderCostEstimate = {
  unit: "per-1k-tokens" | "per-request";
  /** Ước tính — KHÔNG phải hoá đơn thật, dùng để so sánh tương đối giữa
      các Provider trong `AI_SANDBOX.md`/`AI_RECRUITMENT_SYSTEM.md`. */
  estimate: number;
  currency: "USD";
};

export type ProviderHealth = {
  providerId: string;
  available: boolean;
  reason?: string;
  checkedAt: string;
};

export type ProviderBenchmarkResult = {
  providerId: string;
  capability: ProviderCapability;
  /** 0-100 — điểm tổng hợp MVP (thành công + tốc độ), không phải điểm
      chất lượng nội dung (chất lượng nội dung do con người/Reviewer Agent
      chấm — xem `docs/AI_SANDBOX.md` Phần I). */
  score: number;
  latencyMs: number;
  isMock: boolean;
  ranAt: string;
};

/**
 * AI SERVICE ADAPTER CONTRACT — mọi AI Service (10 Provider Wave 1 hôm
 * nay, mọi loại `AIServiceType` khác trong tương lai) đều phải implement
 * đúng interface này. Đây là hợp đồng duy nhất `AIServiceManager` biết
 * tới — không có logic gọi vendor nào được phép nằm ngoài 1 Adapter cụ
 * thể; không module nào được gọi thẳng OpenAI/Claude/Gemini/... — luôn
 * đi qua `AIServiceManager.execute()`.
 */
export interface AIServiceAdapter {
  readonly providerId: string;
  readonly name: string;
  readonly providerType: AIServiceType;
  readonly tier: ProviderTier;
  readonly supportedModels: string[];
  readonly supportedCapabilities: ProviderCapability[];
  readonly modelRegistry: ModelRegistryEntry[];
  readonly costProfile: ProviderCostProfile;
  readonly qualityProfile: ProviderQualityProfile;
  readonly speedProfile: ProviderSpeedProfile;
  readonly reliabilityProfile: ProviderReliabilityProfile;
  readonly privacyProfile: ProviderPrivacyProfile;
  readonly configuration: ProviderConfiguration;
  readonly securityProfile: ProviderSecurityProfile;

  /** Kiểm tra nhanh (không gọi mạng) — có đủ ENV var để hoạt động không. */
  isAvailable(): boolean;

  /** Gọi model thật (hoặc mock) — nơi DUY NHẤT được phép gọi HTTP tới vendor. */
  execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult>;

  /** Kiểm tra sức khoẻ — KHÔNG gọi API thật tốn phí, chỉ xác nhận cấu
      hình + trạng thái đã biết gần nhất. */
  healthCheck(): Promise<ProviderHealth>;

  /** Ước tính chi phí cho 1 request — tính toán thuần từ `costProfile`, không gọi mạng. */
  estimateCost(request: ProviderExecuteRequest): ProviderCostEstimate;

  /** Chạy 1 request thật qua `execute()` và trả về điểm Benchmark MVP. */
  benchmark(request: ProviderExecuteRequest): Promise<ProviderBenchmarkResult>;

  /** "Capability Mapping" tường minh — trả lại đúng `supportedCapabilities`,
      dùng làm API ổn định thay vì đọc trực tiếp field (cho phép Adapter
      tương lai tính toán động nếu cần). */
  getCapabilities(): ProviderCapability[];
}

/** Alias tương thích ngược — mọi code cũ dùng tên `ProviderAdapter` (từ
    Sprint EPIC 01/02) vẫn chạy nguyên, không cần sửa lại. Tên chính thức
    từ Sprint "AI Service Registry" trở đi là `AIServiceAdapter`. */
export type ProviderAdapter = AIServiceAdapter;
