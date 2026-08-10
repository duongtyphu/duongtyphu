/**
 * Nguồn duy nhất cho điều hướng Portal & Admin 2.0.
 *
 * Sidebar Portal trong gói handoff có 4 biến thể (base / cụm Companion / cụm
 * Hệ sinh thái / trang chủ). So sánh 4 biến thể cho thấy chúng là **cùng một
 * cây nav** với hai cụm tự bung khi người dùng đang đứng trong cụm đó — phần
 * còn lại chỉ khác nhau ở vài nhãn ("Companion" vs "Companion AI", "Cộng đồng"
 * vs "Cộng đồng AI") do thiết kế lặp qua nhiều bản.
 *
 * Ở đây chuẩn hoá về MỘT cây nav + cơ chế bung theo `pathname`, dùng nhãn của
 * biến thể phổ biến nhất. Không dựng 4 sidebar rời, vì như vậy nhãn sẽ nhảy
 * khi điều hướng — lỗi sản phẩm, không phải chủ ý thiết kế.
 */

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  BookOpen,
  Briefcase,
  Brain,
  Building2,
  CreditCard,
  Crown,
  Flower2,
  GraduationCap,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  MessageSquare,
  Menu,
  NotebookPen,
  Plug,
  Route,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Target,
  LifeBuoy,
  TrendingUp,
  UserCog,
  Users,
  Wallet,
  Bell,
} from "lucide-react";

export const V2_PORTAL_BASE = "/v2";
export const V2_ADMIN_BASE = "/v2/admin";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /**
   * Cụm mà mục này thuộc về. Mục con của một cụm chỉ hiện khi `pathname` đang
   * nằm trong cụm đó (tái tạo hành vi sidebar tự bung của bản thiết kế).
   */
  group?: NavGroup;
};

export type NavGroup = "companion" | "ecosystem";

export type NavSection = {
  /** Nhãn nhóm in hoa phía trên (`.side-label`). Bỏ trống = không hiện nhãn. */
  label?: string;
  items: NavItem[];
};

/* ------------------------------------------------------------------ Portal */

const PORTAL_MAIN: NavItem[] = [
  { label: "Trang chủ", href: `${V2_PORTAL_BASE}/trang-chu`, icon: Home },

  // Cụm Companion — bung khi đang ở bất kỳ trang nào trong cụm.
  { label: "Companion AI", href: `${V2_PORTAL_BASE}/companion`, icon: Bot },
  {
    label: "Sứ mệnh Companion",
    href: `${V2_PORTAL_BASE}/su-menh-companion`,
    icon: Target,
    group: "companion",
  },
  {
    label: "Bộ nhớ & Cá nhân hoá",
    href: `${V2_PORTAL_BASE}/bo-nho-ca-nhan-hoa`,
    icon: Brain,
    group: "companion",
  },
  {
    label: "Nhật ký hội thoại",
    href: `${V2_PORTAL_BASE}/nhat-ky-hoi-thoai`,
    icon: MessageSquare,
    group: "companion",
  },
  {
    label: "Chiến lược cá nhân",
    href: `${V2_PORTAL_BASE}/chien-luoc-ca-nhan`,
    icon: Sparkles,
    group: "companion",
  },

  { label: "Hệ tri thức (CKOS)", href: `${V2_PORTAL_BASE}/he-tri-thuc`, icon: BookOpen },
  { label: "Học viện AI", href: `${V2_PORTAL_BASE}/hoc-vien-ai`, icon: GraduationCap },
  { label: "AI Workspace", href: `${V2_PORTAL_BASE}/ai-workspace`, icon: LayoutGrid },
  { label: "Dự án & Cơ hội", href: `${V2_PORTAL_BASE}/du-an-co-hoi`, icon: Briefcase },

  // Cụm Hệ sinh thái — bung khi đang ở trang đối tác hoặc trang affiliate con.
  {
    label: "DigiU",
    href: `${V2_PORTAL_BASE}/he-sinh-thai/digiu`,
    icon: Building2,
    group: "ecosystem",
  },
  {
    label: "SolarGroup",
    href: `${V2_PORTAL_BASE}/he-sinh-thai/solargroup`,
    icon: Building2,
    group: "ecosystem",
  },
  {
    label: "Ohana",
    href: `${V2_PORTAL_BASE}/he-sinh-thai/ohana`,
    icon: Building2,
    group: "ecosystem",
  },
  {
    label: "Các mô hình Affilate",
    href: `${V2_PORTAL_BASE}/affiliate/mo-hinh`,
    icon: Share2,
    group: "ecosystem",
  },
  {
    label: "Affilate sàn giao dịch",
    href: `${V2_PORTAL_BASE}/affiliate/san-giao-dich`,
    icon: Wallet,
    group: "ecosystem",
  },

  { label: "Premium", href: `${V2_PORTAL_BASE}/premium`, icon: Crown },
  { label: "Chương trình Affilate", href: `${V2_PORTAL_BASE}/affiliate`, icon: Share2 },
  { label: "Cộng đồng AI", href: `${V2_PORTAL_BASE}/cong-dong-ai`, icon: Users },
];

const PORTAL_QUICK: NavItem[] = [
  { label: "Nhật ký học tập", href: `${V2_PORTAL_BASE}/nhat-ky-hoc-tap`, icon: NotebookPen },
  { label: "Hành trình của tôi", href: `${V2_PORTAL_BASE}/hanh-trinh-cua-toi`, icon: Route },
  { label: "Khu vườn của bạn", href: `${V2_PORTAL_BASE}/khu-vuon-cua-ban`, icon: Flower2 },
];

export const PORTAL_NAV: NavSection[] = [
  { items: PORTAL_MAIN },
  { label: "Tiện ích nhanh", items: PORTAL_QUICK },
];

/**
 * Các tiền tố route quyết định một cụm có đang mở hay không. Cụm chỉ bung khi
 * `pathname` khớp một trong các tiền tố này.
 */
const GROUP_PREFIXES: Record<NavGroup, string[]> = {
  companion: [
    `${V2_PORTAL_BASE}/companion`,
    `${V2_PORTAL_BASE}/su-menh-companion`,
    `${V2_PORTAL_BASE}/bo-nho-ca-nhan-hoa`,
    `${V2_PORTAL_BASE}/nhat-ky-hoi-thoai`,
    `${V2_PORTAL_BASE}/chien-luoc-ca-nhan`,
  ],
  ecosystem: [
    `${V2_PORTAL_BASE}/he-sinh-thai`,
    `${V2_PORTAL_BASE}/du-an-co-hoi`,
    `${V2_PORTAL_BASE}/affiliate/mo-hinh`,
    `${V2_PORTAL_BASE}/affiliate/san-giao-dich`,
  ],
};

export function isGroupOpen(group: NavGroup, pathname: string): boolean {
  return GROUP_PREFIXES[group].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Một mục là "active" khi pathname trùng khớp chính xác, hoặc nằm trong nhánh
 * con của nó — nhưng chỉ khi mục đó không bị một mục khác dài hơn khớp tốt hơn.
 * `bestMatchHref` giải quyết trường hợp `/v2/affiliate` vs
 * `/v2/affiliate/mo-hinh`: không dùng nó thì cả hai cùng sáng.
 */
export function bestMatchHref(pathname: string, items: NavItem[]): string | null {
  let best: string | null = null;

  for (const item of items) {
    const matches = pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (matches && (best === null || item.href.length > best.length)) {
      best = item.href;
    }
  }

  return best;
}

/** Toàn bộ mục Portal ở dạng phẳng — dùng cho `bestMatchHref`. */
export const PORTAL_NAV_FLAT: NavItem[] = PORTAL_NAV.flatMap((section) => section.items);

/* ------------------------------------------------------------------- Admin */

export const ADMIN_NAV: NavSection[] = [
  {
    label: "Tổng quan",
    items: [
      { label: "Dashboard", href: `${V2_ADMIN_BASE}/dashboard`, icon: LayoutDashboard },
      { label: "Quản lý Menu", href: `${V2_ADMIN_BASE}/quan-ly-menu`, icon: Menu },
      { label: "Báo cáo & Analytics", href: `${V2_ADMIN_BASE}/bao-cao`, icon: BarChart3 },
      { label: "Thư viện Media", href: `${V2_ADMIN_BASE}/thu-vien-media`, icon: ImageIcon },
    ],
  },
  {
    label: "Landing Page",
    items: [
      { label: "Landing Page", href: `${V2_ADMIN_BASE}/landing-page`, icon: TrendingUp },
      { label: "Trang Pháp lý", href: `${V2_ADMIN_BASE}/trang-phap-ly`, icon: Shield },
    ],
  },
  {
    label: "Nội dung Portal",
    items: [
      { label: "Trang chủ", href: `${V2_ADMIN_BASE}/trang-chu`, icon: Home },
      { label: "Companion AI", href: `${V2_ADMIN_BASE}/companion`, icon: Bot },
      { label: "Hệ tri thức (CKOS)", href: `${V2_ADMIN_BASE}/he-tri-thuc`, icon: BookOpen },
      { label: "Học viện AI", href: `${V2_ADMIN_BASE}/hoc-vien-ai`, icon: GraduationCap },
      { label: "AI Workspace", href: `${V2_ADMIN_BASE}/ai-workspace`, icon: LayoutGrid },
      { label: "Dự án & Cơ hội", href: `${V2_ADMIN_BASE}/du-an-co-hoi`, icon: Briefcase },
      { label: "Premium", href: `${V2_ADMIN_BASE}/premium`, icon: Crown },
      { label: "Chương trình Affilate", href: `${V2_ADMIN_BASE}/affiliate`, icon: Share2 },
      { label: "Cộng đồng AI", href: `${V2_ADMIN_BASE}/cong-dong-ai`, icon: Users },
    ],
  },
  {
    label: "Tiện ích nhanh",
    items: [
      { label: "Nhật ký học tập", href: `${V2_ADMIN_BASE}/nhat-ky-hoc-tap`, icon: NotebookPen },
      { label: "Hành trình của tôi", href: `${V2_ADMIN_BASE}/hanh-trinh-cua-toi`, icon: Route },
      { label: "Khu vườn của bạn", href: `${V2_ADMIN_BASE}/khu-vuon-cua-ban`, icon: Flower2 },
    ],
  },
  {
    label: "Quản trị hệ thống",
    items: [
      { label: "Người dùng", href: `${V2_ADMIN_BASE}/nguoi-dung`, icon: UserCog },
      { label: "Thanh toán & Giao dịch", href: `${V2_ADMIN_BASE}/thanh-toan`, icon: CreditCard },
      { label: "Thông báo", href: `${V2_ADMIN_BASE}/thong-bao`, icon: Bell },
      { label: "Tích hợp & API", href: `${V2_ADMIN_BASE}/tich-hop-api`, icon: Plug },
      { label: "Hỗ trợ & Ticket", href: `${V2_ADMIN_BASE}/ho-tro`, icon: LifeBuoy },
      { label: "Cấu hình hệ thống", href: `${V2_ADMIN_BASE}/cau-hinh`, icon: Settings },
    ],
  },
];

export const ADMIN_NAV_FLAT: NavItem[] = ADMIN_NAV.flatMap((section) => section.items);

export const ADMIN_BACK_TO_PORTAL = {
  label: "Quay lại Portal",
  href: `${V2_PORTAL_BASE}/trang-chu`,
  icon: ArrowLeft,
};

/** Dùng cho breadcrumb `.crumb` ở `PageHead` của trang admin. */
export const ADMIN_SECTION_OF: Record<string, string> = Object.fromEntries(
  ADMIN_NAV.flatMap((section) =>
    section.items.map((item) => [item.href, section.label ?? "Admin"]),
  ),
);
