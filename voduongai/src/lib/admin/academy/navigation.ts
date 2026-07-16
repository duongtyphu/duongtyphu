import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * Academy Workspace IA (ACADEMY-SPR-401 Task 1) — khớp đúng nội dung
 * Learning Experience THẬT hiện có trên Portal (xem báo cáo
 * `docs/admin/ACADEMY_WORKSPACE_MANAGEMENT_ACADEMY-SPR-401.md`).
 *
 * "Learning Journeys" là view READ-ONLY (không CRUD) — Journey chiếu 1:1
 * từ CKOS Collection (`src/features/academy/services/journey.service.ts`),
 * Academy không sở hữu dữ liệu này (đúng Task 4 "Academy không sở hữu
 * Knowledge").
 *
 * "Nội dung khoá học" (STABILIZATION-SPR-1101 Task 2) — MỚI: Course/Module/
 * Lesson/Video/PDF giờ tồn tại thật (course_modules/course_lessons,
 * supabase-premium-learning-content-migration.sql). Academy sở hữu course
 * STRUCTURE (Task 2.3 ownership), Premium vẫn giữ giá/checkout/order/
 * entitlement (`/admin/course-pricing`, không đụng).
 */
export const ACADEMY_WORKSPACE_SECTIONS: AdminWorkspaceSection[] = [
  { key: "dashboard", label: "Academy Dashboard", href: "/admin/academy" },
  { key: "roadmap", label: "Lộ trình thành công", href: "/admin/roadmap" },
  { key: "daily-missions", label: "Nhiệm vụ hôm nay", href: "/admin/daily-missions" },
  { key: "courses", label: "Nội dung khoá học", href: "/admin/academy/courses" },
  { key: "projects", label: "Dự án thực chiến", href: "/admin/projects" },
  { key: "journeys", label: "Hành trình học tập (đọc)", href: "/admin/academy/journeys" },
];
