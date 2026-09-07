/**
 * AIServiceManager (tên nội bộ file/biến vẫn giữ `provider-manager.ts`/
 * `providerManager` để không phá import đã có — export thêm alias
 * `aiServiceManager` làm tên chính thức từ Sprint "AI Service Registry").
 *
 * CỔNG DUY NHẤT để AI Workforce gọi bất kỳ AI Service nào (LLM hôm nay,
 * Image/Video/Voice/Search/Automation Sprint sau). Không module/Companion
 * nào được gọi `AIServiceAdapter`/vendor API trực tiếp — mọi lời gọi đi
 * qua `aiServiceManager.execute(...)`. `writer-agent.ts`/`reviewer-agent.ts`
 * đã được nối qua đây; các agent Admin Companion Studio cũ
 * (`community.agent.ts`, `content.agent.ts`, ...) nằm ngoài phạm vi này
 * — không đổi, tiếp tục dùng `companion.agent.ts` như trước (không phá
 * kiến trúc Admin đã khóa).
 */
import "server-only";
import type { ProviderExecuteResult, ProviderHealth } from "./types";
import { providerRegistry } from "./registry";
import { selectAdapter, matchCapability, type OptimizeFor } from "./model-router";
import { recordExecution } from "./provider-execution-log";
import { checkAllProvidersHealth } from "./provider-health-check";
import { getProviderPriorityOrder } from "./priority-store";

export type ProviderManagerRequest = {
  capability: string;
  taskType: string;
  input: Record<string, unknown>;
  context?: string;
  preferredProvider?: string;
  /** Provider thứ 2 chỉ định tường minh (vd "Fallback Provider" khai báo
      riêng của 1 Companion trong `workforce-registry.ts`), được thử SAU
      `preferredProvider` và TRƯỚC bảng ưu tiên mặc định của hệ thống. */
  fallbackProvider?: string;
  /** Mặc định `true` (giữ nguyên hành vi hiện có — tự fallback Mock khi
      không có Provider thật nào khả dụng). Đặt `false` khi caller bắt
      buộc cần Provider thật (vd Benchmark có chủ đích) — khi đó thiếu
      Provider thật sẽ ném lỗi thay vì âm thầm chạy Mock. */
  fallbackAllowed?: boolean;
  /** "Cost Optimization"/"Benchmark Selection" — mặc định "quality". */
  optimizeFor?: OptimizeFor;
};

/**
 * Retry-with-fallback (tối đa 2 lần thử) — TRƯỚC ĐÂY `execute()` chỉ thử
 * ĐÚNG 1 Adapter (`selectAdapter()` chọn 1 lần duy nhất): Provider chính
 * gặp sự cố tạm thời (rate-limit/quá tải/mạng chập chờn/timeout — xem
 * `provider-timeout.ts`) là request LỖI NGAY, dù Provider dự phòng đã
 * khai báo sẵn trong `CAPABILITY_FAMILY_PREFERENCE` (vd nhóm "growth"
 * dùng cho Companion Chat: `["anthropic", "openai", "mock"]`) hoàn toàn
 * không được thử tới — đây là nguyên nhân chính khiến `/v2/companion`/
 * `/portal/companion` hay báo "Companion chưa thể phản hồi lúc này".
 *
 * Lượt 2 loại trừ (`excludeProviderIds`) đúng Provider vừa lỗi, để
 * `selectAdapter()` tự nhiên chọn Provider THẬT kế tiếp. Nếu lượt 2 không
 * còn Provider thật nào khác (chỉ còn Mock) — DỪNG NGAY, không âm thầm
 * trả lời bằng Mock (sẽ hiện nhầm thông báo "chưa cấu hình API key" dù
 * Provider thật ĐÃ cấu hình, chỉ đang lỗi tạm thời) — ném lại lỗi gốc để
 * `route.ts` trả đúng thông báo thân thiện. Hành vi fallback-Mock-khi-
 * KHÔNG-có-Provider-thật-nào-từ-đầu (mọi caller khác dựa vào, xem
 * `writer-agent.ts`/`reviewer-agent.ts`/`/api/ai/workforce`) giữ nguyên
 * 100% — trường hợp đó Mock luôn được chọn ngay ở lượt 1 (không lỗi),
 * vòng lặp trả về ngay, không bao giờ chạm lượt 2.
 */
async function execute(request: ProviderManagerRequest): Promise<ProviderExecuteResult> {
  const priorityOrder = await getProviderPriorityOrder();
  const tried: string[] = [];
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    const adapter = selectAdapter({
      capability: request.capability,
      preferredProvider: request.preferredProvider,
      fallbackProvider: request.fallbackProvider,
      fallbackAllowed: request.fallbackAllowed,
      optimizeFor: request.optimizeFor,
      priorityOrder,
      excludeProviderIds: tried,
    });

    // Lượt thử lại (attempt > 0) không còn Provider thật nào khác ngoài
    // Mock — dừng, không thử Mock thay thế (xem docblock trên).
    if (attempt > 0 && adapter.providerId === "mock") break;

    const startedAt = Date.now();
    try {
      const result = await adapter.execute({
        taskType: request.taskType,
        input: request.input,
        context: request.context,
      });
      recordExecution({
        providerId: adapter.providerId,
        capability: request.capability,
        taskType: request.taskType,
        success: true,
        isMock: result.isMock,
        latencyMs: Date.now() - startedAt,
        at: new Date().toISOString(),
      });
      return result;
    } catch (err) {
      recordExecution({
        providerId: adapter.providerId,
        capability: request.capability,
        taskType: request.taskType,
        success: false,
        isMock: adapter.providerId === "mock",
        latencyMs: Date.now() - startedAt,
        error: err instanceof Error ? err.message : "Lỗi không xác định.",
        at: new Date().toISOString(),
      });
      lastError = err;
      tried.push(adapter.providerId);
    }
  }

  throw lastError;
}

/** Có ít nhất 1 Provider THẬT (không tính Mock) đã cấu hình sẵn sàng? */
function hasAvailableRealProvider(): boolean {
  return providerRegistry.list().some((a) => a.providerId !== "mock" && a.isAvailable());
}

function healthCheckAll(): Promise<ProviderHealth[]> {
  return checkAllProvidersHealth();
}

/** "Capability Matching" — trả về mọi Provider đã đăng ký (kể cả chưa
    khả dụng) khai báo hỗ trợ 1 capability cụ thể. */
function matchProvidersForCapability(capability: string) {
  return matchCapability(capability);
}

export const providerManager = {
  execute,
  hasAvailableRealProvider,
  healthCheckAll,
  matchProvidersForCapability,
};

/** Tên chính thức từ Sprint "AI Service Registry" trở đi — cùng 1 object. */
export const aiServiceManager = providerManager;
