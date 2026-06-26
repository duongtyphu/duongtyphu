"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  LayoutPanelLeft,
  Rocket,
  ListChecks,
  Image as ImageIcon,
  Star,
  MousePointerClick,
  Target,
  Map,
  ClipboardList,
  GraduationCap,
  Users,
  Wallet,
  UserCircle,
  FolderKanban,
  Sparkles,
  Wrench,
  FileText,
  BookOpen,
  ClipboardCheck,
  Bookmark,
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
  Settings,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { adminNavGroups } from "@/lib/admin/nav";

const navIcons: Record<string, LucideIcon> = {
  "/admin/dashboard": LayoutDashboard,
  "/admin/portal-builder": LayoutPanelLeft,
  "/admin/portal-builder/start-here": Rocket,
  "/admin/portal-builder/today-actions": ListChecks,
  "/admin/portal-builder/banner": ImageIcon,
  "/admin/portal-builder/featured": Star,
  "/admin/portal-builder/cta": MousePointerClick,
  "/admin/portal-builder/user-goals": Target,
  "/admin/roadmap": Map,
  "/admin/daily-missions": ClipboardList,
  "/admin/ai-academy": GraduationCap,
  "/admin/affiliate-academy": Users,
  "/admin/course-pricing": Wallet,
  "/admin/personal-brand": UserCircle,
  "/admin/projects": FolderKanban,
  "/admin/prompts": Sparkles,
  "/admin/tools": Wrench,
  "/admin/templates": FileText,
  "/admin/ebooks": BookOpen,
  "/admin/checklists": ClipboardCheck,
  "/admin/sop": ClipboardList,
  "/admin/saved": Bookmark,
  "/admin/affiliate-hub": Handshake,
  "/admin/affiliate/products": Package,
  "/admin/affiliate/links": Link2,
  "/admin/affiliate/analytics": BarChart3,
  "/admin/digital-assets": Boxes,
  "/admin/digital-assets/categories": Layers,
  "/admin/digital-assets/projects": Building2,
  "/admin/digital-assets/links": Bitcoin,
  "/admin/digital-assets/articles": LineChart,
  "/admin/digital-assets/analytics": FileBarChart,
  "/admin/premium": Crown,
  "/admin/orders": ShoppingCart,
  "/admin/coupons": Percent,
  "/admin/services": Handshake,
  "/admin/support": LifeBuoy,
  "/admin/blog": Newspaper,
  "/admin/case-study": TrendingUp,
  "/admin/student-success": BadgeCheck,
  "/admin/updates": Megaphone,
  "/admin/community": MessageCircle,
  "/admin/users": Users,
  "/admin/leads": Target,
  "/admin/reports": FileBarChart,
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
  item: { label: string; href: string };
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
      {showLabel && <span className="truncate">{item.label}</span>}
      {!showLabel && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#0B1F4D] px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition group-hover:opacity-100">
          {item.label}
        </span>
      )}
    </Link>
  );
}
