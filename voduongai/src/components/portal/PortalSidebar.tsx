"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  HeartHandshake,
  Cpu,
  Library,
  GraduationCap,
  Rocket,
  Crown,
  Users,
  Notebook,
  Compass,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { portalNavGroups } from "@/lib/site";

/** Companion dùng icon riêng, tách biệt hẳn khỏi icon user/profile — thể
 * hiện "người đồng hành", không phải tài khoản cá nhân. */
const navIcons: Record<string, LucideIcon> = {
  "/portal": Home,
  "/portal/companion": HeartHandshake,
  "/portal/khong-gian-ai": Cpu,
  "/portal/library": Library,
  "/portal/academy": GraduationCap,
  "/portal/opportunities": Rocket,
  "/portal/premium": Crown,
  "/portal/community": Users,
  "/portal/news": Notebook,
  "/portal/journey": Compass,
  "/portal/khu-vuon-cua-ban": Leaf,
};

// Khu vườn của bạn dùng tông xanh lá riêng cho active state (đúng
// Design Reference VDAI-GARDEN-001), khác với tông xanh dương mặc định
// của các mục Portal khác.
const activeToneOverrides: Record<string, string> = {
  "/portal/khu-vuon-cua-ban": "bg-green-50 font-bold text-green-700",
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
        <div key={si} className={si > 0 ? "relative mt-5 pt-4" : ""}>
          {si > 0 && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-blue/90 to-transparent shadow-[0_0_14px_1.5px_rgba(91,140,255,0.65)]"
            />
          )}
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
  const activeOverride = activeToneOverrides[item.href];
  const activeClass = activeOverride ?? "gemos-nav-active font-bold text-blue-700";
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={!showLabel ? item.label : undefined}
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
        active ? activeClass : "font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      } ${!showLabel ? "justify-center" : ""}`}
    >
      {active && (
        <span
          className={`absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-full ${
            activeOverride ? "bg-green-500" : "gemos-nav-active-bar"
          }`}
          style={{ width: 3.5 }}
        />
      )}
      {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />}
      {showLabel && <span className="truncate">{item.label}</span>}
      {!showLabel && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 opacity-0 shadow-lg transition group-hover:opacity-100">
          {item.label}
        </span>
      )}
    </Link>
  );
}
