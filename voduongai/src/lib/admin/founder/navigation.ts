import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * PMO DIRECTIVE "ADMIN CMS v1.1 UI REFINEMENT" (Task 1/2, PMO APPROVAL) —
 * "Workspace Owner Panel" (ngôn ngữ kỹ thuật, không phải nhu cầu vận hành
 * hằng ngày) và "Global Search" (chưa triển khai thật) ẩn khỏi tab bar.
 * "Review Queue" đổi tên "Duyệt & Xuất bản", tách thành mục cấp 1 riêng
 * trong Sidebar (`nav.ts`) — không còn là tab con của Tổng quan.
 */
export const FOUNDER_SECTIONS: AdminWorkspaceSection[] = [
  { key: "overview", label: "Tổng quan", href: "/admin/founder" },
];
