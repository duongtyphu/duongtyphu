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

/**
 * PMO DIRECTIVE "ADMIN CMS v1.1 UI REFINEMENT" (Task 1/3, PMO APPROVAL) —
 * tiếng Việt, không hiện riêng Wordmark/Typography/Color Palette/Theme/
 * Icon/Open Graph/Brand Assets như tab riêng — gộp vào 2 tab "Thư viện
 * nhận diện" (Logo/Wordmark/Icon/Open Graph, đều đọc chung Brand Asset
 * Registry) và "Màu & Kiểu chữ" (Typography/Color Palette/Theme). Route cũ
 * vẫn hoạt động khi truy cập trực tiếp, chỉ không còn hiện ở tab bar.
 */
export const BRAND_WORKSPACE_SECTIONS: BrandWorkspaceSection[] = [
  { key: "dashboard", label: "Tổng quan", href: "/admin/brand" },
  { key: "assets", label: "Thư viện nhận diện", href: "/admin/brand/assets" },
  { key: "typography", label: "Màu & Kiểu chữ", href: "/admin/brand/typography" },
  { key: "settings", label: "Cài đặt", href: "/admin/brand/settings" },
];
