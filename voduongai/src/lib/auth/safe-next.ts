/**
 * Chỉ cho phép redirect nội bộ (same-site relative path) sau đăng nhập/đăng
 * ký/callback OAuth. Dùng chung cho /login, /register, /forgot-password,
 * /auth/callback — tránh open-redirect qua query param "next"
 * (?next=https://evil.com hoặc ?next=//evil.com).
 *
 * Fallback mặc định trỏ Portal 2.0 (`/v2/trang-chu`) — đây là CỔNG CHÍNH đi
 * vào Portal từ Landing Page (Founder chỉ đạo), thay cho `/portal` (1.0) cũ.
 * Mọi CTA "Đăng nhập"/"Đăng ký" trên Landing Page (Hero/PortalPreview/
 * EcosystemPillars/FinalCTA) đều trỏ `/login` KHÔNG kèm `?next=`, nên đều ăn
 * theo đúng fallback này — đổi 1 chỗ duy nhất áp dụng cho toàn bộ luồng
 * đăng nhập/đăng ký/magic-link/Google OAuth (xem `/auth/callback/route.ts`).
 */
export function sanitizeNextParam(raw: string | null | undefined, fallback = "/v2/trang-chu"): string {
  if (!raw) return fallback;
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}
