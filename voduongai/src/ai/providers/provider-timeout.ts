import "server-only";

/**
 * Timeout mạng CHUNG cho mọi Adapter gọi API bên ngoài (`fetch`) —
 * TRƯỚC ĐÂY không có Adapter nào đặt timeout cho `fetch`, nên 1 request
 * treo (vendor quá tải/mạng chập chờn) chiếm dụng toàn bộ ngân sách thời
 * gian của route cho tới khi Vercel tự HẠ GỤC cả function (mặc định gói
 * Hobby 10s — xem `maxDuration` mới thêm ở `/api/companion/chat/route.ts`),
 * hiện ra phía người dùng như lỗi "Companion chưa thể phản hồi lúc này"
 * không rõ nguyên nhân, không có cách nào phân biệt "vendor lỗi thật" với
 * "chỉ đơn giản là chậm".
 *
 * 25s/lần thử — đủ để `ProviderManager.execute()` thử tối đa 2 Provider
 * (Provider chính + 1 dự phòng khi Provider chính lỗi/hết giờ, xem
 * `provider-manager.ts`'s cơ chế retry-with-fallback) trong ngân sách
 * `maxDuration=60` (trần cho phép của gói Hobby), vẫn còn dư ~5-10s cho
 * phần Supabase/dựng prompt của route.
 *
 * Dùng `AbortSignal.timeout()` (API chuẩn, không cần tự viết
 * `AbortController`/`setTimeout`/`clearTimeout` thủ công) — hỗ trợ sẵn
 * trên runtime Node.js của Vercel (>=18).
 */
export const PROVIDER_FETCH_TIMEOUT_MS = 25_000;
