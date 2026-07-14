export type AdminNavItem = { label: string; href: string; comingSoon?: boolean };
export type AdminNavGroup = { group: string | null; items: AdminNavItem[] };

/**
 * Sidebar Admin — PMO DIRECTIVE "ADMIN CMS v1.1 UI REFINEMENT" (Task 2,
 * PMO APPROVAL). 13 mục cấp 1, tiếng Việt, đi theo Portal thật thay vì tên
 * Workspace/Registry kỹ thuật — xem docs/admin/ADMIN_CMS_INFORMATION_ARCHITECTURE_v2.md,
 * ADMIN_CMS_SIDEBAR_SIMPLIFICATION.md, ADMIN_CMS_ROUTE_MAPPING.md,
 * ADMIN_CMS_MENU_RENAME.md (đã PMO duyệt).
 *
 * Không route nào bị xoá URL — mục ẩn khỏi Sidebar vẫn hoạt động khi truy
 * cập trực tiếp (đúng Task 10: ưu tiên gộp/ẩn/đổi tên, không tạo route mới
 * chỉ để chia menu). Danh sách đầy đủ mục đã ẩn/gộp: xem báo cáo PMO đính
 * kèm sprint này.
 */
export const adminNavGroups: AdminNavGroup[] = [
  { group: null, items: [{ label: "Tổng quan", href: "/admin/founder" }] },
  {
    group: "Website & Thương hiệu",
    items: [
      { label: "Website", href: "/admin/website" },
      { label: "Thương hiệu", href: "/admin/brand" },
      { label: "Thư viện Media", href: "/admin/media-center" },
    ],
  },
  { group: null, items: [{ label: "Portal", href: "/admin/portal" }] },
  { group: null, items: [{ label: "Hệ tri thức AI", href: "/admin/ckos" }] },
  { group: null, items: [{ label: "Học viện AI", href: "/admin/academy" }] },
  { group: null, items: [{ label: "AI Workspace", href: "/admin/ai-workspace" }] },
  { group: null, items: [{ label: "Dự án & Cơ hội", href: "/admin/projects-opportunities" }] },
  { group: null, items: [{ label: "Premium", href: "/admin/premium" }] },
  { group: null, items: [{ label: "Companion", href: "/admin/companion-studio" }] },
  { group: null, items: [{ label: "Hành trình & Cộng đồng", href: "/admin/journey" }] },
  { group: null, items: [{ label: "Người dùng", href: "/admin/users" }] },
  { group: null, items: [{ label: "Duyệt & Xuất bản", href: "/admin/founder/review-queue" }] },
  { group: null, items: [{ label: "Cài đặt", href: "/admin/settings" }] },
];
