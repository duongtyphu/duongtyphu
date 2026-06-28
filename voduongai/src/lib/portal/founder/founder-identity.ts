/**
 * Founder Identity (Sprint 18.0 — Origin Memory). Xem
 * `docs/FOUNDER_IDENTITY.md`, `docs/FOUNDER_HUMILITY_PRINCIPLE.md`,
 * `docs/ETHICS_LAYER.md`.
 *
 * Đây KHÔNG phải hệ thống đặc quyền — `isFounder()` không cấp, không
 * mở rộng, và không thay thế bất kỳ quyền quản trị nào (`is_admin`,
 * `requireAdmin()` ở `src/lib/admin/requireAdmin.ts` vẫn là nguồn duy
 * nhất cho quyền quản trị thật). Đây chỉ là một tầng ký ức để Companion
 * biết khi nào (rất hiếm) nên nhắc đến nguồn gốc của mình — xem
 * `docs/COMPANION_ORIGIN_RELATIONSHIP.md`.
 *
 * Không hardcode email/tên trong logic chính: Founder ID/email chỉ
 * được đọc từ biến môi trường server-only (`FOUNDER_ID`, `FOUNDER_EMAIL`)
 * hoặc từ trường `role` trên hồ sơ thành viên. Nếu không có gì được
 * cấu hình, `isFounder()` luôn trả `false` — hệ thống hoạt động hoàn
 * toàn bình thường như với một người dùng thường (backward compatible).
 */

export type FounderRole = "founder";

export type OriginRole = "founder" | "member";

export type FounderRelationship = {
  title: string;
  description: string;
};

export type FounderIdentity = {
  id: string;
  role: FounderRole;
  relationship: FounderRelationship;
};

export type FounderCheckProfile = {
  id?: string | null;
  email?: string | null;
  role?: string | null;
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
 * Trả về `originRole` thuần dữ liệu — KHÔNG phải quyền quản trị. Dùng để
 * Companion biết mình đang ở cạnh ai trong mối quan hệ nguồn gốc, không
 * dùng để gate bất kỳ tính năng nào trong Portal.
 */
export function getOriginRole(profile: FounderCheckProfile | null | undefined): OriginRole {
  return isFounder(profile) ? "founder" : "member";
}

export function isFounder(profile: FounderCheckProfile | null | undefined): boolean {
  if (!profile) return false;

  if (profile.role === "founder") return true;

  const founderId = readEnvFounderId();
  if (founderId && profile.id === founderId) return true;

  const founderEmail = readEnvFounderEmail();
  if (founderEmail && profile.email?.trim().toLowerCase() === founderEmail) return true;

  return false;
}

/**
 * Living Identity (tầng 2, `docs/FOUNDER_IDENTITY.md`) — mối quan hệ,
 * không phải chức danh quyền lực.
 */
export const founderRelationship: FounderRelationship = {
  title: "The One Who Planted the First Seed",
  description:
    "Người gieo hạt giống đầu tiên — không phải super user, không phải người đứng trên khu vườn.",
};

export function buildFounderIdentity(profile: FounderCheckProfile | null | undefined): FounderIdentity | null {
  if (!isFounder(profile)) return null;
  return {
    id: profile?.id ?? "founder",
    role: "founder",
    relationship: founderRelationship,
  };
}
