"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Cpu,
  Library,
  Notebook,
  GraduationCap,
  TrendingUp,
  Users,
  Sparkles,
  Compass,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { portalNavGroups } from "@/lib/site";

const navIcons: Record<string, LucideIcon> = {
  "/portal": Home,
  "/portal/khong-gian-ai": Cpu,
  "/portal/library": Library,
  "/portal/news": Notebook,
  "/portal/academy": GraduationCap,
  "/portal/opportunities": TrendingUp,
  "/portal/community": Users,
  "/portal/companion": Sparkles,
  "/portal/journey": Compass,
  "/portal/premium": Crown,
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

  return (
    <nav aria-label="Điều hướng Portal">
      {portalNavGroups.map((section, si) => (
        <div key={si} className={si > 0 ? "mt-4" : ""}>
          {section.group && showLabels && (
            <p className="mb-1 px-3 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              {section.emoji ? `${section.emoji} ${section.group}` : section.group}
            </p>
          )}
          <div className="space-y-0.5">
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
        </div>
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
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
        active ? "gemos-nav-active font-bold text-blue-700" : "font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      } ${!showLabel ? "justify-center" : ""}`}
    >
      {active && (
        <span
          className="gemos-nav-active-bar absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-full"
          style={{ width: 3.5 }}
        />
      )}
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
