"use client";

/**
 * Next.js 16 App Router — xác nhận qua repro cục bộ (100% tái hiện được)
 * VÀ qua Network/Console tab trên Preview thật: click vào `next/link` đôi
 * khi khiến request RSC hoàn tất (200) nhưng router client không bao giờ
 * áp dụng kết quả — URL/nội dung đứng yên vĩnh viễn, không có lỗi nào lộ
 * ra ngoài. Đây là giới hạn/lỗi của chính framework (đã loại trừ: prefetch
 * hover-race, gọi Supabase phía client, và đã thử next@16.2.10 — cả 3 đều
 * không phải nguyên nhân), không phải lỗi trong code của app.
 *
 * Hàm này KHÔNG thay thế `next/link` — nó chỉ theo dõi xem điều hướng có
 * thực sự "chốt" (URL đổi) trong `timeoutMs` hay không; nếu không, mới ép
 * điều hướng full-page làm phương án dự phòng, để người dùng không bao giờ
 * bị đứng trang vĩnh viễn.
 */
export function createNavigationFallbackHandler(href: string, timeoutMs = 2500) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const target = new URL(href, window.location.origin);
    if (window.location.pathname === target.pathname && window.location.search === target.search) return;
    window.setTimeout(() => {
      if (window.location.pathname !== target.pathname || window.location.search !== target.search) {
        window.location.href = href;
      }
    }, timeoutMs);
  };
}
