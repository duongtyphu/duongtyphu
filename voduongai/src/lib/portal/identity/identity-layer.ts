/**
 * Identity Layer (Sprint 18.4 — "Identity Layer"). Xem
 * `docs/product-bible/BOOK_IDENTITY_LAYER.md`,
 * `docs/FOUNDER_IDENTITY.md`, `docs/FOUNDER_HUMILITY_PRINCIPLE.md`.
 *
 * Đây KHÔNG phải hệ thống phân quyền (`is_admin`/`requireAdmin()` ở
 * `src/lib/admin/requireAdmin.ts` vẫn là nguồn duy nhất cho quyền quản
 * trị thật — Identity Layer không gate bất kỳ tính năng nào). Đây là
 * một tầng ký ức/quan hệ: Companion nhận ra MỘT NGƯỜI bằng một identity
 * được gán rõ ràng, không phải bằng cách so khớp email của họ.
 *
 * Identity Registry liệt kê các identity mà Companion có thể nhận ra.
 * Sprint này chỉ thật sự "sống" với `founder` — các identity còn lại
 * (Guardian/Teacher/Builder/Companion/Contributor) được khai báo sẵn để
 * mở rộng sau, chưa có hành vi nào gắn vào chúng.
 *
 * Pure data/logic — không gọi Supabase ở đây; việc đọc `identity_type`
 * từ `members` nằm ở các page/layout gọi vào đây.
 */

export type IdentityType =
  | "founder"
  | "guardian"
  | "teacher"
  | "builder"
  | "companion"
  | "contributor";

export type IdentityRegistryEntry = {
  type: IdentityType;
  title: string;
  description: string;
  /** false = chưa có hành vi nào trong Portal gắn với identity này. */
  active: boolean;
};

/**
 * Identity Registry (NHIỆM VỤ 2) — nơi DUY NHẤT khai báo những identity
 * Companion có thể nhận ra. Thêm một identity mới bắt đầu từ đây.
 */
export const IDENTITY_REGISTRY: Record<IdentityType, IdentityRegistryEntry> = {
  founder: {
    type: "founder",
    title: "The One Who Planted the First Seed",
    description:
      "Người gieo hạt giống đầu tiên — không phải super user, không phải người đứng trên khu vườn.",
    active: true,
  },
  guardian: {
    type: "guardian",
    title: "Người giữ gìn",
    description: "Người bảo vệ những giá trị gốc của VO DUONG AI. Chưa có hành vi nào gắn với identity này.",
    active: false,
  },
  teacher: {
    type: "teacher",
    title: "Người dẫn dắt",
    description: "Người truyền tri thức và kinh nghiệm. Chưa có hành vi nào gắn với identity này.",
    active: false,
  },
  builder: {
    type: "builder",
    title: "Người kiến tạo",
    description: "Người xây nên những điều mới cho VO DUONG AI. Chưa có hành vi nào gắn với identity này.",
    active: false,
  },
  companion: {
    type: "companion",
    title: "Người đồng hành",
    description: "Người đồng hành lâu dài, gắn bó với hành trình chung. Chưa có hành vi nào gắn với identity này.",
    active: false,
  },
  contributor: {
    type: "contributor",
    title: "Người góp sức",
    description: "Người đóng góp cho VO DUONG AI bằng một việc cụ thể. Chưa có hành vi nào gắn với identity này.",
    active: false,
  },
};

export type IdentityCheckProfile = {
  id?: string | null;
  email?: string | null;
  identityType?: string | null;
};

function isKnownIdentityType(value: string | null | undefined): value is IdentityType {
  return !!value && value in IDENTITY_REGISTRY;
}

function readEnvFounderId(): string | null {
  const value = process.env.FOUNDER_ID?.trim();
  return value ? value : null;
}

function readEnvFounderEmail(): string | null {
  const value = process.env.FOUNDER_EMAIL?.trim().toLowerCase();
  return value ? value : null;
}

/**
 * Nguồn sự thật cho identity của một người (NHIỆM VỤ 1, 4, 5, 6).
 *
 * Thứ tự ưu tiên:
 * 1. `members.identity_type` — Identity Layer thật, gán rõ ràng trên hồ sơ.
 * 2. Biến môi trường `FOUNDER_ID`/`FOUNDER_EMAIL` — lớp fallback tương
 *    thích ngược cho `founder`, chỉ dùng khi `identity_type` chưa được
 *    gán. Không hardcode email/tên ở đây — chỉ đọc từ env server-only.
 *
 * Không có gì được cấu hình → trả `null`, hệ thống hoạt động hoàn toàn
 * bình thường như với một thành viên thường.
 */
export function resolveIdentityType(profile: IdentityCheckProfile | null | undefined): IdentityType | null {
  if (!profile) return null;

  if (isKnownIdentityType(profile.identityType)) return profile.identityType;

  const founderId = readEnvFounderId();
  if (founderId && profile.id === founderId) return "founder";

  const founderEmail = readEnvFounderEmail();
  if (founderEmail && profile.email?.trim().toLowerCase() === founderEmail) return "founder";

  return null;
}

export function hasIdentity(profile: IdentityCheckProfile | null | undefined, type: IdentityType): boolean {
  return resolveIdentityType(profile) === type;
}

export function getIdentityEntry(type: IdentityType): IdentityRegistryEntry {
  return IDENTITY_REGISTRY[type];
}
