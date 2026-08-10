/**
 * Single source of truth for which top-level route prefixes require
 * authentication. `middleware.ts` uses `isProtectedRoute()` for the actual
 * runtime decision. `middleware.ts`'s `config.matcher` still needs its own
 * static, literal string patterns (Next.js requires matcher values to be
 * statically analyzable at build time — it cannot be derived from an
 * imported array), so it must be kept in sync with this list by hand;
 * this file exists so that sync point has a name and a comment instead of
 * being an unlabeled string buried inside a boolean expression.
 *
 * PORTAL_ROUTE_MIGRATION_PLAN.md Phase 1: when/if the `/portal/` prefix is
 * ever removed, this is the one array that needs a second entry (the new
 * prefix) while both old and new routes are served in parallel.
 */
export const PROTECTED_ROUTE_PREFIXES = ["/portal", "/onboarding", "/v2"] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Khu vực quản trị. Có HAI tiền tố vì Admin 1.0 (`/admin`) và Admin 2.0
 * (`/v2/admin`) đang chạy song song — cả hai đều yêu cầu `members.is_admin`
 * và dùng chung một trang đăng nhập `/admin/login`.
 *
 * Chặn ở middleware là lớp phòng hộ CHÍNH: `redirect()` trong layout Server
 * Component chỉ tạo redirect "mềm" (meta-refresh + payload RSC) sau khi phần
 * đầu trang đã bắt đầu stream — không đủ để chặn nội dung tới trình duyệt
 * chưa đăng nhập. Layout vẫn giữ `redirect()` làm lớp thứ hai.
 */
const ADMIN_ROUTE_PREFIXES = ["/admin", "/v2/admin"] as const;

export const ADMIN_LOGIN_PATH = "/admin/login";

export function isAdminRoute(pathname: string): boolean {
  if (pathname === ADMIN_LOGIN_PATH) return false;
  return ADMIN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
