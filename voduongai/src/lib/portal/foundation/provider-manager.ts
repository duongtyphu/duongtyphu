/**
 * PHASE 4 EPIC 01 — AI Provider Manager (real implementation).
 *
 * Đây chính là "1 điểm duy nhất chạm runtime" đã được ghi chú trước ở
 * `docs/OPEN_AI_WORKFORCE_PLATFORM.md` §7: thay vì Workspace gọi thẳng
 * `createWorkforceApiProvider()`, Workspace gọi qua
 * `getProviderForCapability(capabilityId)` — Provider Manager tra
 * `AI Provider Registry` để chọn Provider phù hợp. Hành vi bên ngoài
 * (Output/Review/Approval/Portfolio) không đổi — đây là phép thay thế
 * 1-1, không phải thay đổi kiến trúc.
 */

import { createWorkforceApiProvider, type AiProvider } from "./ai-provider";
import { getProviderEntry } from "./provider-registry";

/**
 * Ánh xạ Capability → danh sách Provider ưu tiên (thứ tự chọn). Chỉ có
 * 1 Provider thật ở EPIC 01 — danh sách sẽ dài hơn khi EPIC 04 (AI
 * Benchmark Center) có dữ liệu Compatibility Matrix thật để xếp hạng.
 */
const CAPABILITY_PROVIDER_PRIORITY: Record<string, string[]> = {
  "writing.draft": ["workforce-api-v1"],
  "writing.review": ["workforce-api-v1"],
};

/** Factory khởi tạo Provider thật theo `providerId` — tách khỏi Registry
    (Registry chỉ chứa metadata, không chứa hàm/instance). */
const PROVIDER_FACTORIES: Record<string, () => AiProvider> = {
  "workforce-api-v1": createWorkforceApiProvider,
};

/**
 * Chọn và khởi tạo Provider phù hợp cho 1 Capability cụ thể. Ném lỗi rõ
 * ràng nếu không có Provider nào đã đăng ký + sẵn sàng — không âm thầm
 * trả về `undefined` khiến lỗi ẩn xuống tầng dưới.
 */
export function getProviderForCapability(capabilityId: string): AiProvider {
  const candidateIds = CAPABILITY_PROVIDER_PRIORITY[capabilityId] ?? [];
  for (const providerId of candidateIds) {
    const entry = getProviderEntry(providerId);
    const factory = PROVIDER_FACTORIES[providerId];
    if (entry && entry.status === "registered" && factory) {
      return factory();
    }
  }
  throw new Error(`Không tìm thấy AI Provider đã đăng ký cho capability "${capabilityId}".`);
}
