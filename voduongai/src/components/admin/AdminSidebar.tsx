"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Home,
  ClipboardList,
  Wallet,
  Crown,
  FolderKanban,
  Sparkles,
  Wrench,
  FileText,
  LayoutTemplate,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Bookmark,
  TrendingUp,
  BadgeCheck,
  ChevronDown,
  Bot,
  Library,
  Dna,
  Images,
  Eye,
  Feather,
  Compass,
  Sprout,
  Briefcase,
  HelpCircle,
  Workflow,
  Users,
  Newspaper,
  Star,
  Layers,
  Building2,
  Bitcoin,
  Link2,
  LineChart,
  UserCog,
  Globe,
  MonitorSmartphone,
  Landmark,
  Palette,
  Settings,
  Hourglass,
  Receipt,
  UserPlus,
  LifeBuoy,
  ListTodo,
  Bell,
  History,
  UserCircle,
  ShieldCheck,
  IdCard,
  Gem,
  KeyRound,
  Smartphone,
  Activity,
  Navigation,
  PanelTop,
  Megaphone,
  Search,
  CreditCard,
  Ticket,
  Users2,
  Fingerprint,
  PackageOpen,
  SlidersHorizontal,
  Plug,
  ScrollText,
  DatabaseBackup,
  Server,
  Mail,
  MousePointerClick,
  BarChart3,
  Route,
  ShoppingBag,
  Award,
  Share2,
  ShoppingCart,
  Percent,
  ArrowUpDown,
  type LucideIcon,
} from "lucide-react";
import { adminWorkspaces, type AdminNavItem } from "@/lib/admin/nav";

/**
 * KIẾN TRÚC ADMIN V2.0 — sidebar giờ có 3 tầng: Workspace (8 mục, icon
 * riêng, `workspaceIcons` bên dưới) → SubGroup (chỉ "Học viện" có, 10 mục,
 * dùng lại đúng 10 nhóm Portal cũ) → Item (đúng href/label cũ, KHÔNG đổi).
 *
 * Item nào `comingSoon: true` (xem `nav.ts`) dùng icon `Hourglass` chung +
 * badge nhỏ "Sắp ra mắt" — không cần khai icon riêng cho từng route
 * placeholder (29 route). 3 route MỚI có chức năng thật (Đơn hàng/Khách
 * hàng tiềm năng/Hỗ trợ khách hàng) có icon riêng trong `navIcons`.
 *
 * Lịch sử dọn dẹp `navIcons` (audit menu Admin, trước Admin v2.0): đã xoá
 * ~26 entry mồ côi trỏ route cũ đã xoá từ lâu — không lặp lại lịch sử đó ở
 * đây, xem CLAUDE.md nếu cần tra cứu.
 */
const workspaceIcons: Record<string, LucideIcon> = {
  "tong-quan": LayoutDashboard,
  "nguoi-dung": Users,
  website: MonitorSmartphone,
  "hoc-vien": Landmark,
  "van-hanh": Briefcase,
  affiliate: Share2,
  marketing: TrendingUp,
  "thuong-hieu-media": Palette,
  "he-thong": Settings,
};

const navIcons: Record<string, LucideIcon> = {
  "/admin/dashboard": LayoutDashboard,
  "/admin/tong-quan/cong-viec": ListTodo,
  "/admin/tong-quan/thong-bao": Bell,
  "/admin/tong-quan/hoat-dong-gan-day": History,
  "/admin/users": UserCog,
  "/admin/nguoi-dung/ho-so": UserCircle,
  "/admin/nguoi-dung/vai-tro-phan-quyen": ShieldCheck,
  "/admin/nguoi-dung/thanh-vien": IdCard,
  "/admin/nguoi-dung/premium-membership": Gem,
  "/admin/nguoi-dung/phien-dang-nhap": KeyRound,
  "/admin/nguoi-dung/thiet-bi": Smartphone,
  "/admin/nguoi-dung/hoat-dong-nguoi-dung": Activity,
  "/admin/landing": Globe,
  "/admin/website/noi-dung-website": FileText,
  "/admin/website/dieu-huong": Navigation,
  "/admin/website/header-footer": PanelTop,
  "/admin/website/popup-banner": Megaphone,
  "/admin/website/seo-website": Search,
  "/admin/home-cards": Home,
  "/admin/companion": Bot,
  "/admin/ckos": Library,
  "/admin/ckos/prompts": Sparkles,
  "/admin/ckos/sop": ClipboardList,
  "/admin/ckos/resources": FileText,
  "/admin/ckos/templates": LayoutTemplate,
  "/admin/ckos/ebooks": BookOpen,
  "/admin/ckos/checklists": ClipboardCheck,
  "/admin/ckos/lessons": GraduationCap,
  "/admin/ckos/knowledge-collections": Bookmark,
  "/admin/ckos/case-studies": TrendingUp,
  "/admin/ckos/best-practices": BadgeCheck,
  "/admin/hocvienai/work-needs": Briefcase,
  "/admin/hocvienai/faq": HelpCircle,
  "/admin/tools": Wrench,
  "/admin/aiworkspace/recommended-workspace": Sparkles,
  "/admin/aiworkspace/ai-workflow-sections": Workflow,
  "/admin/duan-cohoi": FolderKanban,
  "/admin/duan-cohoi/digiu": Layers,
  "/admin/duan-cohoi/solargroup": Building2,
  "/admin/duan-cohoi/blockchain-crypto": Bitcoin,
  "/admin/duan-cohoi/lam-affilate": Link2,
  "/admin/duan-cohoi/sangiaodich": LineChart,
  "/admin/duan-cohoi/affiliate-hub-sections": Route,
  "/admin/duan-cohoi/affiliate-products": ShoppingBag,
  "/admin/duan-cohoi/affiliate-hub-top-products": Award,
  "/admin/course-pricing": Wallet,
  "/admin/premium/dashboard": Crown,
  "/admin/su-menh-companion/live-edit": Dna,
  "/admin/su-menh-companion/flipbook": Images,
  "/admin/hanh-trinh-cua-toi/mirror": Eye,
  "/admin/hanh-trinh-cua-toi/journal": BookOpen,
  "/admin/hanh-trinh-cua-toi/story": Feather,
  "/admin/hanh-trinh-cua-toi/map": Compass,
  "/admin/hanh-trinh-cua-toi/garden": Sprout,
  "/admin/community": Users,
  "/admin/updates": Newspaper,
  "/admin/student-success-stories": Star,
  // Vận hành — 3 route mới có dữ liệu thật (Admin v2.0).
  "/admin/van-hanh/don-hang": Receipt,
  "/admin/van-hanh/thanh-toan": CreditCard,
  "/admin/van-hanh/ma-giam-gia": Ticket,
  "/admin/van-hanh/khach-hang-tiem-nang": UserPlus,
  // "/admin/van-hanh/tiep-thi-lien-ket" đã chuyển sang Workspace "Affiliate"
  // (route cũ giờ redirect, không còn nav item riêng — xem nav.ts).
  "/admin/affiliate": Share2,
  "/admin/affiliate/thanh-vien": IdCard,
  "/admin/affiliate/referral": Users2,
  "/admin/affiliate/don-hang": ShoppingCart,
  "/admin/affiliate/hoa-hong": Wallet,
  "/admin/affiliate/cau-hinh-hoa-hong": Percent,
  "/admin/affiliate/yeu-cau-thanh-toan": CreditCard,
  "/admin/affiliate/bao-cao": BarChart3,
  "/admin/van-hanh/ho-tro-khach-hang": LifeBuoy,
  "/admin/thuong-hieu-media/brand-studio": Palette,
  "/admin/thuong-hieu-media/media-center": Images,
  "/admin/thuong-hieu-media/logo-nhan-dien": Fingerprint,
  "/admin/thuong-hieu-media/tai-nguyen-thuong-hieu": PackageOpen,
  "/admin/thuong-hieu-media/tai-lieu": FileText,
  "/admin/he-thong/cau-hinh-chung": SlidersHorizontal,
  "/admin/he-thong/api-tich-hop": Plug,
  "/admin/he-thong/uu-tien-ai": ArrowUpDown,
  "/admin/he-thong/nhat-ky-he-thong": ScrollText,
  "/admin/he-thong/sao-luu": DatabaseBackup,
  "/admin/he-thong/moi-truong": Server,
  "/admin/marketing/chien-dich": Megaphone,
  "/admin/marketing/email-marketing": Mail,
  "/admin/marketing/cta": MousePointerClick,
  "/admin/marketing/chuyen-doi": TrendingUp,
  "/admin/marketing/phan-tich-marketing": BarChart3,
};

function isItemActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

// Hàm thuần (không phải hook) — đặt ngoài component để tránh React Compiler
// không tối ưu được `useMemo` có nhiều điểm `return` sớm lồng trong vòng lặp.
function findActiveNav(pathname: string): { activeWorkspaceId: string | null; activeSubGroupKey: string | null } {
  for (const ws of adminWorkspaces) {
    for (const item of ws.items ?? []) {
      if (isItemActive(pathname, item.href)) return { activeWorkspaceId: ws.id, activeSubGroupKey: null };
    }
    for (const sg of ws.subGroups ?? []) {
      for (const item of sg.items) {
        if (isItemActive(pathname, item.href)) {
          return { activeWorkspaceId: ws.id, activeSubGroupKey: `${ws.id}::${sg.label}` };
        }
      }
    }
  }
  return { activeWorkspaceId: null, activeSubGroupKey: null };
}

type AdminSidebarProps = {
  collapsed?: boolean;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function AdminSidebar({ collapsed = false, variant = "desktop", onNavigate }: AdminSidebarProps) {
  const pathname = usePathname() || "/admin/dashboard";
  const showLabels = variant === "mobile" || !collapsed;

  const { activeWorkspaceId, activeSubGroupKey } = useMemo(() => findActiveNav(pathname), [pathname]);

  const [openWorkspaces, setOpenWorkspaces] = useState<Record<string, boolean>>({});
  const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Tự mở Workspace/SubGroup chứa route đang active khi điều hướng — phản
    // ứng theo thay đổi route, không phải tính toán thuần lúc render.
    if (activeWorkspaceId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenWorkspaces((prev) => ({ ...prev, [activeWorkspaceId]: true }));
    }
    if (activeSubGroupKey) {
      setOpenSubGroups((prev) => ({ ...prev, [activeSubGroupKey]: true }));
    }
  }, [activeWorkspaceId, activeSubGroupKey]);

  function toggleWorkspace(id: string) {
    setOpenWorkspaces((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleSubGroup(key: string) {
    setOpenSubGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <nav className="space-y-1" aria-label="Điều hướng Admin">
      {adminWorkspaces.map((ws) => {
        const WsIcon = workspaceIcons[ws.id];
        const hasActive = ws.id === activeWorkspaceId;
        const isOpen = showLabels ? (openWorkspaces[ws.id] ?? hasActive) : true;

        return (
          <div key={ws.id}>
            {showLabels ? (
              <button
                type="button"
                onClick={() => toggleWorkspace(ws.id)}
                aria-expanded={isOpen}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  hasActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {WsIcon && <WsIcon className="h-4 w-4 shrink-0" />}
                <span className="flex-1 truncate text-left">{ws.label}</span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <div className="my-2 flex justify-center" title={ws.label}>
                {WsIcon && <WsIcon className={`h-4 w-4 ${hasActive ? "text-blue-700" : "text-gray-400"}`} />}
              </div>
            )}

            {isOpen && (
              <div className={showLabels ? "space-y-0.5 pl-1" : "space-y-1"}>
                {(ws.items ?? []).map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={isItemActive(pathname, item.href)}
                    showLabel={showLabels}
                    onNavigate={onNavigate}
                  />
                ))}

                {(ws.subGroups ?? []).map((sg) => {
                  const key = `${ws.id}::${sg.label}`;
                  const sgHasActive = key === activeSubGroupKey;
                  const sgOpen = showLabels ? (openSubGroups[key] ?? sgHasActive) : true;

                  return (
                    <div key={key}>
                      {showLabels ? (
                        <button
                          type="button"
                          onClick={() => toggleSubGroup(key)}
                          aria-expanded={sgOpen}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                            sgHasActive ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          <span className="truncate">{sg.label}</span>
                          <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${sgOpen ? "rotate-180" : ""}`} />
                        </button>
                      ) : (
                        <div className="my-1.5 h-px bg-gray-200" />
                      )}
                      {sgOpen && (
                        <div className="space-y-0.5">
                          {sg.items.map((item) => (
                            <NavLink
                              key={item.href}
                              item={item}
                              active={isItemActive(pathname, item.href)}
                              showLabel={showLabels}
                              onNavigate={onNavigate}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function NavLink({
  item,
  active,
  showLabel,
  onNavigate,
}: {
  item: AdminNavItem;
  active: boolean;
  showLabel: boolean;
  onNavigate?: () => void;
}) {
  const Icon = navIcons[item.href] ?? (item.comingSoon ? Hourglass : undefined);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={!showLabel ? item.label : undefined}
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "gemos-nav-active font-bold text-blue-700"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      } ${!showLabel ? "justify-center" : ""}`}
    >
      {active && <span className="gemos-nav-active-bar absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-full" style={{ width: 3 }} />}
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {showLabel && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
      {showLabel && item.comingSoon && (
        <span className="shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-500">
          Sắp ra mắt
        </span>
      )}
      {!showLabel && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 opacity-0 shadow-lg transition group-hover:opacity-100">
          {item.label}
          {item.comingSoon && <span className="ml-1 text-gray-400">(Sắp ra mắt)</span>}
        </span>
      )}
    </Link>
  );
}
