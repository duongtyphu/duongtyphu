import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * Companion Studio IA (COMPANION-SPR-801 Task 2) — 1 mục, khớp đúng thực
 * tế: toàn bộ AI Mentor Experience (2 trang Portal + Companion Presence
 * toàn cục) hiện chỉ có 1 Dashboard duy nhất, không có CRUD nào đứng sau
 * bất kỳ nội dung nào (Persona/Agent Registry/Orchestration Rules đều là
 * TypeScript hardcode) — xem
 * `docs/admin/COMPANION_STUDIO_MANAGEMENT_COMPANION-SPR-801.md`. Không
 * tạo route/menu con giả cho đến khi có CRUD thật đứng sau.
 */
export const COMPANION_STUDIO_SECTIONS: AdminWorkspaceSection[] = [
  { key: "dashboard", label: "Tổng quan", href: "/admin/companion-studio" },
];
