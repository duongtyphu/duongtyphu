import { NextResponse } from "next/server";
import { providerRegistry } from "@/ai/providers/registry";
import { getProviderPriorityOrder } from "@/ai/providers/priority-store";

/**
 * FIX INF-02 — Provider Health Boundary.
 *
 * Endpoint PUBLIC (không yêu cầu đăng nhập) — CHỈ trả trạng thái tổng
 * quát "ready"/"degraded"/"unavailable". KHÔNG BAO GIỜ trả `providerId`/
 * `model`/tên biến môi trường/thứ tự ưu tiên/bất kỳ metadata hạ tầng
 * nào — đúng nguyên tắc "ẩn hạ tầng AI khỏi người dùng" (xem
 * `CompanionChatHeader.tsx`). Nếu Admin cần chi tiết từng Provider, dùng
 * `/admin/he-thong/api-tich-hop` (đã `requireAdmin()` bảo vệ, đọc
 * `checkAllProvidersHealth()`) — KHÔNG tạo thêm endpoint public chi tiết
 * nào khác.
 *
 * ĐÍNH CHÍNH so với bản cũ (audit INF-02 phát hiện): bản cũ hard-code 3
 * Provider (OpenAI/Anthropic/Gemini) và dùng `selectAdapter({capability})`
 * KHÔNG truyền `priorityOrder` — rơi về `CAPABILITY_FAMILY_PREFERENCE`
 * cũ, không đồng bộ với thứ tự ưu tiên Founder cấu hình qua Admin. Bản
 * này dùng ĐÚNG 2 nguồn sự thật: `providerRegistry` (toàn bộ Provider đã
 * đăng ký, không hard-code danh sách) + `getProviderPriorityOrder()`
 * (cùng nguồn `provider-manager.ts::execute()` dùng cho Companion thật —
 * không phải bảng ưu tiên cũ theo capability).
 *
 * Quy tắc xác định trạng thái (chỉ dựa trên `isAvailable()` — kiểm tra
 * ENV có giá trị, KHÔNG gọi mạng thật):
 *   - "ready"       — Provider ĐỨNG ĐẦU danh sách ưu tiên đang khả dụng
 *                      (đúng cấu hình mong muốn, hoạt động bình thường).
 *   - "degraded"     — Provider đứng đầu KHÔNG khả dụng, nhưng vẫn còn ít
 *                      nhất 1 Provider khác trong danh sách ưu tiên khả
 *                      dụng (đang chạy bằng fallback, không phải lựa chọn
 *                      chính).
 *   - "unavailable"  — KHÔNG có Provider thật nào trong danh sách ưu tiên
 *                      khả dụng (mọi request thật sẽ rơi về Mock).
 */
export async function GET() {
  const priorityOrder = await getProviderPriorityOrder();

  const isAvailable = (providerId: string) => providerRegistry.get(providerId)?.isAvailable() ?? false;

  const primaryId = priorityOrder[0];
  const primaryAvailable = primaryId ? isAvailable(primaryId) : false;
  const anyAvailable = priorityOrder.some(isAvailable);

  const status = primaryAvailable ? "ready" : anyAvailable ? "degraded" : "unavailable";

  return NextResponse.json({ status });
}
