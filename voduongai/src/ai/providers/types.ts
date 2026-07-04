/**
 * PHASE 4 EPIC 01/"Provider Wave 1" — AI Provider Layer — hợp đồng dữ
 * liệu dùng chung.
 *
 * "server-only" theo tinh thần chung của toàn bộ layer này (không import
 * vào component client — chỉ dùng trong route handler/agent server-side).
 * Không có API key nào được hard-code ở đây — mọi Adapter tự đọc key
 * riêng từ `process.env` tại thời điểm `execute()`/`isAvailable()`.
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
    (`provider-score.ts`), dùng baseline này làm "prior" trước khi có đủ
    dữ liệu thật. Không được nhầm 2 khái niệm này với nhau. */
export type ProviderBenchmarkProfile = {
  reportedQuality: number; // 0-100
  reportedSpeed: number; // 0-100
  reportedReliability: number; // 0-100
};

export type ProviderConfiguration = {
  /** Tên biến ENV cần có để Provider hoạt động thật — KHÔNG lưu giá trị. */
  envVar: string;
  /** Ollama (local runtime) cần thêm Base URL, không phải API key — các
      Provider khác để trống. */
  optionalEnvVar?: string;
};

export type ProviderSecurityPolicy = {
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
 * PROVIDER ADAPTER CONTRACT — mọi Provider (10 Provider Wave 1: OpenAI/
 * Claude/Gemini/DeepSeek/Grok/Mistral/Ollama/Perplexity/Cohere/Mock)
 * đều phải implement đúng interface này. Đây là hợp đồng duy nhất
 * `ProviderManager` biết tới — không có logic gọi vendor nào được phép
 * nằm ngoài 1 Adapter cụ thể.
 */
export interface ProviderAdapter {
  readonly providerId: string;
  readonly name: string;
  readonly tier: ProviderTier;
  readonly supportedModels: string[];
  readonly supportedCapabilities: ProviderCapability[];
  readonly modelRegistry: ModelRegistryEntry[];
  readonly costProfile: ProviderCostProfile;
  readonly benchmarkProfile: ProviderBenchmarkProfile;
  readonly configuration: ProviderConfiguration;
  readonly securityPolicy: ProviderSecurityPolicy;

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
}
