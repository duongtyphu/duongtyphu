/**
 * Global Brand Settings — singleton record (BRAND-SPR-001 Task 7).
 *
 * Cấu hình thương hiệu tổng thể — dùng lại đúng `useCollection()` hai tầng
 * (không dựng cơ chế lưu trữ mới), nhưng luôn đúng 1 record duy nhất
 * (id cố định `GLOBAL_BRAND_SETTINGS_ID`). Foundation — không có UI
 * preview trực quan (không Theme Builder).
 *
 * LƯU Ý CHỒNG LẤN: một phần field bên dưới (tagline, defaultOgImageNote)
 * có thể trùng/chồng lấn với System Settings hiện có (/admin/settings —
 * đã quản lý siteName/logoUrl/faviconUrl/seoTitle/seoDescription/social/
 * footerText) và với SEO Registry của Website Workspace (Open Graph
 * per-page). Ghi nhận, KHÔNG tự gộp — xem báo cáo BRAND-SPR-001.
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const GLOBAL_BRAND_SETTINGS_STATUSES = NAVIGATION_STATUSES;
export type GlobalBrandSettingsStatus = NavigationStatus;

export type GlobalBrandSettings = {
  id: string;
  primaryLogoNote: string;
  faviconNote: string;
  primaryColorName: string;
  accentColorName: string;
  tagline: string;
  taglineSecondary: string;
  brandVoiceNote: string;
  defaultOgImageNote: string;
  status: GlobalBrandSettingsStatus;
  updatedDate: string;
};

export const GLOBAL_BRAND_SETTINGS_ID = "global_brand_settings_singleton";
export const GLOBAL_BRAND_SETTINGS_COLLECTION_KEY = "brand-global-settings";

/**
 * Mock Data — tagline/taglineSecondary sao chép đúng từ `siteConfig`
 * (`src/lib/site.ts`), không phải văn bản bịa. `primaryLogoNote`/
 * `faviconNote` tham chiếu Brand Asset Registry (Task 3) thay vì lặp lại
 * toàn bộ thông tin.
 */
export const GLOBAL_BRAND_SETTINGS_SEED: GlobalBrandSettings[] = [
  {
    id: GLOBAL_BRAND_SETTINGS_ID,
    primaryLogoNote: "Xem Brand Asset Registry → category Logo (2 phiên bản, xem ghi chú chồng lấn màu accent).",
    faviconNote: "Đang quản lý qua System Settings (/admin/settings, settings.faviconUrl) — xem Brand Asset Registry → category Icon.",
    primaryColorName: "Brand Blue (#2563EB)",
    accentColorName: "Brand Orange — xem Color Palette (2 giá trị #FF7A00 vs #F97316, chưa thống nhất)",
    tagline: "Học AI • Xây hệ thống • Tạo tài sản số",
    taglineSecondary: "Ứng dụng AI thực chiến cho công việc, kinh doanh và tạo giá trị bền vững.",
    brandVoiceNote: "Chưa có brand voice guideline chính thức nào trong repo — khoảng trống, không phải lỗi Registry.",
    defaultOgImageNote: "Chưa có (xem Brand Asset Registry → category Open Graph Image, khoảng trống thật).",
    status: "Draft",
    updatedDate: "2026-07-12",
  },
];
