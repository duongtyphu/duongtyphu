export type HubModule = {
  label: string;
  description: string;
  href?: string;
};

export type PortalHub = {
  key: string;
  label: string;
  href: string;
  heroTitle: string;
  heroSubtitle: string;
  modules: HubModule[];
};

export const portalHubs: PortalHub[] = [
  {
    key: "home",
    label: "Gem Home",
    href: "/portal",
    heroTitle: "Gem Home",
    heroSubtitle: "Mỗi ngày bắt đầu bằng một bước nhỏ để viên ngọc của bạn sáng hơn.",
    modules: [],
  },
  {
    key: "journey",
    label: "Hành trình",
    href: "/portal/hanhtrinhcuatoi",
    heroTitle: "Hành trình của bạn",
    heroSubtitle: "Mỗi viên ngọc quý cần thời gian để mài giũa — đây là lộ trình của riêng bạn.",
    modules: [
      { label: "Bắt đầu", description: "Lộ trình nhập môn dành cho người mới.", href: "/portal/start-here" },
      { label: "Lộ trình cá nhân", description: "7 bước từ làm quen AI đến mở rộng hệ sinh thái.", href: "/portal/roadmap" },
      { label: "Human Growth", description: "Theo dõi 5 chỉ số trưởng thành của bạn — xem ngay phía trên." },
      { label: "30 ngày đầu tiên", description: "Các cột mốc nhỏ trên hành trình khởi động của bạn." },
      { label: "Giai đoạn hiện tại", description: "Xem giai đoạn hiện tại và mục tiêu kế tiếp." },
      { label: "Chứng chỉ", description: "Chứng chỉ ghi nhận hành trình bạn đã đi qua." },
    ],
  },
];

// Portal 4.0 Content Reconstruction: đã xoá 4 "OS hub" song song với sidebar
// chính (knowledge/build/connect/legacy) — đây là hệ thống điều hướng thứ 2
// chạy song song gây nhầm lẫn (nhiều module không có href thật, xem
// PORTAL_CONTENT_RECONSTRUCTION_PLAN.md mục B.9). portalNavSections bên dưới
// là nguồn điều hướng DUY NHẤT của Portal.

export function getHub(key: string) {
  return portalHubs.find((h) => h.key === key);
}

// ─────────────────────────────────────────────────────────
// Portal Knowledge Architecture — 3 Hành trình
// Sprint: Portal Knowledge Architecture
// Xem: docs/PORTAL_KNOWLEDGE_ARCHITECTURE.md
// ─────────────────────────────────────────────────────────

export type NavSection = {
  /** null = không hiển thị group header (dùng cho Trang chủ). */
  group: string | null;
  emoji?: string;
  items: { label: string; href: string }[];
};

/**
 * Cấu trúc sidebar — danh sách phẳng theo đúng thứ tự sản phẩm yêu cầu,
 * không còn tiêu đề nhóm (Học hỏi/Xây dựng/Premium/Trưởng thành đã bỏ).
 * Nhóm thứ 2 (Nhật ký học tập/Hành trình của tôi/Khu vườn của bạn) chỉ
 * tách riêng bằng một đường kẻ ngăn cách trong `PortalSidebar.tsx`, không
 * phải section có điều kiện mở khóa — cả 3 mục luôn hiển thị bình thường.
 *
 * Đây là nguồn sự thật duy nhất cho PortalSidebar.
 * Mọi Project mới KHÔNG được thêm item vào đây từ page.tsx riêng
 * (theo Portal Architecture Freeze — docs/THE_PORTAL_ARCHITECTURE_FREEZE.md).
 */
/**
 * Portal 4.0 Final Reconstruction — Menu Reconstruction. Cấu trúc menu
 * cuối cùng, đóng băng: 8 mục chính + 2 mục phụ sau dấu ngăn cách. "Nhật
 * ký học tập" và "Khu vườn của bạn" không còn là mục nav riêng — cả hai
 * giờ là 2 trong 5 thẻ của Journey Hub DUY NHẤT tại "Hành trình của tôi"
 * (route của chúng vẫn tồn tại, chỉ không xuất hiện trực tiếp trên sidebar
 * nữa). "Companion" trỏ tới trải nghiệm AI Presence mới; "Sứ mệnh
 * Companion" (triết lý, không đụng vào) là mục riêng, tách biệt hẳn.
 */
export const portalNavSections: NavSection[] = [
  {
    group: null,
    items: [
      { label: "Trang chủ Học viện", href: "/portal" },
      { label: "Companion", href: "/portal/companion" },
      { label: "Hệ tri thức AI", href: "/portal/hetrithucai" },
      { label: "Học viện AI", href: "/portal/hocvienai" },
      { label: "AI Workspace", href: "/portal/aiworkspace" },
      { label: "Dự án & Cơ hội", href: "/portal/duan-cohoi" },
      { label: "Premium", href: "/portal/premium" },
      { label: "Hành trình của tôi", href: "/portal/hanhtrinhcuatoi" },
    ],
  },
  {
    group: null,
    items: [
      { label: "Sứ mệnh Companion", href: "/portal/su-menh-companion" },
      { label: "Cộng đồng", href: "/portal/congdongai" },
    ],
  },
];
