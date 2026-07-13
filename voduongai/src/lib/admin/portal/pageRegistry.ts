/**
 * Portal Page Registry — CRUD (PORTAL-SPR-301 Task 1-3).
 *
 * Nâng cấp từ `pages.ts` (ADM-SPR-200, READ-ONLY liệt kê cơ học toàn bộ
 * route) lên Registry thật — Founder thêm/sửa/xoá Page và Child Page qua
 * UI, không cần sửa file `.ts`. Phân biệt Parent Page/Child Page bằng
 * `parentPageId` ("" = Parent Page cấp 1 của Area, có giá trị = Child Page
 * thuộc Page đó) — không dùng union đóng, không giới hạn số cấp.
 *
 * `route` là TEXT tự do (không ràng buộc route Next.js thật) — đây là
 * presentation context Founder ghi nhận, không phải điều khiển routing
 * thật (đúng "Portal Management chỉ quản lý presentation context").
 * `workspaceOwner` là text tự do, gợi ý từ `WORKSPACE_OWNERS` (không union
 * đóng — Task Founder Directive: không được ép Founder sửa code khi chọn
 * Owner cho Page mới).
 */

import type { PortalStatus } from "@/lib/admin/portal/areaRegistry";

export type PortalPageEntry = {
  id: string;
  areaId: string;
  parentPageId: string;
  title: string;
  route: string;
  visible: boolean;
  sortOrder: number;
  publishStatus: PortalStatus;
  seoContextNote: string;
  workspaceOwner: string;
  updatedDate: string;
};

export function emptyPortalPage(areaId: string, parentPageId = ""): Omit<PortalPageEntry, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    areaId,
    parentPageId,
    title: "",
    route: "",
    visible: true,
    sortOrder: 0,
    publishStatus: "Draft",
    seoContextNote: "",
    workspaceOwner: "",
    updatedDate: today,
  };
}

export const PORTAL_PAGES_COLLECTION_KEY = "portal-mgmt-pages";

/**
 * Seed — 10 Parent Page (1/Area, route = href thật của Area, đúng
 * `PORTAL_AREAS_SEED`) + Child Page cho các Area có route con THẬT đã xác
 * nhận trong `pages.ts` cũ (route động `[slug]` giữ nguyên cú pháp thật,
 * không đổi thành placeholder khác). Area không có route con thật
 * (ckos/hocvienai/premium/congdongai — kiểm tra lại `pages.ts`: mỗi Area
 * này chỉ có đúng 1 route khớp, không có route con) — không bịa Child Page
 * cho các Area này. ĐÍNH CHÍNH (COMPANION-SPR-801 Task 1): "companion" ĐÃ
 * có 1 route con thật — /portal/ai-assistant — comment gốc bỏ sót vì trang
 * này không nằm trong `pages.ts` cũ, chỉ được link từ component Companion
 * Presence toàn cục (CompanionSpace.tsx), không phải từ điều hướng Area.
 *
 * Route "chết" (redirect 301 xác nhận ở ADM-SPR-005: /portal/hanh-trinh-cua-toi,
 * /portal/student-success, /portal/updates) KHÔNG đưa vào đây — không phải
 * Page Founder quản lý (đó là route legacy đã bị redirect ở tầng
 * next.config.ts, không phải nội dung Portal đang hiển thị).
 */
export const PORTAL_PAGES_SEED: PortalPageEntry[] = [
  // Parent Pages — 1/Area
  { id: "page_home", areaId: "home", parentPageId: "", title: "Trang chủ Học viện", route: "/portal", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Trang gốc sau đăng nhập — chưa có SEO context riêng (Portal không index công khai).", workspaceOwner: "", updatedDate: "2026-07-12" },
  { id: "page_companion", areaId: "companion", parentPageId: "", title: "Companion", route: "/portal/companion", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "Companion Studio", updatedDate: "2026-07-12" },
  { id: "page_ckos", areaId: "ckos", parentPageId: "", title: "Hệ tri thức AI (CKOS)", route: "/portal/ckos", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "CKOS", updatedDate: "2026-07-12" },
  { id: "page_hocvienai", areaId: "hocvienai", parentPageId: "", title: "Học viện AI", route: "/portal/hocvienai", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "Academy", updatedDate: "2026-07-12" },
  { id: "page_aiworkspace", areaId: "aiworkspace", parentPageId: "", title: "AI Workspace", route: "/portal/aiworkspace", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "AI Workspace", updatedDate: "2026-07-12" },
  { id: "page_duan_cohoi", areaId: "duan-cohoi", parentPageId: "", title: "Dự án & Cơ hội", route: "/portal/duan-cohoi", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "Projects & Opportunities", updatedDate: "2026-07-12" },
  { id: "page_premium", areaId: "premium", parentPageId: "", title: "Premium", route: "/portal/premium", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "Premium", updatedDate: "2026-07-12" },
  { id: "page_hanhtrinh", areaId: "hanhtrinh", parentPageId: "", title: "Hành trình của tôi", route: "/portal/hanhtrinhcuatoi", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "Journey & Community", updatedDate: "2026-07-13" },
  { id: "page_su_menh_companion", areaId: "su-menh-companion", parentPageId: "", title: "Sứ mệnh Companion", route: "/portal/su-menh-companion", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "Journey & Community", updatedDate: "2026-07-13" },
  { id: "page_congdongai", areaId: "congdongai", parentPageId: "", title: "Cộng đồng", route: "/portal/congdongai", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "Journey & Community", updatedDate: "2026-07-13" },

  // Child Pages — AI Workspace (3 route con thật, xác nhận pages.ts)
  { id: "page_aiworkspace_detail", areaId: "aiworkspace", parentPageId: "page_aiworkspace", title: "Chi tiết mục AI Workspace", route: "/portal/aiworkspace/[slug]", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Route động — SEO context phụ thuộc từng bản ghi, chưa có SEO Registry riêng.", workspaceOwner: "AI Workspace", updatedDate: "2026-07-12" },
  { id: "page_aiworkspace_baiviet", areaId: "aiworkspace", parentPageId: "page_aiworkspace", title: "Bài viết AI Workspace", route: "/portal/aiworkspace/bai-viet/[slug]", visible: true, sortOrder: 2, publishStatus: "Active", seoContextNote: "Route động.", workspaceOwner: "AI Workspace", updatedDate: "2026-07-12" },
  { id: "page_aiworkspace_nghe", areaId: "aiworkspace", parentPageId: "page_aiworkspace", title: "Nghề AI Workspace", route: "/portal/aiworkspace/nghe/[slug]", visible: true, sortOrder: 3, publishStatus: "Active", seoContextNote: "Route động.", workspaceOwner: "AI Workspace", updatedDate: "2026-07-12" },

  // Child Pages — Dự án & Cơ hội (3 route con thật)
  { id: "page_duan_ecosystem", areaId: "duan-cohoi", parentPageId: "page_duan_cohoi", title: "Hệ sinh thái dự án", route: "/portal/duan-cohoi/[ecosystemSlug]", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Route động.", workspaceOwner: "Projects & Opportunities", updatedDate: "2026-07-12" },
  { id: "page_duan_subproject", areaId: "duan-cohoi", parentPageId: "page_duan_cohoi", title: "Dự án con", route: "/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]", visible: true, sortOrder: 2, publishStatus: "Active", seoContextNote: "Route động.", workspaceOwner: "Projects & Opportunities", updatedDate: "2026-07-12" },
  { id: "page_duan_baiviet", areaId: "duan-cohoi", parentPageId: "page_duan_cohoi", title: "Bài viết Dự án & Cơ hội", route: "/portal/duan-cohoi/bai-viet/[slug]", visible: true, sortOrder: 3, publishStatus: "Active", seoContextNote: "Route động.", workspaceOwner: "Projects & Opportunities", updatedDate: "2026-07-12" },

  // Child Pages — Hành trình của tôi (5 route con thật)
  { id: "page_hanhtrinh_bando", areaId: "hanhtrinh", parentPageId: "page_hanhtrinh", title: "Bản đồ hành trình", route: "/portal/hanhtrinhcuatoi/ban-do", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng.", workspaceOwner: "Journey & Community", updatedDate: "2026-07-13" },
  { id: "page_hanhtrinh_khuvuon", areaId: "hanhtrinh", parentPageId: "page_hanhtrinh", title: "Khu vườn của bạn (Living Garden)", route: "/portal/khuvuoncuaban", visible: true, sortOrder: 2, publishStatus: "Active", seoContextNote: "Không áp dụng.", workspaceOwner: "Journey & Community", updatedDate: "2026-07-13" },
  { id: "page_hanhtrinh_mirror", areaId: "hanhtrinh", parentPageId: "page_hanhtrinh", title: "Mirror", route: "/portal/mirror", visible: true, sortOrder: 3, publishStatus: "Active", seoContextNote: "Không áp dụng.", workspaceOwner: "Journey & Community", updatedDate: "2026-07-13" },
  { id: "page_hanhtrinh_nhatky", areaId: "hanhtrinh", parentPageId: "page_hanhtrinh", title: "Nhật ký học tập", route: "/portal/nhatkyhoctap", visible: true, sortOrder: 4, publishStatus: "Active", seoContextNote: "Không áp dụng.", workspaceOwner: "Journey & Community", updatedDate: "2026-07-13" },
  { id: "page_hanhtrinh_story", areaId: "hanhtrinh", parentPageId: "page_hanhtrinh", title: "Câu chuyện của tôi", route: "/portal/story", visible: true, sortOrder: 5, publishStatus: "Active", seoContextNote: "Không áp dụng. Lưu ý: KHÔNG liên quan Founder Story (đính chính MEDIA-SPR-202) — đây là nhật ký tăng trưởng cá nhân hoá của học viên.", workspaceOwner: "Journey & Community", updatedDate: "2026-07-13" },

  // Child Pages — Sứ mệnh Companion (1 route con thật)
  { id: "page_sumenh_hinhanh", areaId: "su-menh-companion", parentPageId: "page_su_menh_companion", title: "Companion qua hình ảnh", route: "/portal/su-menh-companion/companion-qua-hinh-anh", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng.", workspaceOwner: "Journey & Community", updatedDate: "2026-07-13" },

  // Child Page — Companion (1 route con thật, đính chính COMPANION-SPR-801
  // Task 1 — comment gốc dòng 57 claim Area "companion" không có route con,
  // SAI: /portal/ai-assistant là trang thật, được link từ CompanionSpace.tsx
  // (nút "Trò chuyện" trong panel Companion Presence toàn cục) + companion-identity.ts
  // (route-state map) — chỉ chưa từng được ghi vào Registry này.
  { id: "page_ai_assistant", areaId: "companion", parentPageId: "page_companion", title: "Companion (phòng chờ trò chuyện)", route: "/portal/ai-assistant", visible: true, sortOrder: 1, publishStatus: "Active", seoContextNote: "Không áp dụng — trang sau đăng nhập.", workspaceOwner: "Companion Studio", updatedDate: "2026-07-13" },
];
