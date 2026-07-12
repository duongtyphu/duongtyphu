"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Globe,
  Palette,
  LayoutPanelLeft,
  Rocket,
  ListChecks,
  Image as ImageIcon,
  Star,
  MousePointerClick,
  Target,
  Map,
  ClipboardList,
  Users,
  Wallet,
  FolderKanban,
  Sparkles,
  Wrench,
  FileText,
  BookOpen,
  ClipboardCheck,
  Bookmark,
  Library,
  Handshake,
  Package,
  Link2,
  BarChart3,
  Boxes,
  Layers,
  Building2,
  Bitcoin,
  LineChart,
  FileBarChart,
  Crown,
  ShoppingCart,
  Percent,
  LifeBuoy,
  Newspaper,
  TrendingUp,
  BadgeCheck,
  Megaphone,
  MessageCircle,
  Bot,
  Search,
  Settings,
  ChevronDown,
  Brain,
  Flag,
  Workflow,
  Gauge,
  Award,
  HelpCircle,
  Navigation,
  Home,
  File,
  LayoutGrid,
  ArrowRightLeft,
  Type,
  Shapes,
  Share2,
  type LucideIcon,
} from "lucide-react";
import { adminNavGroups, type AdminNavItem } from "@/lib/admin/nav";

const navIcons: Record<string, LucideIcon> = {
  "/admin/dashboard": LayoutDashboard,
  "/admin/founder": Crown,
  "/admin/founder/owners": Users,
  "/admin/founder/search": Search,
  "/admin/founder/review-queue": ClipboardCheck,
  "/admin/portal": LayoutDashboard,
  "/admin/portal/areas": Map,
  "/admin/portal/pages": FileText,
  "/admin/portal/content": Library,
  "/admin/portal/areas?area=home": Home,
  "/admin/portal/areas?area=companion": Bot,
  "/admin/portal/areas?area=ckos": Brain,
  "/admin/portal/areas?area=hocvienai": BookOpen,
  "/admin/portal/areas?area=aiworkspace": Sparkles,
  "/admin/portal/areas?area=duan-cohoi": Handshake,
  "/admin/portal/areas?area=premium": Crown,
  "/admin/portal/areas?area=hanhtrinh": Map,
  "/admin/portal/areas?area=su-menh-companion": Bot,
  "/admin/portal/areas?area=congdongai": Users,
  "/admin/ai-workspace": Sparkles,
  "/admin/journey": Map,
  "/admin/website": Globe,
  "/admin/website/pages": FileText,
  "/admin/website/navigation": Navigation,
  "/admin/website/homepage": Home,
  "/admin/website/landing-pages": Rocket,
  "/admin/website/static-pages": File,
  "/admin/website/shared-sections": LayoutGrid,
  "/admin/website/seo": Search,
  "/admin/website/redirect": ArrowRightLeft,
  "/admin/website/global-settings": Settings,
  "/admin/brand": Palette,
  "/admin/brand/logo": ImageIcon,
  "/admin/brand/wordmark": Type,
  "/admin/brand/typography": Type,
  "/admin/brand/color-palette": Palette,
  "/admin/brand/theme": Sparkles,
  "/admin/brand/icons": Shapes,
  "/admin/brand/open-graph": Share2,
  "/admin/brand/assets": Library,
  "/admin/brand/settings": Settings,
  "/admin/media-center": ImageIcon,
  "/admin/portal-builder": LayoutPanelLeft,
  "/admin/portal-builder/start-here": Rocket,
  "/admin/portal-builder/today-actions": ListChecks,
  "/admin/portal-builder/banner": ImageIcon,
  "/admin/portal-builder/featured": Star,
  "/admin/portal-builder/cta": MousePointerClick,
  "/admin/portal-builder/user-goals": Target,
  "/admin/roadmap": Map,
  "/admin/daily-missions": ClipboardList,
  "/admin/course-pricing": Wallet,
  "/admin/projects": FolderKanban,
  "/admin/knowledge-seed": Sparkles,
  "/admin/ckos": Brain,
  "/admin/ckos/goals": Flag,
  "/admin/ckos/workflows": Workflow,
  "/admin/ckos/evaluations": Gauge,
  "/admin/ckos/best-practices": Award,
  "/admin/ckos/faqs": HelpCircle,
  "/admin/prompts": Sparkles,
  "/admin/tools": Wrench,
  "/admin/templates": FileText,
  "/admin/ebooks": BookOpen,
  "/admin/checklists": ClipboardCheck,
  "/admin/sop": ClipboardList,
  "/admin/resources": Library,
  "/admin/saved": Bookmark,
  "/admin/affiliate-hub": Handshake,
  "/admin/affiliate-hub/top-products": TrendingUp,
  "/admin/affiliate/products": Package,
  "/admin/affiliate/links": Link2,
  "/admin/affiliate/analytics": BarChart3,
  "/admin/digital-assets": Boxes,
  "/admin/digital-assets/category/digiu": Layers,
  "/admin/digital-assets/category/equity": Building2,
  "/admin/digital-assets/category/crypto": Bitcoin,
  "/admin/digital-assets/category/blockchain": Link2,
  "/admin/digital-assets/category/trading": LineChart,
  "/admin/digital-assets/links": Link2,
  "/admin/digital-assets/projects": FolderKanban,
  "/admin/digital-assets/articles": FileText,
  "/admin/digital-assets/categories": Layers,
  "/admin/digital-assets/analytics": FileBarChart,
  "/admin/premium": Crown,
  "/admin/orders": ShoppingCart,
  "/admin/coupons": Percent,
  "/admin/services": Handshake,
  "/admin/support": LifeBuoy,
  "/admin/leads": Target,
  "/admin/blog": Newspaper,
  "/admin/case-study": TrendingUp,
  "/admin/student-success": BadgeCheck,
  "/admin/updates": Megaphone,
  "/admin/news": Newspaper,
  "/admin/community": MessageCircle,
  "/admin/companion-studio": Bot,
  "/admin/users": Users,
  "/admin/reports": FileBarChart,
  "/admin/seo": Search,
  "/admin/settings": Settings,
};

function isItemActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

type AdminSidebarProps = {
  collapsed?: boolean;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function AdminSidebar({ collapsed = false, variant = "desktop", onNavigate }: AdminSidebarProps) {
  const pathname = usePathname() || "/admin/dashboard";

  const activeGroupName = useMemo(() => {
    for (const section of adminNavGroups) {
      if (section.group && section.items.some((item) => isItemActive(pathname, item.href))) {
        return section.group;
      }
    }
    return null;
  }, [pathname]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Auto-expands the group containing the active route on navigation;
    // this is a reaction to a route change, not a pure render computation.
    if (activeGroupName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenGroups((prev) => ({ ...prev, [activeGroupName]: true }));
    }
  }, [activeGroupName]);

  function toggleGroup(name: string) {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  const showLabels = variant === "mobile" || !collapsed;

  return (
    <nav className="space-y-1" aria-label="Điều hướng Admin">
      {adminNavGroups.map((section, i) => {
        if (!section.group) {
          return (
            <div key={`top-${i}`} className="space-y-1 pb-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isItemActive(pathname, item.href)}
                  showLabel={showLabels}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          );
        }

        const groupName = section.group;
        const isOpen = showLabels ? (openGroups[groupName] ?? section.group === activeGroupName) : true;
        const hasActive = section.items.some((item) => isItemActive(pathname, item.href));

        return (
          <div key={groupName}>
            {showLabels ? (
              <button
                type="button"
                onClick={() => toggleGroup(groupName)}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                  hasActive ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {section.group}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <div className="my-2 h-px bg-white/10" />
            )}
            {isOpen && (
              <div className="space-y-1">
                {section.items.map((item) => (
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
  const Icon = navIcons[item.href];
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={!showLabel ? item.label : undefined}
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-brand-blue/15 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      } ${!showLabel ? "justify-center" : ""}`}
    >
      {active && <span className="absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-full bg-brand-blue" style={{ width: 3 }} />}
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {showLabel && (
        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate">{item.label}</span>
          {item.comingSoon && (
            <span className="shrink-0 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-orange">
              Sắp ra mắt
            </span>
          )}
        </span>
      )}
      {!showLabel && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy-soft px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition group-hover:opacity-100">
          {item.label}
          {item.comingSoon ? " · Sắp ra mắt" : ""}
        </span>
      )}
    </Link>
  );
}
