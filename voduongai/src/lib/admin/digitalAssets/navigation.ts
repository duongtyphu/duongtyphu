import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * Projects & Opportunities Workspace IA (PROJECTS-SPR-601 Task 2) — khớp
 * 1:1 với 11 mục "Projects & Opportunities" đã có sẵn trong `nav.ts`
 * (không thêm/bớt mục nào — đúng "Không tạo Route dư/Menu dư").
 */
export const DIGITAL_ASSETS_WORKSPACE_SECTIONS: AdminWorkspaceSection[] = [
  { key: "overview", label: "Tổng quan", href: "/admin/digital-assets" },
  { key: "digiu", label: "Hệ sinh thái DigiU", href: "/admin/digital-assets/category/digiu" },
  { key: "equity", label: "Đầu tư cổ phần tại SolarGroup", href: "/admin/digital-assets/category/equity" },
  { key: "crypto", label: "Sàn giao dịch Crypto", href: "/admin/digital-assets/category/crypto" },
  { key: "blockchain", label: "Blockchain", href: "/admin/digital-assets/category/blockchain" },
  { key: "trading", label: "Trading", href: "/admin/digital-assets/category/trading" },
  { key: "links", label: "Link dự án (tất cả)", href: "/admin/digital-assets/links" },
  { key: "projects", label: "Dự án", href: "/admin/digital-assets/projects" },
  { key: "articles", label: "Bài viết", href: "/admin/digital-assets/articles" },
  { key: "categories", label: "Cấu hình danh mục", href: "/admin/digital-assets/categories" },
  { key: "analytics", label: "Báo cáo", href: "/admin/digital-assets/analytics" },
];
