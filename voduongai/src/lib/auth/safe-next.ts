/**
 * Chỉ cho phép redirect nội bộ (same-site relative path) sau đăng nhập/đăng
 * ký/callback OAuth. Dùng chung cho /login, /register, /forgot-password,
 * /auth/callback — tránh open-redirect qua query param "next"
 * (?next=https://evil.com hoặc ?next=//evil.com).
 */
export function sanitizeNextParam(raw: string | null | undefined, fallback = "/portal"): string {
  if (!raw) return fallback;
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}
