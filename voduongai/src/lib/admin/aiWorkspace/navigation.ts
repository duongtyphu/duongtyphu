import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * AI Workspace IA (AIWS-SPR-501 Task 2) — 1 mục, khớp đúng thực tế: toàn
 * bộ nội dung AI Workspace trên Portal (/portal/aiworkspace) là 1 trang
 * duy nhất (+ 3 route con chỉ hiển thị chi tiết/redirect, không có nội
 * dung riêng cần trang Admin riêng — xem báo cáo
 * `docs/admin/AI_WORKSPACE_MANAGEMENT_AIWS-SPR-501.md`). Không thêm mục
 * "Registry"/"CRUD" giả — 0/9 nội dung Section hiện có CRUD (Task 3).
 */
export const AI_WORKSPACE_SECTIONS: AdminWorkspaceSection[] = [
  { key: "dashboard", label: "AI Workspace Dashboard", href: "/admin/ai-workspace" },
];
