/**
 * PHASE 4 EPIC 01 — ModelRouter.
 *
 * Chọn đúng 1 `ProviderAdapter` cho 1 request — đây là nơi DUY NHẤT có
 * logic "provider nào nên chạy" trong toàn bộ layer. `ProviderManager`
 * không tự chọn Provider, luôn hỏi `ModelRouter`.
 *
 * Thứ tự quyết định:
 *   1. `preferredProvider` nếu có, hỗ trợ capability, và khả dụng.
 *   2. `fallbackProvider` nếu có, hỗ trợ capability, và khả dụng — đây là
 *      lựa chọn thứ 2 CHỈ ĐỊNH TƯỜNG MINH (khác bước 3, vốn là bảng mặc
 *      định chung của hệ thống) — dùng khi caller (vd 1 Companion cụ thể
 *      trong `workforce-registry.ts`) tự khai báo chuỗi ưu tiên riêng
 *      (PHASE 4 EPIC 02: "Provider Preference → Fallback Provider → Mock").
 *   3. Thứ tự ưu tiên theo NHÓM capability (`CAPABILITY_FAMILY_PREFERENCE`
 *      — vd "writing" → Anthropic/OpenAI/Mock, "research" → Gemini/
 *      Anthropic/Mock) — Adapter đầu tiên trong danh sách đang khả dụng
 *      thắng.
 *   4. Nếu nhóm capability không khớp bảng ưu tiên (capability mới,
 *      chưa phân loại) — xếp hạng mọi Adapter thật hỗ trợ capability đó
 *      theo `ProviderScore.overallScore` (điểm cao nhất thắng).
 *   5. Nếu không có Adapter thật nào khả dụng: `fallbackAllowed !== false`
 *      → Mock; `fallbackAllowed === false` → ném lỗi rõ ràng (dùng khi
 *      caller cố tình muốn Provider thật, không chấp nhận Mock — vd
 *      Benchmark/Certification cần dữ liệu thật).
 */
import "server-only";
import type { ProviderAdapter } from "./types";
import { providerRegistry } from "./registry";
import { computeProviderScore } from "./provider-score";

export type SelectAdapterParams = {
  capability: string;
  preferredProvider?: string;
  fallbackProvider?: string;
  fallbackAllowed?: boolean; // mặc định true — giữ nguyên hành vi cũ
};

/**
 * Nhóm capability → thứ tự Provider ưu tiên. Khoá là "họ" capability
 * (phần trước dấu `.` của capabilityId, vd "writing.draft" → "writing"),
 * khớp đúng ví dụ EPIC 01: Writing/Coding/Research/Review.
 */
const CAPABILITY_FAMILY_PREFERENCE: Record<string, string[]> = {
  writing: ["anthropic", "openai", "mock"],
  coding: ["openai", "anthropic", "mock"],
  research: ["gemini", "anthropic", "mock"],
  review: ["anthropic", "openai", "mock"],
  // PHASE 4 EPIC 02 — Wave 1 Companion capability family:
  strategy: ["anthropic", "openai", "mock"],
  qa: ["openai", "anthropic", "mock"],
  office: ["openai", "anthropic", "mock"],
  growth: ["anthropic", "openai", "mock"],
};

function capabilityFamily(capability: string): string {
  return capability.split(".")[0];
}

export function selectAdapter(params: SelectAdapterParams): ProviderAdapter {
  const { capability, preferredProvider, fallbackProvider, fallbackAllowed = true } = params;

  if (preferredProvider) {
    const preferred = providerRegistry.get(preferredProvider);
    if (preferred && preferred.supportedCapabilities.includes(capability) && preferred.isAvailable()) {
      return preferred;
    }
    // preferredProvider không khả dụng/không hỗ trợ — không throw, rơi
    // xuống lựa chọn tự động để giữ tính bền vững của Workspace.
  }

  if (fallbackProvider) {
    const fallback = providerRegistry.get(fallbackProvider);
    if (fallback && fallback.supportedCapabilities.includes(capability) && fallback.isAvailable()) {
      return fallback;
    }
  }

  const family = capabilityFamily(capability);
  const preferenceOrder = CAPABILITY_FAMILY_PREFERENCE[family];
  if (preferenceOrder) {
    for (const providerId of preferenceOrder) {
      if (providerId === "mock") continue; // Mock chỉ được chọn ở bước fallback cuối, không lẫn vào thứ tự ưu tiên "thật"
      const candidate = providerRegistry.get(providerId);
      if (candidate && candidate.supportedCapabilities.includes(capability) && candidate.isAvailable()) {
        return candidate;
      }
    }
  }

  const realCandidates = providerRegistry
    .listSupporting(capability)
    .filter((a) => a.providerId !== "mock" && a.isAvailable());

  if (realCandidates.length > 0) {
    const ranked = [...realCandidates].sort(
      (a, b) => computeProviderScore(b.providerId).overallScore - computeProviderScore(a.providerId).overallScore
    );
    return ranked[0];
  }

  if (!fallbackAllowed) {
    throw new Error(
      `Không có AI Provider thật nào khả dụng cho capability "${capability}" và fallbackAllowed=false — không tự chuyển sang Mock.`
    );
  }

  const mock = providerRegistry.get("mock");
  if (!mock) throw new Error("MockProviderAdapter chưa được đăng ký — lỗi cấu hình ProviderRegistry.");
  return mock;
}
