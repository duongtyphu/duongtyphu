"use server";

/**
 * Sprint CS-01 — Companion Studio: Inference Layer (Foundation).
 *
 * CHỈ ĐỌC metadata Provider đã đăng ký (server-only `providerRegistry`) —
 * KHÔNG đọc/ghi API key nào, KHÔNG gọi `ProviderManager.execute()`, KHÔNG
 * đổi hành vi `selectAdapter()`. File riêng, không sửa `runtime-actions.ts`
 * hiện có (Chat Runtime tab tiếp tục hoạt động y hệt trước).
 *
 * `getCompanionProviderHealth()` (đã có sẵn trong `runtime-actions.ts`,
 * gọi `checkAllProvidersHealth()`) là hàm CHỈ-ĐỌC dùng lại nguyên vẹn cho
 * cột "Trạng thái"/"Health Check" — không viết lại logic kiểm tra key.
 */

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { providerRegistry } from "@/ai/providers/registry";

export type ProviderMetadata = {
  providerId: string;
  name: string;
  tier: "core" | "recommended" | "specialized" | "development";
  providerType: string;
  supportedModels: string[];
  envVar: string;
  optionalEnvVar?: string;
};

/**
 * Metadata client-safe của 10 Provider đã đăng ký — KHÔNG chứa key/giá
 * trị biến môi trường nào (chỉ tên biến cần có), KHÔNG chứa instance
 * Adapter thật (không serialize được function `execute`/`isAvailable`
 * qua Server Action → Client Component).
 */
export async function listProviderMetadata(): Promise<ProviderMetadata[]> {
  const admin = await requireAdmin();
  if (!admin) return [];

  return providerRegistry.list().map((adapter) => ({
    providerId: adapter.providerId,
    name: adapter.name,
    tier: adapter.tier,
    providerType: adapter.providerType,
    supportedModels: adapter.supportedModels,
    envVar: adapter.configuration.envVar,
    optionalEnvVar: adapter.configuration.optionalEnvVar,
  }));
}
