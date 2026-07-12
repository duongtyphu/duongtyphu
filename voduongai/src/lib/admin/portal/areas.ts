/**
 * Portal Area catalog — ADM-SPR-200 Task 1/2 groundwork.
 *
 * "Portal Area" = đúng 10 mục THẬT trong sidebar Portal hiện tại
 * (`portalNavSections`, `src/lib/portal/hubs.ts`) — nguồn duy nhất, không
 * suy luận/không bịa thêm Area nào ngoài danh sách này (đúng nguyên tắc
 * "Portal hiện tại là Reference Source").
 *
 * `ownerWorkspace` chỉ điền khi khớp RÕ RÀNG với một nhóm đã có trong
 * `src/lib/admin/nav.ts` — 4 Area không có Workspace Admin nào sở hữu rõ
 * ràng được để `null` (KHÔNG đoán), đúng khuyến nghị của
 * `docs/admin/PORTAL_COVERAGE_AUDIT.md` (đề xuất thêm Workspace "AI
 * Workspace"/"My Journey" nhưng chưa được PMO xác nhận triển khai).
 */

export type PortalArea = {
  key: string;
  label: string;
  href: string;
  /** Nhóm trong nav.ts sở hữu Area này ở cấp Admin — null nếu chưa xác định. */
  ownerWorkspace: string | null;
};

export const PORTAL_AREAS: PortalArea[] = [
  { key: "home", label: "Trang chủ Học viện", href: "/portal", ownerWorkspace: null },
  { key: "companion", label: "Companion", href: "/portal/companion", ownerWorkspace: null },
  { key: "ckos", label: "Hệ tri thức AI (CKOS)", href: "/portal/ckos", ownerWorkspace: "CKOS" },
  { key: "hocvienai", label: "Học viện AI", href: "/portal/hocvienai", ownerWorkspace: null },
  { key: "aiworkspace", label: "AI Workspace", href: "/portal/aiworkspace", ownerWorkspace: null },
  { key: "duan-cohoi", label: "Dự án & Cơ hội", href: "/portal/duan-cohoi", ownerWorkspace: "Projects & Opportunities" },
  { key: "premium", label: "Premium", href: "/portal/premium", ownerWorkspace: "Premium" },
  { key: "hanhtrinh", label: "Hành trình của tôi", href: "/portal/hanhtrinhcuatoi", ownerWorkspace: null },
  { key: "su-menh-companion", label: "Sứ mệnh Companion", href: "/portal/su-menh-companion", ownerWorkspace: "Companion Studio" },
  { key: "congdongai", label: "Cộng đồng", href: "/portal/congdongai", ownerWorkspace: "Community" },
];

/**
 * 4 Area chưa có Workspace Admin sở hữu (`ownerWorkspace: null`):
 * Trang chủ Học viện, Học viện AI, AI Workspace, Hành trình của tôi.
 * `docs/admin/PORTAL_COVERAGE_AUDIT.md` §Workspace Recommendation từng đề
 * xuất thêm "AI Workspace" và "My Journey" làm Workspace riêng — chưa được
 * PMO/Founder xác nhận triển khai, nên KHÔNG tự gán ở đây.
 */
export const UNOWNED_AREA_COUNT = PORTAL_AREAS.filter((a) => a.ownerWorkspace === null).length;
