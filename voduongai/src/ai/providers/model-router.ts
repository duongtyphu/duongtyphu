/**
 * PHASE 4 EPIC 01 — ModelRouter.
 *
 * Chọn đúng 1 `ProviderAdapter` cho 1 request — đây là nơi DUY NHẤT có
 * logic "provider nào nên chạy" trong toàn bộ layer. `ProviderManager`
 * không tự chọn Provider, luôn hỏi `ModelRouter`.
 *
 * Thứ tự ưu tiên:
 *   1. `preferredProvider` nếu có, hỗ trợ capability, và khả dụng.
 *   2. Provider hỗ trợ capability + khả dụng, xếp hạng theo `ProviderScore`
 *      (điểm cao nhất thắng) — không tính Mock ở bước này.
 *   3. Mock — fallback cuối cùng khi KHÔNG có Provider thật nào khả dụng
 *      (đúng hành vi mock đã có từ MVP, nay tường minh trong Router).
 */
import "server-only";
import type { ProviderAdapter } from "./types";
import { providerRegistry } from "./registry";
import { computeProviderScore } from "./provider-score";

export type SelectAdapterParams = {
  capability: string;
  preferredProvider?: string;
};

export function selectAdapter(params: SelectAdapterParams): ProviderAdapter {
  const { capability, preferredProvider } = params;

  if (preferredProvider) {
    const preferred = providerRegistry.get(preferredProvider);
    if (preferred && preferred.supportedCapabilities.includes(capability) && preferred.isAvailable()) {
      return preferred;
    }
    // preferredProvider không khả dụng/không hỗ trợ — không throw, rơi
    // xuống lựa chọn tự động để giữ tính bền vững của Workspace.
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

  const mock = providerRegistry.get("mock");
  if (!mock) throw new Error("MockProviderAdapter chưa được đăng ký — lỗi cấu hình ProviderRegistry.");
  return mock;
}
