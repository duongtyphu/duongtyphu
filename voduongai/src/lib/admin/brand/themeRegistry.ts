/**
 * Theme Foundation — shared data model (BRAND-SPR-001 Task 6).
 *
 * KHÔNG Theme Builder — không có cơ chế switch theme thật, không sinh CSS.
 * Registry chỉ GHI NHẬN các "theme" (tổ hợp màu nền/chữ) đang thực sự tồn
 * tại trong code hiện nay, mỗi entry là một `ThemeProfile` tham chiếu tới
 * Color Palette bằng tên (text, không phải khóa ngoại — Foundation, không
 * ràng buộc dữ liệu).
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const THEME_STATUSES = NAVIGATION_STATUSES;
export type ThemeStatus = NavigationStatus;

export type ThemeProfile = {
  id: string;
  name: string;
  backgroundNote: string;
  textNote: string;
  accentNote: string;
  usageNote: string;
  status: ThemeStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptyThemeProfile(): Omit<ThemeProfile, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { name: "", backgroundNote: "", textNote: "", accentNote: "", usageNote: "", status: "Draft", sortOrder: 0, updatedDate: today };
}

export const THEME_PROFILES_COLLECTION_KEY = "brand-theme-profiles";

/**
 * Mock Data — phát hiện thật khi audit `globals.css`: `:root` định nghĩa
 * `--background: #F8FAFC` / `--foreground: #111827` (theme SÁNG), nhưng
 * Portal/Admin lại dùng nền tối hardcode trực tiếp trong component (VD
 * `bg-[#0B1F4D]` ở Modal.tsx) — KHÔNG qua 2 token đó. Nghĩa là có 2
 * "theme" tồn tại song song, chưa hợp nhất, không phải 1 theme chính thức
 * + biến thể. Ghi nhận đúng hiện trạng, không tự "sửa" thành 1 theme.
 */
export const THEME_PROFILES_SEED: ThemeProfile[] = [
  {
    id: "theme_seed_light_root",
    name: "Root Tokens (--background/--foreground) — theo :root",
    backgroundNote: "#F8FAFC (--background)",
    textNote: "#111827 (--foreground)",
    accentNote: "--color-brand-blue (#2563EB)",
    usageNote:
      "Định nghĩa trong :root của globals.css nhưng hầu hết trang Portal/Admin KHÔNG dùng token này trực tiếp (dùng class hardcode text-white trên nền tối thay vì var(--foreground)). Chưa xác định rõ nơi nào thực sự áp dụng theme sáng này.",
    status: "Draft",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "theme_seed_dark_portal",
    name: "Portal / Admin (Dark, hardcode trực tiếp)",
    backgroundNote: "#0B1F4D (Brand Blue Dark) — hardcode class bg-[#0B1F4D], VD Modal.tsx, không qua token nào",
    textNote: "#FFFFFF (class text-white, hardcode trực tiếp, không qua --foreground)",
    accentNote: "--color-brand-blue (#2563EB), --color-brand-orange (#FF7A00)",
    usageNote:
      "⚠️ Đây là theme THẬT đang hiển thị trên toàn bộ Portal/Admin, nhưng KHÔNG đi qua bất kỳ token/biến theme nào — mọi component tự hardcode bg-[#0B1F4D]/text-white. Chưa có cơ chế Theme Builder/switcher — muốn đổi theme phải sửa code từng component. Đây là khoảng trống Theme thật cần Founder/PMO quyết định có đáng đầu tư chuẩn hoá thành token không.",
    status: "Active",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
];
