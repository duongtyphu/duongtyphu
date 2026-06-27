"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gem,
  Compass,
  BookOpen,
  Rocket,
  Globe,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { portalNavGroups } from "@/lib/site";

const navIcons: Record<string, LucideIcon> = {
  "/portal": Gem,
  "/portal/journey": Compass,
  "/portal/knowledge": BookOpen,
  "/portal/build": Rocket,
  "/portal/connect": Globe,
  "/portal/legacy": Crown,
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
  const showLabels = variant === "mobile" || !collapsed;
  const items = portalNavGroups.flatMap((section) => section.items);

  return (
    <nav className="space-y-1.5" aria-label="Điều hướng Portal">
      {items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={isItemActive(pathname, item.href)}
          showLabel={showLabels}
          onNavigate={onNavigate}
        />
      ))}
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
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
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
