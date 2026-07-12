/**
 * Portal Area catalog — ADM-SPR-200 Task 1/2 groundwork, cập nhật
 * ADM-SPR-201 (Main Shell Foundation).
 *
 * "Portal Area" = đúng 10 mục THẬT trong sidebar Portal hiện tại
 * (`portalNavSections`, `src/lib/portal/hubs.ts`) — nguồn duy nhất, không
 * suy luận/không bịa thêm Area nào ngoài danh sách này (đúng nguyên tắc
 * "Portal hiện tại là Reference Source"). Đúng 10 mục "Portal Navigation
 * bắt buộc" trong brief ADM-SPR-201.
 *
 * `ownerWorkspace` chỉ điền khi khớp RÕ RÀNG với một Workspace trong danh
 * sách "Workspace Navigation bắt buộc" (ADM-SPR-201) — brief này đã chính
 * thức bổ sung "AI Workspace" và "Journey" làm Workspace riêng (trước đó
 * ADM-SPR-200 để trống 2 Area tương ứng vì chưa được PMO xác nhận). Nhờ
 * đó chỉ còn ĐÚNG 1 Area chưa có Owner: "Trang chủ Học viện" — Workspace
 * Navigation bắt buộc không liệt kê Workspace nào khớp rõ ràng cho Area
 * này (không phải "Website", vì Website Workspace sở hữu Homepage MARKETING
 * công khai "/", khác "/portal" — Portal Area sau đăng nhập). KHÔNG tự
 * gán — ghi nhận, trình PMO.
 */

export type PortalArea = {
  key: string;
  label: string;
  href: string;
  /** Tên Workspace trong nav.ts sở hữu Area này ở cấp Admin — null nếu chưa xác định. */
  ownerWorkspace: string | null;
  /** Route Admin của Workspace sở hữu — null nếu ownerWorkspace null. */
  ownerWorkspaceHref: string | null;
};

export const PORTAL_AREAS: PortalArea[] = [
  { key: "home", label: "Trang chủ Học viện", href: "/portal", ownerWorkspace: null, ownerWorkspaceHref: null },
  { key: "companion", label: "Companion", href: "/portal/companion", ownerWorkspace: "Companion Studio", ownerWorkspaceHref: "/admin/companion-studio" },
  { key: "ckos", label: "Hệ tri thức AI (CKOS)", href: "/portal/ckos", ownerWorkspace: "CKOS", ownerWorkspaceHref: "/admin/ckos" },
  { key: "hocvienai", label: "Học viện AI", href: "/portal/hocvienai", ownerWorkspace: "Academy", ownerWorkspaceHref: "/admin/roadmap" },
  { key: "aiworkspace", label: "AI Workspace", href: "/portal/aiworkspace", ownerWorkspace: "AI Workspace", ownerWorkspaceHref: "/admin/ai-workspace" },
  { key: "duan-cohoi", label: "Dự án & Cơ hội", href: "/portal/duan-cohoi", ownerWorkspace: "Projects & Opportunities", ownerWorkspaceHref: "/admin/digital-assets" },
  { key: "premium", label: "Premium", href: "/portal/premium", ownerWorkspace: "Premium", ownerWorkspaceHref: "/admin/premium" },
  { key: "hanhtrinh", label: "Hành trình của tôi", href: "/portal/hanhtrinhcuatoi", ownerWorkspace: "Journey", ownerWorkspaceHref: "/admin/journey" },
  { key: "su-menh-companion", label: "Sứ mệnh Companion", href: "/portal/su-menh-companion", ownerWorkspace: "Companion Studio", ownerWorkspaceHref: "/admin/companion-studio" },
  { key: "congdongai", label: "Cộng đồng", href: "/portal/congdongai", ownerWorkspace: "Community", ownerWorkspaceHref: "/admin/community" },
];

/**
 * Chỉ còn 1 Area chưa có Owner ("Trang chủ Học viện") — giảm từ 4 (ADM-SPR-200)
 * xuống 1 nhờ Workspace Navigation bắt buộc (ADM-SPR-201) chính thức hóa
 * "AI Workspace"/"Journey", và rà lại phát hiện "Companion" area trước đó
 * bị bỏ sót (đã sửa: Companion Studio sở hữu cả "Companion" lẫn "Sứ mệnh
 * Companion", khớp đúng workspaceOwnership.ts vốn đã ghi "owns" 2 area
 * này từ ADM-SPR-200 nhưng areas.ts lúc đó chưa đồng bộ).
 */
export const UNOWNED_AREA_COUNT = PORTAL_AREAS.filter((a) => a.ownerWorkspace === null).length;
