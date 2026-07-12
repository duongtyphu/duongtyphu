/**
 * Typography Foundation — shared data model (BRAND-SPR-001 Task 4, mở
 * rộng BRAND-SPR-201 Task 4: thêm field `role` (System/Heading/Body/
 * Caption/Display — đúng 5 mục brief yêu cầu) và seed đủ 5 role.
 *
 * Registry lưu DANH SÁCH token typography (tên/font family/weight/ghi
 * chú sử dụng) — không có công cụ chỉnh font trực tiếp trên trang
 * (không Theme Builder/Asset Editor). Status dùng lại NAVIGATION_STATUSES
 * (xem assetRegistry.ts).
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const TYPOGRAPHY_STATUSES = NAVIGATION_STATUSES;
export type TypographyStatus = NavigationStatus;

export const TYPOGRAPHY_ROLES = ["System", "Heading", "Body", "Caption", "Display"] as const;
export type TypographyRole = (typeof TYPOGRAPHY_ROLES)[number];

export type TypographyToken = {
  id: string;
  name: string;
  role: TypographyRole;
  fontFamily: string;
  weight: string;
  usageNote: string;
  status: TypographyStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptyTypographyToken(): Omit<TypographyToken, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { name: "", role: "Body", fontFamily: "", weight: "", usageNote: "", status: "Draft", sortOrder: 0, updatedDate: today };
}

export const TYPOGRAPHY_TOKENS_COLLECTION_KEY = "brand-typography-tokens";

/**
 * Mock Data — sao chép đúng font stack THẬT từ `src/app/globals.css`
 * (`--font-sans`/`--font-display`) và font riêng của wordmark logo (theo
 * quy ước root CLAUDE.md — Inter, KHÔNG có trong --font-sans toàn site).
 * Heading/Caption/Display (BRAND-SPR-201, Task 4) đều tham chiếu CÙNG
 * `--font-sans` — ghi nhận ĐÚNG hiện trạng: `--font-display` trỏ thẳng về
 * `--font-sans` trong globals.css, chưa có font riêng cho từng role, KHÔNG
 * tự bịa font khác nhau cho mỗi role.
 */
export const TYPOGRAPHY_TOKENS_SEED: TypographyToken[] = [
  {
    id: "typo_seed_system",
    name: "Font hệ thống (System)",
    role: "System",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    weight: "400 / 600 / 700 (system default, không có font-file riêng)",
    usageNote: "Nguồn: --font-sans trong globals.css — font gốc mà mọi role Body/Heading/Caption/Display bên dưới đều kế thừa.",
    status: "Active",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "typo_seed_body",
    name: "Body Text",
    role: "Body",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    weight: "400",
    usageNote: "Áp dụng qua class font-sans ở layout.tsx (toàn bộ body). Cùng font-family với System — chỉ khác cỡ chữ/weight qua Tailwind class, không phải font riêng.",
    status: "Active",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
  {
    id: "typo_seed_heading",
    name: "Heading",
    role: "Heading",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    weight: "700 / 800",
    usageNote: "⚠️ --font-display trong globals.css trỏ THẲNG về --font-sans — chưa có font hiển thị (display) riêng cho heading, chỉ khác weight/size qua class Tailwind (text-xl font-extrabold...).",
    status: "Active",
    sortOrder: 3,
    updatedDate: "2026-07-12",
  },
  {
    id: "typo_seed_caption",
    name: "Caption",
    role: "Caption",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    weight: "400 / 500",
    usageNote: "Cùng font-family với Body — cỡ chữ nhỏ hơn (text-xs/text-[11px]) qua Tailwind, không phải font riêng.",
    status: "Active",
    sortOrder: 4,
    updatedDate: "2026-07-12",
  },
  {
    id: "typo_seed_display",
    name: "Display",
    role: "Display",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    weight: "800",
    usageNote: "Khoảng trống thật (BRAND-SPR-201, Task 4): brief yêu cầu quản lý font \"Display\" riêng nhưng code hiện KHÔNG có font display khác biệt — --font-display = --font-sans. Cần Founder xác nhận có muốn đầu tư font Display riêng hay giữ hiện trạng.",
    status: "Draft",
    sortOrder: 5,
    updatedDate: "2026-07-12",
  },
  {
    id: "typo_seed_wordmark",
    name: "Logo Wordmark Font",
    role: "System",
    fontFamily: "Inter, system-ui, sans-serif",
    weight: "800 (\"VDAI\") / 600 (\"ACADEMY\")",
    usageNote:
      "Chỉ dùng cho chữ trong logo lockup (\"VDAI ACADEMY\"), theo quy ước root CLAUDE.md. Inter KHÔNG nằm trong --font-sans toàn site — đây là ngoại lệ có chủ đích cho riêng wordmark, không phải lỗi.",
    status: "Active",
    sortOrder: 6,
    updatedDate: "2026-07-12",
  },
];
