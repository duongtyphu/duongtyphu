/**
 * Provider Wave 1 — ModelRouter.
 *
 * Chọn đúng 1 `ProviderAdapter` cho 1 request — đây là nơi DUY NHẤT có
 * logic "provider nào nên chạy" trong toàn bộ layer. `ProviderManager`
 * không tự chọn Provider, luôn hỏi `ModelRouter`.
 *
 * Thứ tự quyết định:
 *   1. `preferredProvider` nếu có, hỗ trợ capability, và khả dụng.
 *   2. `fallbackProvider` nếu có, hỗ trợ capability, và khả dụng — lựa
 *      chọn thứ 2 CHỈ ĐỊNH TƯỜNG MINH (khác bước 3, vốn là bảng mặc định
 *      chung của hệ thống) — dùng khi caller (vd 1 Companion cụ thể
 *      trong `workforce-registry.ts`) tự khai báo chuỗi ưu tiên riêng.
 *   3. Thứ tự ưu tiên theo NHÓM capability (`CAPABILITY_FAMILY_PREFERENCE`).
 *   4. Nếu nhóm capability không khớp bảng ưu tiên, hoặc caller yêu cầu
 *      tối ưu riêng (`optimizeFor`) — xếp hạng mọi Adapter thật hỗ trợ
 *      capability đó theo tiêu chí tương ứng ("Cost Optimization"/
 *      "Benchmark Selection" — mặc định `"quality"`, dùng
 *      `ProviderScore.overallScore`).
 *   5. Khi nhiều Adapter cùng điểm cao nhất (hoà) — luân phiên chọn theo
 *      round-robin per-capability ("Load Balancing", kiến trúc chuẩn bị
 *      cho cân bằng tải có trọng số sau này).
 *   6. Nếu không có Adapter thật nào khả dụng: `fallbackAllowed !== false`
 *      → Mock; `fallbackAllowed === false` → ném lỗi rõ ràng.
 */
import "server-only";
import type { ProviderAdapter } from "./types";
import { providerRegistry } from "./registry";
import { computeProviderScore } from "./provider-score";

export type OptimizeFor = "quality" | "cost" | "speed";

export type SelectAdapterParams = {
  capability: string;
  preferredProvider?: string;
  fallbackProvider?: string;
  fallbackAllowed?: boolean; // mặc định true — giữ nguyên hành vi cũ
  /** "Cost Optimization"/"Benchmark Selection" — mặc định "quality". */
  optimizeFor?: OptimizeFor;
  /** Thứ tự ưu tiên Provider do Founder tự cấu hình qua Admin
      (`getProviderPriorityOrder()`, `priority-store.ts`) — khi có (và
      không rỗng), THAY THẾ `CAPABILITY_FAMILY_PREFERENCE[family]` ở bước
      3 (chỉ áp dụng trong nhánh `optimizeFor === "quality"`, giữ nguyên ý
      nghĩa "bảng ưu tiên mặc định của hệ thống"). Không truyền/rỗng → giữ
      nguyên hành vi cũ (bảng ưu tiên cố định theo nhóm capability). */
  priorityOrder?: string[];
};

/**
 * Nhóm capability → thứ tự Provider ưu tiên. Khoá là "họ" capability
 * (phần trước dấu `.` của capabilityId, vd "writing.draft" → "writing").
 * Provider Wave 1 (10 Provider, 4 Tier) — thêm Perplexity vào nhóm
 * "research" (chuyên biệt research/web-search thật), giữ nguyên các
 * nhóm khác đã có từ EPIC 01/02.
 */
const CAPABILITY_FAMILY_PREFERENCE: Record<string, string[]> = {
  writing: ["anthropic", "openai", "mock"],
  coding: ["openai", "anthropic", "deepseek", "mock"],
  research: ["gemini", "perplexity", "anthropic", "mock"],
  review: ["anthropic", "openai", "mock"],
  strategy: ["anthropic", "openai", "mock"],
  qa: ["openai", "anthropic", "mock"],
  office: ["openai", "anthropic", "mock"],
  growth: ["anthropic", "openai", "mock"],
  business: ["anthropic", "openai", "mock"],
  design: ["openai", "anthropic", "mock"],
  automation: ["openai", "anthropic", "deepseek", "mock"],
};

function capabilityFamily(capability: string): string {
  return capability.split(".")[0];
}

/** "Capability Matching" — mọi Adapter đã đăng ký (kể cả chưa khả dụng)
    khai báo hỗ trợ 1 capability cụ thể. Dùng cho UI/Benchmark cần biết
    "ai CÓ THỂ làm việc này", khác `listSupporting` nội bộ chỉ lọc theo
    Registry thô — hàm này là API công khai ổn định cho phần còn lại của
    hệ thống (vd Workforce Registry muốn hiển thị "3 Provider hỗ trợ
    capability X"). */
export function matchCapability(capability: string): ProviderAdapter[] {
  return providerRegistry.listSupporting(capability);
}

/** "Load Balancing" (kiến trúc chuẩn bị) — bộ đếm round-robin theo từng
    capability, chỉ dùng khi có ≥2 Adapter hoà điểm cao nhất. Chưa phải
    cân bằng tải có trọng số theo tải thực tế (queue/latency runtime) —
    đó là bước mở rộng của Sprint sau; ở đây đảm bảo khi hoà điểm, hệ
    thống không luôn luôn chọn đúng 1 Provider (phân tán tải cơ bản). */
const roundRobinCounters = new Map<string, number>();

function pickWithRoundRobin(capability: string, tiedCandidates: ProviderAdapter[]): ProviderAdapter {
  if (tiedCandidates.length === 1) return tiedCandidates[0];
  const counter = roundRobinCounters.get(capability) ?? 0;
  const chosen = tiedCandidates[counter % tiedCandidates.length];
  roundRobinCounters.set(capability, counter + 1);
  return chosen;
}

function rankByOptimizeFor(candidates: ProviderAdapter[], optimizeFor: OptimizeFor): ProviderAdapter[] {
  if (optimizeFor === "cost") {
    return [...candidates].sort((a, b) => a.costProfile.inputPer1kTokens - b.costProfile.inputPer1kTokens);
  }
  if (optimizeFor === "speed") {
    return [...candidates].sort((a, b) => computeProviderScore(b.providerId).speed - computeProviderScore(a.providerId).speed);
  }
  // "quality" (mặc định) — Benchmark Selection dựa trên ProviderScore tổng hợp.
  return [...candidates].sort(
    (a, b) => computeProviderScore(b.providerId).overallScore - computeProviderScore(a.providerId).overallScore
  );
}

export function selectAdapter(params: SelectAdapterParams): ProviderAdapter {
  const { capability, preferredProvider, fallbackProvider, fallbackAllowed = true, optimizeFor = "quality", priorityOrder } = params;

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

  // Chỉ dùng bảng ưu tiên mặc định khi caller KHÔNG yêu cầu tối ưu riêng
  // (optimizeFor khác "quality" nghĩa là caller cố tình muốn xếp hạng
  // theo tiêu chí cụ thể, bỏ qua bảng ưu tiên cố định).
  if (optimizeFor === "quality") {
    const family = capabilityFamily(capability);
    const preferenceOrder = priorityOrder && priorityOrder.length > 0 ? priorityOrder : CAPABILITY_FAMILY_PREFERENCE[family];
    if (preferenceOrder) {
      for (const providerId of preferenceOrder) {
        if (providerId === "mock") continue; // Mock chỉ được chọn ở bước fallback cuối
        const candidate = providerRegistry.get(providerId);
        if (candidate && candidate.supportedCapabilities.includes(capability) && candidate.isAvailable()) {
          return candidate;
        }
      }
    }
  }

  const realCandidates = providerRegistry
    .listSupporting(capability)
    .filter((a) => a.providerId !== "mock" && a.isAvailable());

  if (realCandidates.length > 0) {
    const ranked = rankByOptimizeFor(realCandidates, optimizeFor);
    const topScore =
      optimizeFor === "cost" ? ranked[0].costProfile.inputPer1kTokens : computeProviderScore(ranked[0].providerId).overallScore;
    const tied = ranked.filter((a) =>
      optimizeFor === "cost" ? a.costProfile.inputPer1kTokens === topScore : computeProviderScore(a.providerId).overallScore === topScore
    );
    return pickWithRoundRobin(capability, tied);
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
