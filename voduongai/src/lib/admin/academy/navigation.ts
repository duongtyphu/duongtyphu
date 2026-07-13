import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * Academy Workspace IA (ACADEMY-SPR-401 Task 1) — 5 mục, khớp đúng nội
 * dung Learning Experience THẬT hiện có trên Portal (không thêm mục cho
 * Course/Module/Quiz/Certificate/Instructor — các khái niệm này không tồn
 * tại trong Portal hiện tại, xem báo cáo
 * `docs/admin/ACADEMY_WORKSPACE_MANAGEMENT_ACADEMY-SPR-401.md`).
 *
 * "Learning Journeys" là view READ-ONLY (không CRUD) — Journey chiếu 1:1
 * từ CKOS Collection (`src/features/academy/services/journey.service.ts`),
 * Academy không sở hữu dữ liệu này (đúng Task 4 "Academy không sở hữu
 * Knowledge").
 */
export const ACADEMY_WORKSPACE_SECTIONS: AdminWorkspaceSection[] = [
  { key: "dashboard", label: "Academy Dashboard", href: "/admin/academy" },
  { key: "roadmap", label: "Lộ trình thành công", href: "/admin/roadmap" },
  { key: "daily-missions", label: "Nhiệm vụ hôm nay", href: "/admin/daily-missions" },
  { key: "projects", label: "Dự án thực chiến", href: "/admin/projects" },
  { key: "journeys", label: "Learning Journeys (đọc)", href: "/admin/academy/journeys" },
];
