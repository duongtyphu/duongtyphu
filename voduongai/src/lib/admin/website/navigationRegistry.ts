/**
 * Website Navigation Registry — shared data model (WEB-SPR-003).
 *
 * Foundation only, per brief: KHÔNG Menu Builder, KHÔNG Drag & Drop, KHÔNG
 * Mega Menu Builder, KHÔNG Dynamic Menu Engine, KHÔNG AI Menu, KHÔNG
 * Permission Engine. Sắp xếp dùng field số `sortOrder` nhập tay, không có
 * UI kéo-thả. Persisted via the existing `useCollection()` two-tier
 * mechanism (localStorage tier — "website-navigation-groups"/"-items"
 * chưa nằm trong SUPABASE_COLLECTIONS, cùng bridge pattern đã dùng cho
 * Website Page Registry ở WEB-SPR-002).
 *
 * Hai thực thể, đúng theo Task 2/3:
 * - NavigationGroup: một menu (Header hoặc Sidebar) — tương ứng `mainNav`
 *   (src/lib/site.ts) và các nhóm trong `portalNavSections`
 *   (src/lib/portal/hubs.ts).
 * - NavigationItem: một mục menu, thuộc một Group, không lồng cấp con
 *   (flat — không có Mega Menu/sub-menu ở Foundation này).
 */

export const NAVIGATION_LOCATIONS = ["Header", "Sidebar"] as const;
export type NavigationLocation = (typeof NAVIGATION_LOCATIONS)[number];

/**
 * Navigation Status (Task 6) — vòng đời riêng của Navigation, khác lifecycle
 * Draft→Review→Approved→Published→Archived của Website Page (WEB-SPR-002).
 * Navigation là kết cấu điều hướng, không qua approval nội dung nhiều bước —
 * chỉ cần Draft (đang soạn) → Active (đang dùng) → Inactive (tạm ẩn) →
 * Archived (không dùng nữa). Dùng lại đúng 4 tone đã có sẵn trong
 * Badge.tsx (Draft/Active/Inactive/Archived) — không cần thêm tone mới.
 */
export const NAVIGATION_STATUSES = ["Draft", "Active", "Inactive", "Archived"] as const;
export type NavigationStatus = (typeof NAVIGATION_STATUSES)[number];

/**
 * Visibility Rule Foundation (Task 4) — CHỈ là field metadata mô tả ý định
 * hiển thị, KHÔNG có Permission Engine đứng sau để thực thi thật (không
 * route nào kiểm tra field này). Ghi rõ trong UI để không ai hiểu nhầm đây
 * là access control đang hoạt động.
 */
export const VISIBILITY_RULES = ["Everyone", "Logged-in Only", "Admin Only"] as const;
export type VisibilityRule = (typeof VISIBILITY_RULES)[number];

export type NavigationGroup = {
  id: string;
  name: string;
  location: NavigationLocation;
  description: string;
  sortOrder: number;
  status: NavigationStatus;
  updatedDate: string;
};

export type NavigationItem = {
  id: string;
  groupId: string;
  label: string;
  url: string;
  sortOrder: number;
  visibilityRule: VisibilityRule;
  status: NavigationStatus;
  updatedDate: string;
};

export function emptyNavigationGroup(location: NavigationLocation = "Header"): Omit<NavigationGroup, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { name: "", location, description: "", sortOrder: 0, status: "Draft", updatedDate: today };
}

export function emptyNavigationItem(groupId: string): Omit<NavigationItem, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { groupId, label: "", url: "", sortOrder: 0, visibilityRule: "Everyone", status: "Draft", updatedDate: today };
}

export const NAVIGATION_GROUPS_COLLECTION_KEY = "website-navigation-groups";
export const NAVIGATION_ITEMS_COLLECTION_KEY = "website-navigation-items";

/**
 * Mock Data (Task 7) — seed phản ánh đúng nội dung menu THẬT đang chạy trên
 * Portal (`mainNav` trong src/lib/site.ts, `portalNavSections` trong
 * src/lib/portal/hubs.ts), không phải dữ liệu bịa/test ngẫu nhiên — theo
 * đúng lưu ý của Founder ("bám sát portal đang có ở hiện tại", "dữ liệu cũ
 * chỉ là test chứ chưa phải thật"). Đây là bản sao có thể chỉnh sửa trong
 * Registry để Founder xem/thao tác thử — CHƯA nối dây để Portal đọc từ đây
 * (Consumer = 0, giống ghi nhận ở website-workspace.md §7).
 */
export const NAVIGATION_GROUPS_SEED: NavigationGroup[] = [
  {
    id: "navgroup_seed_main_nav",
    name: "Main Nav (Header)",
    location: "Header",
    description: "Menu header trang công khai — nguồn: src/lib/site.ts (mainNav).",
    sortOrder: 1,
    status: "Active",
    updatedDate: "2026-07-12",
  },
  {
    id: "navgroup_seed_sidebar_main",
    name: "Portal Sidebar — Chính",
    location: "Sidebar",
    description: "8 mục chính của sidebar Portal — nguồn: src/lib/portal/hubs.ts (portalNavSections[0]).",
    sortOrder: 2,
    status: "Active",
    updatedDate: "2026-07-12",
  },
  {
    id: "navgroup_seed_sidebar_secondary",
    name: "Portal Sidebar — Phụ",
    location: "Sidebar",
    description:
      "2 mục phụ sau dấu ngăn cách của sidebar Portal — nguồn: src/lib/portal/hubs.ts (portalNavSections[1]).",
    sortOrder: 3,
    status: "Active",
    updatedDate: "2026-07-12",
  },
];

export const NAVIGATION_ITEMS_SEED: NavigationItem[] = [
  // Main Nav (Header) — src/lib/site.ts mainNav, đúng thứ tự.
  { id: "navitem_seed_1", groupId: "navgroup_seed_main_nav", label: "Trang chủ", url: "/", sortOrder: 1, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_2", groupId: "navgroup_seed_main_nav", label: "Học viện AI", url: "/portal/hocvienai", sortOrder: 2, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_3", groupId: "navgroup_seed_main_nav", label: "AI Workspace", url: "/portal/aiworkspace", sortOrder: 3, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_4", groupId: "navgroup_seed_main_nav", label: "Blog AI", url: "/blogai", sortOrder: 4, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  // Portal Sidebar — Chính — src/lib/portal/hubs.ts portalNavSections[0].items.
  { id: "navitem_seed_5", groupId: "navgroup_seed_sidebar_main", label: "Trang chủ Học viện", url: "/portal", sortOrder: 1, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_6", groupId: "navgroup_seed_sidebar_main", label: "Companion", url: "/portal/companion", sortOrder: 2, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_7", groupId: "navgroup_seed_sidebar_main", label: "Hệ tri thức AI (CKOS)", url: "/portal/ckos", sortOrder: 3, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_8", groupId: "navgroup_seed_sidebar_main", label: "Học viện AI", url: "/portal/hocvienai", sortOrder: 4, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_9", groupId: "navgroup_seed_sidebar_main", label: "AI Workspace", url: "/portal/aiworkspace", sortOrder: 5, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_10", groupId: "navgroup_seed_sidebar_main", label: "Dự án & Cơ hội", url: "/portal/duan-cohoi", sortOrder: 6, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_11", groupId: "navgroup_seed_sidebar_main", label: "Premium", url: "/portal/premium", sortOrder: 7, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_12", groupId: "navgroup_seed_sidebar_main", label: "Hành trình của tôi", url: "/portal/hanhtrinhcuatoi", sortOrder: 8, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  // Portal Sidebar — Phụ — src/lib/portal/hubs.ts portalNavSections[1].items.
  { id: "navitem_seed_13", groupId: "navgroup_seed_sidebar_secondary", label: "Sứ mệnh Companion", url: "/portal/su-menh-companion", sortOrder: 1, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_14", groupId: "navgroup_seed_sidebar_secondary", label: "Cộng đồng", url: "/portal/congdongai", sortOrder: 2, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
];
