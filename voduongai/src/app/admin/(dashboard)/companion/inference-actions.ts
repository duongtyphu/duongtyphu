"use server";

/**
 * Sprint CS-01 — Companion Studio: Inference Layer (Foundation).
 * Sprint CS-02 — mở rộng thêm `modelRegistry` (đọc từ Adapter, vẫn CHỈ
 * ĐỌC) để trang chi tiết từng Provider có đủ dữ liệu cho nhóm "Models"
 * (mô tả model thật, không hardcode) — KHÔNG đổi 3 field cũ đã có từ
 * CS-01, tab CS-01 tiếp tục nhận đúng shape cũ, render y hệt trước.
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

export type ProviderModelInfo = {
  modelId: string;
  contextWindow: number;
  description: string;
};

export type ProviderMetadata = {
  providerId: string;
  name: string;
  tier: "core" | "recommended" | "specialized" | "development";
  providerType: string;
  supportedModels: string[];
  envVar: string;
  optionalEnvVar?: string;
  /** CS-02 — metadata model đầy đủ (modelId/contextWindow/description thật
      từ chính Adapter, không phải chuỗi bịa) — dùng cho nhóm "Models" +
      "Overview → Description" (không có field "description" cấp Provider
      nào trong `AIServiceAdapter`, mô tả model là dữ liệu thật gần nhất). */
  modelRegistry: ProviderModelInfo[];
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
    modelRegistry: adapter.modelRegistry.map((m) => ({
      modelId: m.modelId,
      contextWindow: m.contextWindow,
      description: m.description,
    })),
  }));
}
