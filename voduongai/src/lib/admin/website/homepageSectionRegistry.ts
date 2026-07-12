/**
 * Homepage Section Order Registry — shared data model (WEB-SPR-202, Task 3
 * "Homepage Management": Section → Block → Content → CTA → Visibility).
 *
 * Khác Shared Section Registry (WEB-SPR-004, `sharedSectionRegistry.ts`) —
 * nơi lưu 9 CATEGORY nội dung dùng chung xuyên site (Hero/CTA/FAQ...) — file
 * này lưu ĐÚNG THỨ TỰ RENDER THẬT của trang chủ: 11 section, đúng tên
 * component và thứ tự import trong `src/app/page.tsx`. Đây là câu trả lời
 * trực tiếp cho Task 3: Founder cần thấy TOÀN BỘ cấu trúc Section của
 * Homepage — không chỉ vài category minh hoạ.
 *
 * `sharedSectionId` (tuỳ chọn) trỏ về entry tương ứng trong
 * `sharedSectionRegistry.ts` khi 2 nơi cùng mô tả 1 khối THẬT (Hero,
 * Founder Story, Final CTA) — không sao chép lại nội dung, chỉ tham chiếu.
 * 8 section còn lại (PortalPreview/FreeResources/ToolsIUse/Problem/
 * Solution/AcademyTeaser/TrustStats/Ecosystem) CHƯA có Shared Section
 * tương ứng — `sharedSectionId` để trống, không phải lỗi.
 *
 * Foundation: KHÔNG Visual Builder/Block Editor — chỉ quản lý THỨ TỰ và
 * ẨN/HIỆN của section, không chỉnh nội dung/bố cục bên trong từng
 * component (vẫn hardcode ở `src/components/home/*.tsx`).
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const HOMEPAGE_SECTION_STATUSES = NAVIGATION_STATUSES;
export type HomepageSectionStatus = NavigationStatus;

export type HomepageSection = {
  id: string;
  componentName: string;
  label: string;
  hasCta: boolean;
  sharedSectionId: string;
  visible: boolean;
  sortOrder: number;
  status: HomepageSectionStatus;
  updatedDate: string;
};

export function emptyHomepageSection(): Omit<HomepageSection, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    componentName: "",
    label: "",
    hasCta: false,
    sharedSectionId: "",
    visible: true,
    sortOrder: 0,
    status: "Active",
    updatedDate: today,
  };
}

export const HOMEPAGE_SECTIONS_COLLECTION_KEY = "website-homepage-sections";

/**
 * Mock Data — đúng 11 section thật, đúng thứ tự import/render trong
 * `src/app/page.tsx` (audit trực tiếp, WEB-SPR-202). `hasCta` đánh dấu
 * đúng section có nút CTA thật trong code (Hero/AcademyTeaser/FinalCTA —
 * các section khác là thông tin/minh hoạ, không có CTA riêng theo audit).
 */
export const HOMEPAGE_SECTIONS_SEED: HomepageSection[] = [
  { id: "homesec_seed_hero", componentName: "Hero", label: "Hero — Mở đầu trang chủ", hasCta: true, sharedSectionId: "section_seed_hero", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_portal_preview", componentName: "PortalPreview", label: "Portal Preview — Xem trước Portal", hasCta: false, sharedSectionId: "", visible: true, sortOrder: 2, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_free_resources", componentName: "FreeResources", label: "Free Resources — Tài nguyên miễn phí", hasCta: false, sharedSectionId: "", visible: true, sortOrder: 3, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_tools_i_use", componentName: "ToolsIUse", label: "Tools I Use — Công cụ đang dùng", hasCta: false, sharedSectionId: "", visible: true, sortOrder: 4, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_problem", componentName: "Problem", label: "Problem — Vấn đề", hasCta: false, sharedSectionId: "", visible: true, sortOrder: 5, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_solution", componentName: "Solution", label: "Solution — Giải pháp", hasCta: false, sharedSectionId: "", visible: true, sortOrder: 6, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_academy_teaser", componentName: "AcademyTeaser", label: "Academy Teaser — Giới thiệu Học viện AI", hasCta: true, sharedSectionId: "section_seed_feature", visible: true, sortOrder: 7, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_trust_stats", componentName: "TrustStats", label: "Trust Stats — Số liệu cộng đồng", hasCta: false, sharedSectionId: "", visible: true, sortOrder: 8, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_ecosystem", componentName: "Ecosystem", label: "Ecosystem — Hệ sinh thái", hasCta: false, sharedSectionId: "", visible: true, sortOrder: 9, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_founder_story", componentName: "FounderStory", label: "Founder Story — Câu chuyện người sáng lập", hasCta: false, sharedSectionId: "section_seed_founder", visible: true, sortOrder: 10, status: "Active", updatedDate: "2026-07-12" },
  { id: "homesec_seed_final_cta", componentName: "FinalCTA", label: "Final CTA — Kêu gọi hành động cuối trang", hasCta: true, sharedSectionId: "section_seed_cta", visible: true, sortOrder: 11, status: "Active", updatedDate: "2026-07-12" },
];
