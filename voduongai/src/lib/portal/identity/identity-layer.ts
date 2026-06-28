/**
 * Founder Identity Foundation (Sprint 18.4). Xem
 * `docs/product-bible/FOUNDER_IDENTITY_FOUNDATION.md`,
 * `docs/FUTURE_LIVING_IDENTITY.md`.
 *
 * Đây CHỈ là nền móng — giải quyết việc Companion phụ thuộc vào email
 * để nhận ra Founder. Đây KHÔNG phải Identity Registry, KHÔNG phải
 * Living Identity. VO DUONG AI chọn Evolution Architecture: chỉ code
 * điều sản phẩm đã thật sự cần — Identity Registry, Living Identity và
 * các identity khác (Guardian/Teacher/Builder/...) là roadmap, không
 * phải code của Sprint này (xem `docs/FUTURE_LIVING_IDENTITY.md`).
 *
 * Đây KHÔNG phải hệ thống phân quyền (`is_admin`/`requireAdmin()` ở
 * `src/lib/admin/requireAdmin.ts` vẫn là nguồn duy nhất cho quyền quản
 * trị thật).
 *
 * Pure data/logic — không gọi Supabase ở đây; việc đọc `identity_type`
 * từ `members` nằm ở page/layout gọi vào đây.
 */

export type IdentityCheckProfile = {
  id?: string | null;
  email?: string | null;
  identityType?: string | null;
};

function readEnvFounderId(): string | null {
  const value = process.env.FOUNDER_ID?.trim();
  return value ? value : null;
}

function readEnvFounderEmail(): string | null {
  const value = process.env.FOUNDER_EMAIL?.trim().toLowerCase();
  return value ? value : null;
}

/**
 * Companion không nhận ra Founder bằng email/tên — chỉ bằng identity.
 *
 * Thứ tự ưu tiên:
 * 1. `members.identity_type === "founder"` — nguồn sự thật chính.
 * 2. Biến môi trường `FOUNDER_ID`/`FOUNDER_EMAIL` — lớp fallback tương
 *    thích ngược, chỉ dùng khi `identity_type` chưa được gán (project
 *    chưa chạy migration, hoặc chưa ai gán cột này).
 *
 * Không có gì được cấu hình → trả `false`, hệ thống hoạt động hoàn
 * toàn bình thường như với một thành viên thường.
 */
export function isFounderIdentity(profile: IdentityCheckProfile | null | undefined): boolean {
  if (!profile) return false;

  if (profile.identityType === "founder") return true;

  const founderId = readEnvFounderId();
  if (founderId && profile.id === founderId) return true;

  const founderEmail = readEnvFounderEmail();
  if (founderEmail && profile.email?.trim().toLowerCase() === founderEmail) return true;

  return false;
}
