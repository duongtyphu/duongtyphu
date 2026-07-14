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

/**
 * WEB-SPR-201 (Website Workspace Foundation, brief Task 3 "Navigation
 * Management" yêu cầu rõ: Header Menu, Footer Menu, Portal Navigation,
 * External Links) mở rộng thêm "Footer" và "External" — trước đó
 * (WEB-SPR-003) chỉ có "Header" (mainNav) và "Sidebar" (đã là Portal
 * Navigation thật — portalNavSections). "Footer" trước đây cố ý để
 * Shared Sections sở hữu (WEB-SPR-004) — nay Navigation Management sở
 * hữu MENU chân trang (link danh sách), Shared Sections vẫn sở hữu phần
 * COPY/branding của khối Footer (mô tả thương hiệu) — ranh giới rõ:
 * Navigation = link, Shared Sections = nội dung văn bản.
 */
export const NAVIGATION_LOCATIONS = ["Header", "Sidebar", "Footer", "External"] as const;
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

/**
 * `icon` (WEB-SPR-202, Task 2 "chỉnh icon") — tên icon Lucide (VD "Home",
 * "HeartHandshake") hoặc ghi chú icon inline SVG thật, KHÔNG phải component
 * — Registry chỉ lưu metadata, không render icon thật (không Icon Picker
 * trực quan). Để trống với mục không có icon thật trong code (VD Header
 * mainNav — text-only, không icon).
 *
 * `visible` (Task 2 "ẩn/hiện") — tách RIÊNG khỏi `status` ("trạng thái
 * publish"): trước WEB-SPR-202, Registry chỉ có `status`
 * (Draft/Active/Inactive/Archived) gộp chung 2 khái niệm. Nay `visible`
 * là toggle ẩn/hiện độc lập (cùng field `visible: boolean` đã dùng ở
 * WebsitePage — WEB-SPR-002), `status` tiếp tục là vòng đời publish.
 */
export type NavigationItem = {
  id: string;
  groupId: string;
  label: string;
  url: string;
  icon: string;
  visible: boolean;
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
  return {
    groupId,
    label: "",
    url: "",
    icon: "",
    visible: true,
    sortOrder: 0,
    visibilityRule: "Everyone",
    status: "Draft",
    updatedDate: today,
  };
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
  {
    id: "navgroup_seed_footer_hocvienai",
    name: "Footer — Học viện AI",
    location: "Footer",
    description: "Cột 1 menu chân trang — nguồn: src/components/site/Footer.tsx (columns[0]).",
    sortOrder: 4,
    status: "Active",
    updatedDate: "2026-07-12",
  },
  {
    id: "navgroup_seed_footer_tainguyen",
    name: "Footer — Tài nguyên",
    location: "Footer",
    description: "Cột 2 menu chân trang — nguồn: src/components/site/Footer.tsx (columns[1]).",
    sortOrder: 5,
    status: "Active",
    updatedDate: "2026-07-12",
  },
  {
    id: "navgroup_seed_external_social",
    name: "External — Mạng xã hội",
    location: "External",
    description:
      "Link mạng xã hội chính thức. Nguồn thật (WEB-SPR-202, sửa lại từ WEB-SPR-201): src/components/site/Footer.tsx render ĐỘNG từ settings.facebookUrl/youtubeUrl/tiktokUrl/zaloUrl (Supabase SiteSettings, Admin-editable qua /admin/settings) — mặc định lấy giá trị từ siteConfig.links (src/lib/site.ts) nếu Founder chưa đổi. Cùng bộ giá trị này còn được render độc lập ở Footer.tsx, /contact, /portal/congdongai, TrustStats.tsx (nhiều nơi hardcode cùng 1 nguồn, không qua Registry này).",
    sortOrder: 6,
    status: "Active",
    updatedDate: "2026-07-12",
  },
];

export const NAVIGATION_ITEMS_SEED: NavigationItem[] = [
  // Main Nav (Header) — src/lib/site.ts mainNav, đúng thứ tự. Không có icon
  // trong code thật (text-only).
  { id: "navitem_seed_1", groupId: "navgroup_seed_main_nav", label: "Trang chủ", url: "/", icon: "", visible: true, sortOrder: 1, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_2", groupId: "navgroup_seed_main_nav", label: "Học viện AI", url: "/portal/hocvienai", icon: "", visible: true, sortOrder: 2, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_3", groupId: "navgroup_seed_main_nav", label: "AI Workspace", url: "/portal/aiworkspace", icon: "", visible: true, sortOrder: 3, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_4", groupId: "navgroup_seed_main_nav", label: "Blog AI", url: "/blogai", icon: "", visible: true, sortOrder: 4, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  // Portal Sidebar — Chính — src/lib/portal/hubs.ts portalNavSections[0].items.
  // `icon` = tên Lucide THẬT lấy từ navIcons map trong PortalSidebar.tsx —
  // phát hiện WEB-SPR-202: Registry trước đó không có field icon dù Portal
  // Sidebar render icon per-item thật, khác Header (text-only).
  { id: "navitem_seed_5", groupId: "navgroup_seed_sidebar_main", label: "Trang chủ Học viện", url: "/portal", icon: "Home", visible: true, sortOrder: 1, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_6", groupId: "navgroup_seed_sidebar_main", label: "Companion", url: "/portal/companion", icon: "HeartHandshake", visible: true, sortOrder: 2, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_7", groupId: "navgroup_seed_sidebar_main", label: "Hệ tri thức AI (CKOS)", url: "/portal/ckos", icon: "Library", visible: true, sortOrder: 3, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_8", groupId: "navgroup_seed_sidebar_main", label: "Học viện AI", url: "/portal/hocvienai", icon: "GraduationCap", visible: true, sortOrder: 4, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_9", groupId: "navgroup_seed_sidebar_main", label: "AI Workspace", url: "/portal/aiworkspace", icon: "Cpu", visible: true, sortOrder: 5, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_10", groupId: "navgroup_seed_sidebar_main", label: "Dự án & Cơ hội", url: "/portal/duan-cohoi", icon: "Rocket", visible: true, sortOrder: 6, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_11", groupId: "navgroup_seed_sidebar_main", label: "Premium", url: "/portal/premium", icon: "Crown", visible: true, sortOrder: 7, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_12", groupId: "navgroup_seed_sidebar_main", label: "Hành trình của tôi", url: "/portal/hanhtrinhcuatoi", icon: "Compass", visible: true, sortOrder: 8, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  // Portal Sidebar — Phụ — src/lib/portal/hubs.ts portalNavSections[1].items.
  { id: "navitem_seed_13", groupId: "navgroup_seed_sidebar_secondary", label: "Sứ mệnh Companion", url: "/portal/su-menh-companion", icon: "Sparkles", visible: true, sortOrder: 1, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_14", groupId: "navgroup_seed_sidebar_secondary", label: "Cộng đồng", url: "/portal/congdongai", icon: "Users", visible: true, sortOrder: 2, visibilityRule: "Logged-in Only", status: "Active", updatedDate: "2026-07-12" },
  // Footer — Học viện AI — src/components/site/Footer.tsx columns[0].links.
  // ⚠️ Phát hiện: link "Hệ tri thức AI (CKOS)" ở Footer trỏ /portal/hetrithucai,
  // KHÁC với /portal/ckos dùng ở Sidebar (navitem_seed_7) — cùng khái niệm CKOS
  // nhưng 2 route khác nhau, củng cố phát hiện đã ghi nhận ở ADM-SPR-200.
  { id: "navitem_seed_15", groupId: "navgroup_seed_footer_hocvienai", label: "Companion", url: "/portal/companion", icon: "", visible: true, sortOrder: 1, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_16", groupId: "navgroup_seed_footer_hocvienai", label: "Hệ tri thức AI (CKOS)", url: "/portal/hetrithucai", icon: "", visible: true, sortOrder: 2, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_17", groupId: "navgroup_seed_footer_hocvienai", label: "Kỹ năng AI", url: "/portal/hocvienai", icon: "", visible: true, sortOrder: 3, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_18", groupId: "navgroup_seed_footer_hocvienai", label: "Thực hành AI - Dự án & Cơ hội", url: "/portal/duan-cohoi", icon: "", visible: true, sortOrder: 4, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_19", groupId: "navgroup_seed_footer_hocvienai", label: "Premium", url: "/portal/premium", icon: "", visible: true, sortOrder: 5, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  // Footer — Tài nguyên — src/components/site/Footer.tsx columns[1].links.
  { id: "navitem_seed_20", groupId: "navgroup_seed_footer_tainguyen", label: "Nhật ký học tập", url: "/portal/nhatkyhoctap", icon: "", visible: true, sortOrder: 1, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_21", groupId: "navgroup_seed_footer_tainguyen", label: "Hành trình của tôi", url: "/portal/hanhtrinhcuatoi", icon: "", visible: true, sortOrder: 2, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_22", groupId: "navgroup_seed_footer_tainguyen", label: "Khu vườn của bạn", url: "/portal/khuvuoncuaban", icon: "", visible: true, sortOrder: 3, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_23", groupId: "navgroup_seed_footer_tainguyen", label: "Cộng đồng AI", url: "/portal/congdongai", icon: "", visible: true, sortOrder: 4, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  // External — Mạng xã hội — src/components/site/Footer.tsx getSocials()
  // (WEB-SPR-202, sửa lại từ WEB-SPR-201: nguồn thật là Footer.tsx động
  // theo settings.*Url, không phải literal siteConfig.links). `icon` ghi
  // chú màu nền + loại icon SVG thật (không lưu SVG thật — Registry chỉ
  // metadata). Thêm "Email" — bị bỏ sót ở WEB-SPR-201 dù có trong
  // getSocials() thật.
  { id: "navitem_seed_24", groupId: "navgroup_seed_external_social", label: "Facebook", url: "https://www.facebook.com/duong.vv", icon: "SVG inline, nền #1877F2", visible: true, sortOrder: 1, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_25", groupId: "navgroup_seed_external_social", label: "YouTube", url: "https://www.youtube.com/@voduongofficial", icon: "SVG inline, nền #FF0000", visible: true, sortOrder: 2, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_26", groupId: "navgroup_seed_external_social", label: "TikTok", url: "https://www.tiktok.com/@vdai_academy", icon: "SVG inline, nền #000000", visible: true, sortOrder: 3, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  { id: "navitem_seed_27", groupId: "navgroup_seed_external_social", label: "Zalo", url: "https://zalo.me/0909150587", icon: "SVG chữ \"Z\", nền #0068FF", visible: true, sortOrder: 4, visibilityRule: "Everyone", status: "Active", updatedDate: "2026-07-12" },
  {
    id: "navitem_seed_28",
    groupId: "navgroup_seed_external_social",
    label: "Email",
    url: "mailto:{settings.adminEmailNotify}",
    icon: "SVG phong bì, nền rgba(255,255,255,0.12)",
    visible: true,
    sortOrder: 5,
    visibilityRule: "Everyone",
    status: "Active",
    updatedDate: "2026-07-12",
  },
];
