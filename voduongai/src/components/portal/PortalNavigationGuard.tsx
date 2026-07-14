"use client";

import { useEffect, useRef } from "react";

/**
 * Next.js 16 App Router — xác nhận qua repro cục bộ (100% tái hiện được,
 * đã loại trừ prefetch hover-race, gọi Supabase phía client, và
 * next@16.2.10) VÀ trên Preview thật (Network/Console tab): bấm bất kỳ
 * `next/link` nào trong Portal đôi khi khiến request RSC hoàn tất (200)
 * nhưng router client không bao giờ áp dụng kết quả — URL/nội dung đứng
 * yên vĩnh viễn, không lỗi nào lộ ra. Hiện tượng không giới hạn ở
 * Sidebar/Header — xảy ra với mọi link trong Portal (kể cả các mục con
 * bên trong từng trang), nên phải bắt ở mức toàn cục thay vì gắn từng
 * `<Link>` một.
 *
 * Component này lắng nghe click trên toàn bộ Portal (capture phase),
 * theo dõi xem điều hướng có thực sự "chốt" (URL đổi) trong
 * `TIMEOUT_MS` hay không; nếu không, mới ép điều hướng full-page làm
 * phương án dự phòng — không thay `next/link` bằng `<a>`, không tắt SPA
 * navigation trong trường hợp bình thường.
 */
const TIMEOUT_MS = 2500;

export function PortalNavigationGuard() {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function clearPending() {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function handleClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let target: URL;
      try {
        target = new URL(anchor.href);
      } catch {
        return;
      }
      if (target.origin !== window.location.origin) return;
      if (target.pathname === window.location.pathname && target.search === window.location.search) return;

      clearPending();
      const { pathname: targetPathname, search: targetSearch, href: targetHref } = target;
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        if (window.location.pathname !== targetPathname || window.location.search !== targetSearch) {
          window.location.href = targetHref;
        }
      }, TIMEOUT_MS);
    }

    // Điều hướng SPA thành công (hoặc back/forward) đổi URL qua pushState/
    // popstate — huỷ timer dự phòng đang chờ vì không còn cần nữa.
    function handleRouteSettled() {
      clearPending();
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handleRouteSettled);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handleRouteSettled);
      clearPending();
    };
  }, []);

  return null;
}
