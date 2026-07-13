import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * Projects & Opportunities Workspace IA (PROJECTS-SPR-602, Founder
 * Directive: Projects & Opportunities Canonical Product) — 4 mục bám đúng
 * cấu trúc thật của /portal/duan-cohoi (Canonical Product): Dashboard,
 * Hệ sinh thái (Ecosystem — Project Detail/Link/Dự án con/CTA/Evaluation/
 * FAQ đều nằm trong đây), Bài viết (Related Content), Danh mục. Thay thế
 * 11 mục cũ (Dự án/Link/5 trang category[key]/Báo cáo) quản lý model
 * DigitalAssetProject/Link — Consumer = 0 trên Portal thật.
 */
export const PROJECTS_OPPORTUNITIES_SECTIONS: AdminWorkspaceSection[] = [
  { key: "overview", label: "Tổng quan", href: "/admin/projects-opportunities" },
  { key: "ecosystems", label: "Hệ sinh thái", href: "/admin/projects-opportunities/ecosystems" },
  { key: "articles", label: "Bài viết", href: "/admin/projects-opportunities/articles" },
  { key: "categories", label: "Danh mục", href: "/admin/projects-opportunities/categories" },
];
