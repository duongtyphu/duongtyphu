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

async function execute(request: ProviderManagerRequest): Promise<ProviderExecuteResult> {
  const adapter = selectAdapter({
    capability: request.capability,
    preferredProvider: request.preferredProvider,
    fallbackProvider: request.fallbackProvider,
    fallbackAllowed: request.fallbackAllowed,
    optimizeFor: request.optimizeFor,
  });
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
    throw err;
  }
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
