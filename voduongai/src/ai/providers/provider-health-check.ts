/**
 * PHASE 4 EPIC 01 — ProviderHealthCheck.
 *
 * Kiểm tra sức khoẻ TOÀN BỘ Provider đã đăng ký — KHÔNG gọi API thật tốn
 * phí, chỉ gọi `adapter.healthCheck()` của từng Adapter (bản thân mỗi
 * Adapter chỉ xác nhận cấu hình ENV, không gọi mạng — xem
 * `types.ts` mô tả hợp đồng `healthCheck()`).
 */
import "server-only";
import type { ProviderHealth } from "./types";
import { providerRegistry } from "./registry";

export async function checkAllProvidersHealth(): Promise<ProviderHealth[]> {
  return Promise.all(providerRegistry.list().map((adapter) => adapter.healthCheck()));
}

export async function checkProviderHealth(providerId: string): Promise<ProviderHealth | null> {
  const adapter = providerRegistry.get(providerId);
  if (!adapter) return null;
  return adapter.healthCheck();
}
