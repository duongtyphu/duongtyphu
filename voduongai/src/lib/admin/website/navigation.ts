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

export const WEBSITE_WORKSPACE_SECTIONS: WebsiteWorkspaceSection[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin/website" },
  { key: "pages", label: "Pages", href: "/admin/website/pages" },
  { key: "navigation", label: "Navigation", href: "/admin/website/navigation" },
  { key: "homepage", label: "Homepage", href: "/admin/website/homepage" },
  { key: "landing-pages", label: "Landing Pages", href: "/admin/website/landing-pages" },
  { key: "static-pages", label: "Static Pages", href: "/admin/website/static-pages" },
  { key: "shared-sections", label: "Shared Sections", href: "/admin/website/shared-sections" },
  { key: "seo", label: "SEO", href: "/admin/website/seo" },
  { key: "redirect", label: "Redirect", href: "/admin/website/redirect" },
  { key: "global-settings", label: "Global Settings", href: "/admin/website/global-settings" },
  { key: "portal-mapping", label: "Portal Mapping", href: "/admin/website/portal-mapping" },
];
