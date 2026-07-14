"use client";

import { useEffect, useRef } from "react";

/**
 * Next.js 16 App Router — xác nhận qua repro cục bộ (100% tái hiện được,
 * đã loại trừ prefetch hover-race, gọi Supabase phía client, và
 * next@16.2.10) VÀ trên Preview thật (Network/Console tab, xác nhận cùng
 * Founder): bấm `next/link` HOẶC gọi `router.push()` đôi khi khiến
 * request RSC hoàn tất (200) nhưng router client không bao giờ áp dụng
 * kết quả — URL/nội dung đứng yên vĩnh viễn, không lỗi nào lộ ra. Không
 * giới hạn ở Sidebar/Header — xảy ra với MỌI điều hướng trong Portal, kể
 * cả các nút gọi `router.push()` trực tiếp (vd `usePracticeAction` ở
 * AiSpaceSections.tsx, dùng bởi "Học AI theo nhu cầu" và nhiều nơi khác).
 *
 * Đọc source Next.js (`app-router-instance.js`, `nav-failure-handler.js`)
 * xác nhận: chính Next.js cũng có sẵn cơ chế "fallback về hard navigation
 * khi điều hướng lỗi" (`useNavFailureHandler`) — nhưng chỉ kích hoạt khi
 * có exception/unhandledrejection thực sự ném ra, và mặc định tắt (cờ
 * `__NEXT_APP_NAV_FAIL_HANDLING`). Trường hợp của chúng ta thất bại
 * ÂM THẦM (action bị đánh dấu `discarded`, không throw gì cả) nên không
 * rơi vào phạm vi cơ chế có sẵn đó — cần tự bổ sung.
 *
 * `next/link` và `router.push()`/`router.replace()` đều gọi chung
 * `dispatchNavigateAction` bên trong Next.js. Next.js tự expose đúng một
 * router instance dùng chung toàn app tại `window.next.router` (gán một
 * lần lúc bootstrap, xem `app-router-instance.js`) — `useRouter()` cũng
 * trả về CHÍNH object này qua Context, nên "vá" 2 hàm `push`/`replace`
 * của `window.next.router` một lần ở đây là đủ cho mọi nơi trong app gọi
 * `useRouter().push(...)`, không cần sửa từng file. Vá qua `window.next`
 * (biến toàn cục thường, không phải giá trị trả về từ hook) để tránh vi
 * phạm quy tắc bất biến của React Compiler khi mutate giá trị từ hook.
 *
 * Component này mount một lần duy nhất trong `PortalShell` (đã render
 * toàn cục cho mọi trang Portal). Sau khi điều hướng được kích hoạt (qua
 * click hoặc router.push/replace), theo dõi URL có đổi trong `TIMEOUT_MS`
 * hay không; nếu không, mới ép điều hướng full-page làm phương án dự
 * phòng — không thay `next/link` bằng `<a>`, không tắt SPA navigation
 * trong trường hợp bình thường.
 */
const TIMEOUT_MS = 2500;

type PatchableRouter = {
  push: (href: string, options?: unknown) => void;
  replace: (href: string, options?: unknown) => void;
  __vdaiFallbackPatched?: boolean;
};

declare global {
  interface Window {
    next?: { router?: PatchableRouter };
  }
}

export function PortalNavigationGuard() {
  const pendingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function clearPending() {
      if (pendingTimeoutRef.current !== null) {
        window.clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
    }

    function armFallback(href: string) {
      let target: URL;
      try {
        target = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (target.origin !== window.location.origin) return;
      if (target.pathname === window.location.pathname && target.search === window.location.search) return;

      clearPending();
      const { pathname: targetPathname, search: targetSearch, href: targetHref } = target;
      pendingTimeoutRef.current = window.setTimeout(() => {
        pendingTimeoutRef.current = null;
        if (window.location.pathname !== targetPathname || window.location.search !== targetSearch) {
          window.location.href = targetHref;
        }
      }, TIMEOUT_MS);
    }

    function handleClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      armFallback(anchor.href);
    }

    // Điều hướng SPA thành công (hoặc back/forward) đổi URL qua pushState/
    // popstate — huỷ timer dự phòng đang chờ vì không còn cần nữa.
    function handleRouteSettled() {
      clearPending();
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handleRouteSettled);

    const r = window.next?.router;
    let unpatch: (() => void) | null = null;
    if (r && !r.__vdaiFallbackPatched) {
      const originalPush = r.push.bind(r);
      const originalReplace = r.replace.bind(r);
      r.push = (href, options) => {
        armFallback(href);
        originalPush(href, options);
      };
      r.replace = (href, options) => {
        armFallback(href);
        originalReplace(href, options);
      };
      r.__vdaiFallbackPatched = true;
      unpatch = () => {
        r.push = originalPush;
        r.replace = originalReplace;
        r.__vdaiFallbackPatched = false;
      };
    }

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handleRouteSettled);
      clearPending();
      unpatch?.();
    };
  }, []);

  return null;
}
