"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Rocket,
  Map,
  GraduationCap,
  Library,
  Swords,
  Wallet,
  Compass,
  Crown,
  Bot,
  MessageCircle,
  Trophy,
  Newspaper,
  CircleUser,
  Bookmark,
  LifeBuoy,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { portalNavGroups } from "@/lib/site";

const navIcons: Record<string, LucideIcon> = {
  "/portal": LayoutDashboard,
  "/portal/start-here": Rocket,
  "/portal/roadmap": Map,
  "/portal/academy": GraduationCap,
  "/portal/library": Library,
  "/portal/practice": Swords,
  "/portal/earn": Wallet,
  "/portal/opportunities": Compass,
  "/portal/premium": Crown,
  "/portal/ai-assistant": Bot,
  "/portal/community": MessageCircle,
  "/portal/achievements": Trophy,
  "/portal/updates": Newspaper,
  "/portal/account": CircleUser,
  "/portal/saved": Bookmark,
  "/portal/support": LifeBuoy,
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

  const activeGroupName = useMemo(() => {
    for (const section of portalNavGroups) {
      if (section.items.some((item) => isItemActive(pathname, item.href))) {
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
    <nav className="space-y-1" aria-label="Điều hướng Portal">
      {portalNavGroups.map((section, i) => {
        const groupName = section.group ?? `group-${i}`;
        const isOpen = showLabels ? (openGroups[groupName] ?? true) : true;
        const hasActive = section.items.some((item) => isItemActive(pathname, item.href));

        return (
          <div key={groupName} className={i > 0 ? "pt-3" : ""}>
            {showLabels ? (
              <button
                type="button"
                onClick={() => toggleGroup(groupName)}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                  hasActive ? "text-white/80" : "text-white/35 hover:text-white/60"
                }`}
              >
                {section.group}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
            ) : (
              i > 0 && <div className="my-2 h-px bg-white/10" />
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
        active ? "gemos-nav-active text-white" : "text-white/75 hover:bg-white/[0.06] hover:text-white"
      } ${!showLabel ? "justify-center" : ""}`}
    >
      {active && (
        <span
          className="gemos-nav-active-bar absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-full"
          style={{ width: 3 }}
        />
      )}
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
