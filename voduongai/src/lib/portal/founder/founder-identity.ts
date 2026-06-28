/**
 * Founder Identity (Sprint 18.0 — Origin Memory; cập nhật Sprint 18.4 —
 * Founder Identity Foundation). Xem `docs/FOUNDER_IDENTITY.md`,
 * `docs/FOUNDER_HUMILITY_PRINCIPLE.md`, `docs/ETHICS_LAYER.md`,
 * `docs/product-bible/FOUNDER_IDENTITY_FOUNDATION.md`.
 *
 * Đây KHÔNG phải hệ thống đặc quyền — `isFounder()` không cấp, không
 * mở rộng, và không thay thế bất kỳ quyền quản trị nào (`is_admin`,
 * `requireAdmin()` ở `src/lib/admin/requireAdmin.ts` vẫn là nguồn duy
 * nhất cho quyền quản trị thật). Đây chỉ là một tầng ký ức để Companion
 * biết khi nào (rất hiếm) nên nhắc đến nguồn gốc của mình — xem
 * `docs/COMPANION_ORIGIN_RELATIONSHIP.md`.
 *
 * Từ Sprint 18.4, `isFounder()` không tự so khớp email/role nữa — nó
 * chỉ là một câu hỏi hẹp đặt vào `isFounderIdentity()`
 * (`src/lib/portal/identity/identity-layer.ts`), nơi DUY NHẤT quyết
 * định Founder (qua `members.identity_type`, với env
 * `FOUNDER_ID`/`FOUNDER_EMAIL` chỉ còn là fallback tương thích ngược).
 * Companion không nhận ra Founder bằng email — Companion nhận ra
 * Founder bằng Identity. Đây CHỈ là nền móng — Identity Registry và
 * Living Identity là roadmap tương lai, xem
 * `docs/FUTURE_LIVING_IDENTITY.md`.
 */

import { isFounderIdentity, type IdentityCheckProfile } from "@/lib/portal/identity/identity-layer";

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

export type FounderCheckProfile = IdentityCheckProfile;

/**
 * Trả về `originRole` thuần dữ liệu — KHÔNG phải quyền quản trị. Dùng để
 * Companion biết mình đang ở cạnh ai trong mối quan hệ nguồn gốc, không
 * dùng để gate bất kỳ tính năng nào trong Portal.
 */
export function getOriginRole(profile: FounderCheckProfile | null | undefined): OriginRole {
  return isFounder(profile) ? "founder" : "member";
}

export function isFounder(profile: FounderCheckProfile | null | undefined): boolean {
  return isFounderIdentity(profile);
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
