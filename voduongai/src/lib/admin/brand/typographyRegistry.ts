/**
 * Typography Foundation — shared data model (BRAND-SPR-001 Task 4).
 *
 * Registry lưu DANH SÁCH token typography (tên/font family/weight/ghi
 * chú sử dụng) — không có công cụ chỉnh font trực tiếp trên trang
 * (không Theme Builder/Asset Editor). Status dùng lại NAVIGATION_STATUSES
 * (xem assetRegistry.ts).
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const TYPOGRAPHY_STATUSES = NAVIGATION_STATUSES;
export type TypographyStatus = NavigationStatus;

export type TypographyToken = {
  id: string;
  name: string;
  fontFamily: string;
  weight: string;
  usageNote: string;
  status: TypographyStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptyTypographyToken(): Omit<TypographyToken, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { name: "", fontFamily: "", weight: "", usageNote: "", status: "Draft", sortOrder: 0, updatedDate: today };
}

export const TYPOGRAPHY_TOKENS_COLLECTION_KEY = "brand-typography-tokens";

/**
 * Mock Data — sao chép đúng font stack THẬT từ `src/app/globals.css`
 * (`--font-sans`/`--font-display`) và font riêng của wordmark logo (theo
 * quy ước root CLAUDE.md — Inter, KHÔNG có trong --font-sans toàn site).
 */
export const TYPOGRAPHY_TOKENS_SEED: TypographyToken[] = [
  {
    id: "typo_seed_body",
    name: "Body / UI Font (toàn site)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    weight: "400 / 600 / 700 (system default, không có font-file riêng)",
    usageNote: "Nguồn: --font-sans trong globals.css, áp dụng qua class font-sans ở layout.tsx (toàn bộ body). --font-display trỏ chung về --font-sans — chưa có font hiển thị (display) riêng cho heading.",
    status: "Active",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "typo_seed_wordmark",
    name: "Logo Wordmark Font",
    fontFamily: "Inter, system-ui, sans-serif",
    weight: "800 (\"VDAI\") / 600 (\"ACADEMY\")",
    usageNote:
      "Chỉ dùng cho chữ trong logo lockup (\"VDAI ACADEMY\"), theo quy ước root CLAUDE.md. Inter KHÔNG nằm trong --font-sans toàn site — đây là ngoại lệ có chủ đích cho riêng wordmark, không phải lỗi.",
    status: "Active",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
];
