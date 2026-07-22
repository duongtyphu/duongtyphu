"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Home,
  ClipboardList,
  Wallet,
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
  type LucideIcon,
} from "lucide-react";
import { adminNavGroups } from "@/lib/admin/nav";

/**
 * Đã dọn (audit menu Admin) — chỉ giữ icon cho route THẬT SỰ có trong
 * `adminNavGroups` (nav.ts). Trước đây có ~26 entry mồ côi trỏ route
 * admin cũ đã xoá (`/admin/portal-builder/*`, `/admin/roadmap`,
 * `/admin/daily-missions`, `/admin/prompts` (bản cũ, chưa có `/ckos/`),
 * `/admin/templates`, `/admin/ebooks`, `/admin/checklists`, `/admin/sop`,
 * `/admin/saved`, `/admin/affiliate*`, `/admin/digital-assets*`,
 * `/admin/premium`, `/admin/orders`, `/admin/coupons`, `/admin/services`,
 * `/admin/support`, `/admin/blog`, `/admin/case-study` (bản cũ),
 * `/admin/student-success` (bản cũ), `/admin/updates`, `/admin/community`,
 * `/admin/users`, `/admin/leads`, `/admin/reports`, `/admin/settings`) —
 * không phải link chết (object này chỉ tra icon cho item đã có trong
 * nav.ts, không tự render), nhưng là rác không dùng, đã xoá.
 *
 * Đồng thời PHÁT HIỆN VÀ SỬA gap thật: `/admin/home-cards` và toàn bộ 11
 * route `/admin/ckos/*` (kể cả `/admin/ckos` — CKOS Dashboard) trước đó
 * KHÔNG có icon nào — item hiện lên trong sidebar không có icon (không
 * crash, chỉ thiếu hình). Đã bổ sung đủ.
 *
 * Cập nhật (Việc 8): `/admin/updates`/`/admin/community` giờ là route
 * THẬT (nhóm "Cộng đồng") — đoạn "route cũ đã xoá" liệt kê ở trên chỉ
 * đúng tại thời điểm audit menu, không còn đúng nữa (cùng tình huống đã
 * gặp với `/admin/projects`, xem CLAUDE.md).
 */
const navIcons: Record<string, LucideIcon> = {
  "/admin/dashboard": LayoutDashboard,
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
  "/admin/course-pricing": Wallet,
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
                  hasActive ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {section.group}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <div className="my-2 h-px bg-gray-200" />
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
          ? "gemos-nav-active font-bold text-blue-700"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      } ${!showLabel ? "justify-center" : ""}`}
    >
      {active && <span className="gemos-nav-active-bar absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-full" style={{ width: 3 }} />}
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {showLabel && <span className="truncate">{item.label}</span>}
      {!showLabel && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 opacity-0 shadow-lg transition group-hover:opacity-100">
          {item.label}
        </span>
      )}
    </Link>
  );
}
