/**
 * Portal Area Registry — CRUD (PORTAL-SPR-301 Task 1).
 *
 * Nâng cấp từ `areas.ts` (ADM-SPR-200/201, READ-ONLY hardcode) lên
 * Registry thật dùng `useCollection()` — Founder đổi tên hiển thị/ẩn-hiện/
 * đổi thứ tự/chọn Workspace Owner qua UI, không cần sửa file `.ts`.
 *
 * Đúng 10 Portal Area — khớp `portalNavSections` (`src/lib/portal/hubs.ts`,
 * nguồn duy nhất, không suy diễn thêm). Không có Add/Delete Area (Portal
 * Area là cấu trúc cố định theo sidebar Portal thật, không phải danh mục
 * Founder tự mở rộng — Task 3 của brief chỉ liệt kê "thêm page/child
 * page/section", không có "thêm Portal Area").
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const PORTAL_STATUSES = NAVIGATION_STATUSES;
export type PortalStatus = NavigationStatus;

export type PortalArea = {
  id: string;
  label: string;
  href: string;
  /** Tên Workspace sở hữu (khớp WORKSPACE_OWNERS.name) — "" nếu chưa xác định, KHÔNG tự gán. */
  ownerWorkspace: string;
  visible: boolean;
  sortOrder: number;
  status: PortalStatus;
  updatedDate: string;
};

export const PORTAL_AREAS_COLLECTION_KEY = "portal-mgmt-areas";

/**
 * Seed — bám đúng 10 Area thật đã audit ở ADM-SPR-200/201 (`areas.ts` cũ),
 * chuyển nguyên `ownerWorkspace` đã xác nhận, không suy diễn thêm.
 * "Trang chủ Học viện" vẫn để `ownerWorkspace: ""` — KHÔNG tự gán (đúng
 * phát hiện đã ghi ở `areas.ts` cũ: không Workspace nào trong "Workspace
 * Navigation bắt buộc" khớp rõ ràng cho Area này).
 */
export const PORTAL_AREAS_SEED: PortalArea[] = [
  { id: "home", label: "Trang chủ Học viện", href: "/portal", ownerWorkspace: "", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "companion", label: "Companion", href: "/portal/companion", ownerWorkspace: "Companion Studio", visible: true, sortOrder: 2, status: "Active", updatedDate: "2026-07-12" },
  { id: "ckos", label: "Hệ tri thức AI (CKOS)", href: "/portal/ckos", ownerWorkspace: "CKOS", visible: true, sortOrder: 3, status: "Active", updatedDate: "2026-07-12" },
  { id: "hocvienai", label: "Học viện AI", href: "/portal/hocvienai", ownerWorkspace: "Academy", visible: true, sortOrder: 4, status: "Active", updatedDate: "2026-07-12" },
  { id: "aiworkspace", label: "AI Workspace", href: "/portal/aiworkspace", ownerWorkspace: "AI Workspace", visible: true, sortOrder: 5, status: "Active", updatedDate: "2026-07-12" },
  { id: "duan-cohoi", label: "Dự án & Cơ hội", href: "/portal/duan-cohoi", ownerWorkspace: "Projects & Opportunities", visible: true, sortOrder: 6, status: "Active", updatedDate: "2026-07-12" },
  { id: "premium", label: "Premium", href: "/portal/premium", ownerWorkspace: "Premium", visible: true, sortOrder: 7, status: "Active", updatedDate: "2026-07-12" },
  { id: "hanhtrinh", label: "Hành trình của tôi", href: "/portal/hanhtrinhcuatoi", ownerWorkspace: "Journey & Community", visible: true, sortOrder: 8, status: "Active", updatedDate: "2026-07-13" },
  { id: "su-menh-companion", label: "Sứ mệnh Companion", href: "/portal/su-menh-companion", ownerWorkspace: "Journey & Community", visible: true, sortOrder: 9, status: "Active", updatedDate: "2026-07-13" },
  { id: "congdongai", label: "Cộng đồng", href: "/portal/congdongai", ownerWorkspace: "Journey & Community", visible: true, sortOrder: 10, status: "Active", updatedDate: "2026-07-13" },
];
