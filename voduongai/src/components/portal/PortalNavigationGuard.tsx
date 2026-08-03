"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * FIX-P0 — Portal Navigation Stability Fallback.
 *
 * Bug gốc (Next.js 16 App Router, framework-level): thỉnh thoảng click
 * <Link>/gọi router.push()/replace() hoàn tất request RSC (200) nhưng
 * router client âm thầm "bỏ" hành động điều hướng — URL/nội dung không
 * đổi, không throw lỗi (cơ chế `useNavFailureHandler` có sẵn của Next.js
 * chỉ bắt trường hợp throw, không bắt kiểu lỗi im lặng này).
 *
 * Thiết kế MỚI (không sao chép implementation cũ của branch
 * `claude/vietnamese-greeting-zkzn2p`):
 *
 * 1) Cơ chế CHÍNH — không phụ thuộc bất kỳ API nội bộ nào của Next.js:
 *    1 listener `click` cấp document (capture phase) bắt các cú click
 *    same-origin thật vào `<a href>`, dùng đúng DOM/URL API chuẩn. Sau
 *    FALLBACK_WINDOW_MS, nếu `usePathname()` (hook công khai) chưa đổi —
 *    coi là điều hướng bị "nuốt", ép chuyển trang cứng qua
 *    `window.location.href`. Cơ chế này tự đủ để bảo vệ toàn bộ điều
 *    hướng qua Link trong Header/Sidebar — đúng nơi phát sinh bug gốc.
 *
 * 2) Lớp bổ sung TÙY CHỌN cho điều hướng bằng code (`router.push()`/
 *    `replace()` gọi trực tiếp, ví dụ `usePracticeAction()` trong
 *    `AiSpaceSections.tsx`) — Next.js expose 1 router instance dùng
 *    chung tại `window.next.router` (cùng object `useRouter()` trả về
 *    qua Context, xem `node_modules/next/dist/client/components/
 *    app-router-instance.js`). Đây LÀ API nội bộ không tài liệu hoá —
 *    chỉ patch khi feature-detect đúng shape (`push`/`replace` là hàm),
 *    bọc try/catch toàn bộ, khôi phục nguyên bản khi unmount. Nếu API
 *    này biến mất/đổi shape ở bản Next.js sau này, lớp này tự no-op —
 *    guard vẫn hoạt động đầy đủ qua cơ chế (1), không phụ thuộc lẫn nhau.
 *
 * FIX sau khi Founder báo "trang portal/companion hơi giật, tự động load
 * lại trang" trên Preview: nguyên nhân là NGƯỠNG CŨ 2500ms quá chặt so
 * với điều kiện thật (cold start serverless của Vercel Preview + việc
 * tắt `prefetch` ở Header/Sidebar khiến MỌI lần click đều là 1 lượt fetch
 * lạnh, không còn cache prefetch) — điều hướng vẫn thành công nhưng đôi
 * khi chậm hơn 2500ms, khiến guard hiểu nhầm là "bị nuốt" và ép hard
 * reload dù không có gì hỏng. Đã: (1) tăng ngưỡng lên 4500ms — đủ rộng
 * cho cold start thật, vẫn đủ ngắn để bắt được trường hợp thật sự kẹt;
 * (2) huỷ fallback đang chờ ngay khi tab chuyển sang nền (`visibilitychange`
 * → `hidden`) — trình duyệt có thể đóng băng/dồn `setTimeout` của tab nền
 * rồi bắn dồn khi quay lại, gây cảm giác "tự nhiên bị load lại trang"
 * ngay lúc người dùng quay lại tab dù điều hướng đã xong từ lâu.
 */

const FALLBACK_WINDOW_MS = 4500;

function isSameOriginNavigation(url: URL): boolean {
  if (url.origin !== window.location.origin) return false;
  // Chỉ đổi hash/không đổi path+query — không phải điều hướng trang mới.
  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return false;
  }
  return true;
}

export function PortalNavigationGuard() {
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearPendingFallback() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function armFallback(target: URL) {
    clearPendingFallback();
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      window.location.href = target.href;
    }, FALLBACK_WINDOW_MS);
  }

  // Bất kỳ điều hướng nào thành công (pathname đổi, kể cả sang đích khác
  // click/push gốc — người dùng có thể đã bấm chỗ khác trong lúc chờ) đều
  // coi là "router vẫn sống" — huỷ mọi fallback đang chờ ngay.
  useEffect(() => {
    clearPendingFallback();
  }, [pathname]);

  // Tab chuyển sang nền — huỷ fallback đang chờ, không đoán được điều
  // hướng có thành công hay không trong lúc tab bị đóng băng (trình duyệt
  // có thể dồn `setTimeout` rồi bắn khi quay lại, gây hard-reload giả).
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        clearPendingFallback();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (!isSameOriginNavigation(url)) return;

      armFallback(url);
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearPendingFallback();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `window.next.router` là API NỘI BỘ không tài liệu hoá của Next.js
  // (không phải public API) — layer này chỉ là fallback TÙY CHỌN, không
  // bắt buộc để guard hoạt động (cơ chế click-listener ở effect trên vẫn
  // chạy độc lập). BẮT BUỘC re-verify layer này (còn tồn tại đúng shape
  // `push`/`replace` hay không) mỗi khi nâng cấp phiên bản Next.js.
  useEffect(() => {
    const nextGlobal = (window as unknown as { next?: { router?: Record<string, unknown> } }).next;
    const nextRouter = nextGlobal?.router;
    if (
      !nextRouter ||
      typeof nextRouter.push !== "function" ||
      typeof nextRouter.replace !== "function"
    ) {
      return;
    }

    const originalPush = nextRouter.push as (...args: unknown[]) => unknown;
    const originalReplace = nextRouter.replace as (...args: unknown[]) => unknown;

    function guardedNavigate(original: (...args: unknown[]) => unknown, args: unknown[]) {
      const href = args[0];
      if (typeof href === "string") {
        try {
          const url = new URL(href, window.location.href);
          if (isSameOriginNavigation(url)) armFallback(url);
        } catch {
          // href không parse được — không chặn điều hướng thật, chỉ bỏ qua fallback.
        }
      }
      return original(...args);
    }

    try {
      nextRouter.push = (...args: unknown[]) => guardedNavigate(originalPush, args);
      nextRouter.replace = (...args: unknown[]) => guardedNavigate(originalReplace, args);
    } catch {
      // window.next.router không ghi được (đổi ở bản Next.js khác) — bỏ
      // qua im lặng, cơ chế click-listener ở trên vẫn đủ bảo vệ phần lớn
      // điều hướng thật của Portal.
      return;
    }

    return () => {
      try {
        nextRouter.push = originalPush;
        nextRouter.replace = originalReplace;
      } catch {
        // no-op — khôi phục thất bại không nên làm crash unmount
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
