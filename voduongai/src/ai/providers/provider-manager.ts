/**
 * PHASE 4 EPIC 01 — ProviderManager.
 *
 * CỔNG DUY NHẤT để AI Workforce gọi AI. Không module/Companion nào được
 * gọi `ProviderAdapter`/vendor API trực tiếp — mọi lời gọi đi qua
 * `providerManager.execute(...)`. `writer-agent.ts`/`reviewer-agent.ts`
 * (PHASE 4 EPIC 01) đã được nối qua đây; các agent Admin Companion
 * Studio cũ (`community.agent.ts`, `content.agent.ts`, ...) nằm ngoài
 * phạm vi EPIC này — không đổi, tiếp tục dùng `companion.agent.ts` như
 * trước (không phá kiến trúc Admin đã khóa).
 */
import "server-only";
import type { ProviderExecuteResult, ProviderHealth } from "./types";
import { providerRegistry } from "./registry";
import { selectAdapter } from "./model-router";
import { recordExecution } from "./provider-execution-log";
import { checkAllProvidersHealth } from "./provider-health-check";

export type ProviderManagerRequest = {
  capability: string;
  taskType: string;
  input: Record<string, unknown>;
  context?: string;
  preferredProvider?: string;
};

async function execute(request: ProviderManagerRequest): Promise<ProviderExecuteResult> {
  const adapter = selectAdapter({ capability: request.capability, preferredProvider: request.preferredProvider });
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

export const providerManager = {
  execute,
  hasAvailableRealProvider,
  healthCheckAll,
};
