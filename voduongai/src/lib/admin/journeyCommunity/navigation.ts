import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * Journey & Community IA (JOURNEY-SPR-901 Task 2) — 2 mục, khớp đúng
 * thực tế: Dashboard tổng hợp (/admin/journey, bao gồm Journey + Mission)
 * và Kênh cộng đồng (/admin/community, CRUD thật duy nhất trong Workspace
 * này) — xem `docs/admin/JOURNEY_COMMUNITY_MANAGEMENT_JOURNEY-SPR-901.md`.
 * Không tạo route con giả cho Reflection/Milestone/Story/Timeline — đây
 * là dữ liệu runtime thật của người dùng (Supabase reflections/
 * memory_capsules), không phải nội dung Founder biên tập (Task 3).
 */
export const JOURNEY_COMMUNITY_SECTIONS: AdminWorkspaceSection[] = [
  { key: "dashboard", label: "Journey & Community Dashboard", href: "/admin/journey" },
  { key: "community", label: "Kênh cộng đồng", href: "/admin/community" },
];
