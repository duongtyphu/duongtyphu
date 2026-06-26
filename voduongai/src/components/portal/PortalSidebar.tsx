"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Map,
  GraduationCap,
  Rocket,
  UserCircle,
  Sparkles,
  Wrench,
  FileText,
  Gift,
  ListChecks,
  ClipboardList,
  Users,
  Crown,
  Package,
  Handshake,
  Boxes,
  MessageCircle,
  CircleUser,
  Newspaper,
  Percent,
  LifeBuoy,
  PenSquare,
  TrendingUp,
  BadgeCheck,
  Megaphone,
  Rocket as RocketStart,
  Bookmark,
  ChevronDown,
  Layers,
  Building2,
  Bitcoin,
  Link2,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { portalNavGroups } from "@/lib/site";

const navIcons: Record<string, LucideIcon> = {
  "/portal": LayoutDashboard,
  "/portal/start-here": RocketStart,
  "/portal/saved": Bookmark,
  "/portal/roadmap": Map,
  "/portal/ai-academy": GraduationCap,
  "/portal/vdai-academy": Rocket,
  "/portal/personal-brand": UserCircle,
  "/portal/practice": PenSquare,
  "/portal/prompts": Sparkles,
  "/portal/tools": Wrench,
  "/portal/templates": FileText,
  "/portal/resources": Gift,
  "/portal/checklists": ListChecks,
  "/portal/sop": ClipboardList,
  "/portal/affiliate-hub": Users,
  "/portal/referral": Percent,
  "/portal/premium": Crown,
  "/portal/my-products": Package,
  "/portal/services": Handshake,
  "/portal/digital-assets": Boxes,
  "/portal/digital-assets/category/digiu": Layers,
  "/portal/digital-assets/category/equity": Building2,
  "/portal/digital-assets/category/crypto": Bitcoin,
  "/portal/digital-assets/category/blockchain": Link2,
  "/portal/digital-assets/category/trading": LineChart,
  "/portal/community": MessageCircle,
  "/portal/case-studies": TrendingUp,
  "/portal/student-success": BadgeCheck,
  "/portal/updates": Megaphone,
  "/portal/support": LifeBuoy,
  "/portal/account": CircleUser,
  "/blog": Newspaper,
};

function isItemActive(pathname: string, href: string) {
  if (href === "/portal") return pathname === "/portal";
  return pathname === href || pathname.startsWith(href + "/");
}

type PortalSidebarProps = {
  collapsed?: boolean;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function PortalSidebar({ collapsed = false, variant = "desktop", onNavigate }: PortalSidebarProps) {
  const pathname = usePathname() || "/portal";

  const topItems = portalNavGroups[0].items.concat(
    portalNavGroups[1].items,
    portalNavGroups[2].items
  );
  const groupedSections = portalNavGroups.slice(3, -1);
  const tailItems = portalNavGroups[portalNavGroups.length - 1].items;

  const activeGroupName = useMemo(() => {
    for (const section of groupedSections) {
      if (section.items.some((item) => isItemActive(pathname, item.href))) {
        return section.group;
      }
    }
    return null;
  }, [pathname, groupedSections]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeGroupName) {
      setOpenGroups((prev) => ({ ...prev, [activeGroupName]: true }));
    }
  }, [activeGroupName]);

  function toggleGroup(name: string) {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  const showLabels = variant === "mobile" || !collapsed;

  return (
    <nav className="space-y-4" aria-label="Điều hướng Portal">
      <div className="space-y-1">
        {topItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isItemActive(pathname, item.href)}
            showLabel={showLabels}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="space-y-1">
        {groupedSections.map((section, i) => {
          const groupName = section.group ?? `group-${i}`;
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
      </div>

      <div className="space-y-1 border-t border-white/10 pt-3">
        {tailItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isItemActive(pathname, item.href)}
            showLabel={showLabels}
            onNavigate={onNavigate}
          />
        ))}
      </div>
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
