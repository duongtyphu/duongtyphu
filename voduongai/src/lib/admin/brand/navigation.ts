/**
 * Canonical Information Architecture of Brand Studio Workspace — theo Scope
 * của brief BRAND-SPR-001 (10 mục: Dashboard, Logo, Wordmark, Typography,
 * Color Palette, Theme, Icons, Open Graph, Brand Assets Registry, Global
 * Brand Settings). Single source of truth cho cả tab nav nội bộ
 * (BrandWorkspaceShell) và nhóm "Brand Studio" trong src/lib/admin/nav.ts —
 * hai nơi không được lệch nhau (đúng nguyên tắc đã dùng cho Website
 * Workspace, xem src/lib/admin/website/navigation.ts).
 */
export type BrandWorkspaceSection = {
  key: string;
  label: string;
  href: string;
};

export const BRAND_WORKSPACE_SECTIONS: BrandWorkspaceSection[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin/brand" },
  { key: "logo", label: "Logo", href: "/admin/brand/logo" },
  { key: "wordmark", label: "Wordmark", href: "/admin/brand/wordmark" },
  { key: "typography", label: "Typography", href: "/admin/brand/typography" },
  { key: "color-palette", label: "Color Palette", href: "/admin/brand/color-palette" },
  { key: "theme", label: "Theme", href: "/admin/brand/theme" },
  { key: "icons", label: "Icons", href: "/admin/brand/icons" },
  { key: "open-graph", label: "Open Graph", href: "/admin/brand/open-graph" },
  { key: "assets", label: "Brand Assets Registry", href: "/admin/brand/assets" },
  { key: "settings", label: "Global Brand Settings", href: "/admin/brand/settings" },
];
