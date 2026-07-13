import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * Journey & Community IA (JOURNEY-SPR-901 Task 2, mở rộng PMO-HARDENING-CONT
 * Workstream 3) — Dashboard tổng hợp (/admin/journey), Kênh cộng đồng
 * (/admin/community, CRUD thật), và Sứ mệnh Companion (/admin/journey/mission,
 * CRUD thật mới — trước đây Hero/Genome/Constitution/Timeline 100% hardcode)
 * — xem `docs/admin/JOURNEY_COMMUNITY_MANAGEMENT_JOURNEY-SPR-901.md`.
 * Không tạo route con giả cho Reflection/Milestone/Story/Timeline hoạt động
 * cá nhân — đây là dữ liệu runtime thật của người dùng (Supabase reflections/
 * memory_capsules), không phải nội dung Founder biên tập (Task 3).
 */
export const JOURNEY_COMMUNITY_SECTIONS: AdminWorkspaceSection[] = [
  { key: "dashboard", label: "Journey & Community Dashboard", href: "/admin/journey" },
  { key: "mission", label: "Sứ mệnh Companion", href: "/admin/journey/mission" },
  { key: "community", label: "Kênh cộng đồng", href: "/admin/community" },
];
