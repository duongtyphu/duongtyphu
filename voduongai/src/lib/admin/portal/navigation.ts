import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * PMO DIRECTIVE "ADMIN CMS v1.1 UI REFINEMENT" (Task 4, PMO APPROVAL) — audit
 * (`ADMIN_CMS_SIDEBAR_SIMPLIFICATION.md` #2) xác nhận Portal Areas/Page
 * Registry/Content Registry không có route Portal nào đọc (consumer = 0) —
 * ẩn khỏi tab bar, giữ làm dữ liệu/service nội bộ phía sau thay vì màn hình
 * riêng. Founder làm việc qua 1 mục "Portal" duy nhất theo mô hình Portal →
 * Khu vực → Trang → Section → Nội dung → Xuất bản. Route cũ vẫn hoạt động
 * khi truy cập trực tiếp.
 */
export const PORTAL_MANAGEMENT_SECTIONS: AdminWorkspaceSection[] = [
  { key: "dashboard", label: "Portal", href: "/admin/portal" },
];
