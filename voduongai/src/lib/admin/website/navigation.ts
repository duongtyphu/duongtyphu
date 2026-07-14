/**
 * Canonical Information Architecture of the Website Workspace — confirmed
 * by PMO Clarification for WEB-SPR-001 (10 groups, exact names, no
 * additions/removals/renames). Single source of truth for both the
 * Workspace's internal tab navigation (WebsiteWorkspaceShell) and the
 * Admin sidebar's "Website" group in src/lib/admin/nav.ts — the two must
 * never drift apart.
 *
 * WEB-SPR-202 (Task 8 "Portal Mapping", brief FOUNDER-001-bound) thêm mục
 * thứ 11 — brief này liệt kê rõ "Portal Mapping" như một khả năng bắt
 * buộc riêng ("Mỗi Website Object phải hiển thị Current Route → Workspace
 * Owner → Publish Status → Last Updated"), không map vào 1 trong 10 mục
 * cũ nào — bổ sung additive, không đổi tên/xoá 10 mục đã khoá trước đó.
 */
export type WebsiteWorkspaceSection = {
  key: string;
  label: string;
  href: string;
};

/**
 * PMO DIRECTIVE "ADMIN CMS v1.1 UI REFINEMENT" (Task 1/3, PMO APPROVAL) —
 * tiếng Việt, gộp Homepage/Landing Pages/Static Pages vào tab "Trang" (đều
 * đọc chung Website Page Registry, chỉ khác bộ lọc pageType — trang
 * `/admin/website/pages` giờ hiển thị đủ cả 3 loại + Cấu trúc Section
 * trang chủ), gộp Redirect vào tab "SEO & Chuyển hướng". Route cũ
 * (`/admin/website/homepage`, `/landing-pages`, `/static-pages`,
 * `/redirect`) vẫn hoạt động khi truy cập trực tiếp, chỉ không còn hiện ở
 * tab bar (đúng Task 10 — không tạo route mới, ưu tiên gộp/ẩn).
 */
export const WEBSITE_WORKSPACE_SECTIONS: WebsiteWorkspaceSection[] = [
  { key: "dashboard", label: "Tổng quan", href: "/admin/website" },
  { key: "pages", label: "Trang", href: "/admin/website/pages" },
  { key: "navigation", label: "Điều hướng", href: "/admin/website/navigation" },
  { key: "shared-sections", label: "Nội dung dùng chung", href: "/admin/website/shared-sections" },
  { key: "seo", label: "SEO & Chuyển hướng", href: "/admin/website/seo" },
  { key: "portal-mapping", label: "Liên kết Portal", href: "/admin/website/portal-mapping" },
  { key: "global-settings", label: "Cài đặt", href: "/admin/website/global-settings" },
];
