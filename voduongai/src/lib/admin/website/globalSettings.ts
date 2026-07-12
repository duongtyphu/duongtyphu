/**
 * Global Website Settings — singleton record (WEB-SPR-201 Task 10, mở
 * rộng WEB-SPR-202 Task 7: thêm `websiteName`/`tagline` — đúng 5 mục brief
 * yêu cầu Website Name/Tagline/Default Homepage/Announcement/Maintenance
 * (Maintenance = `visibilityMode: "Maintenance Mode"` đã có sẵn).
 *
 * Cấu hình tổng thể của Website Workspace — dùng lại đúng `useCollection()`
 * hai tầng (không dựng cơ chế lưu trữ mới), luôn đúng 1 record duy nhất
 * (id cố định `GLOBAL_WEBSITE_SETTINGS_ID`), cùng pattern
 * `globalBrandSettings.ts` (Brand Studio, BRAND-SPR-001). Foundation —
 * không Visual Builder, không Runtime (đổi Visibility ở đây KHÔNG thực sự
 * bật/tắt site thật — chỉ là metadata ý định, giống Visibility Rule
 * Foundation đã dùng ở Navigation/Shared Section Registry).
 *
 * LƯU Ý CHỒNG LẤN: `announcementActive`/`announcementText` có thể trùng
 * với Shared Sections category "Announcement" (WEB-SPR-004) và với
 * `portal_banners`/NotificationTicker (đã nối dây thật) — ghi nhận,
 * KHÔNG tự gộp. `presentationThemeNote` tham chiếu Theme Registry của
 * Brand Studio (BRAND-SPR-001) — không sao chép lại dữ liệu, chỉ ghi chú
 * tham chiếu bằng text.
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const GLOBAL_WEBSITE_SETTINGS_STATUSES = NAVIGATION_STATUSES;
export type GlobalWebsiteSettingsStatus = NavigationStatus;

export const SITE_VISIBILITY_MODES = ["Public", "Maintenance Mode", "Coming Soon"] as const;
export type SiteVisibilityMode = (typeof SITE_VISIBILITY_MODES)[number];

export type GlobalWebsiteSettings = {
  id: string;
  websiteName: string;
  tagline: string;
  announcementText: string;
  announcementActive: boolean;
  defaultHomepageNote: string;
  visibilityMode: SiteVisibilityMode;
  presentationThemeNote: string;
  status: GlobalWebsiteSettingsStatus;
  updatedDate: string;
};

export const GLOBAL_WEBSITE_SETTINGS_ID = "global_website_settings_singleton";
export const GLOBAL_WEBSITE_SETTINGS_COLLECTION_KEY = "website-global-settings";

/**
 * Mock Data — `defaultHomepageNote`/`presentationThemeNote` tham chiếu
 * đúng Registry thật đã tồn tại (Page Registry, Brand Studio Theme
 * Registry), không phải văn bản bịa.
 */
export const GLOBAL_WEBSITE_SETTINGS_SEED: GlobalWebsiteSettings[] = [
  {
    id: GLOBAL_WEBSITE_SETTINGS_ID,
    websiteName: "VO DUONG AI",
    tagline: "Học AI • Xây hệ thống • Tạo tài sản số",
    announcementText: "",
    announcementActive: false,
    defaultHomepageNote:
      "\"Trang chủ\" (slug \"/\", pageType Homepage) trong Page Registry (/admin/website/pages) — page_seed_home, nối vào WEBSITE_PAGES_SEED từ WEB-SPR-202.",
    visibilityMode: "Public",
    presentationThemeNote:
      "Tham chiếu Theme Registry của Brand Studio (/admin/brand/theme) — hiện có \"Portal / Admin (Dark, hardcode)\" là theme thật đang chạy.",
    status: "Draft",
    updatedDate: "2026-07-12",
  },
];
