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
  Compass,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { portalNavGroups } from "@/lib/site";

/** Companion dùng icon riêng, tách biệt hẳn khỏi icon user/profile — thể
 * hiện "người đồng hành", không phải tài khoản cá nhân. "Sứ mệnh Companion"
 * dùng Sparkles — cùng biểu tượng đã dùng ngay trong chính trang đó (tâm
 * The Companion Genome™) thay vì Cloud (dễ hiểu nhầm thành lưu trữ đám
 * mây/thời tiết) — Sparkles gợi "ánh sáng dẫn đường/khởi nguồn", đúng tinh
 * thần sứ mệnh/triết lý, không phải một tiện ích. */
const navIcons: Record<string, LucideIcon> = {
  "/portal": Home,
  "/portal/companion": HeartHandshake,
  "/portal/aiworkspace": Cpu,
  "/portal/ckos": Library,
  "/portal/hocvienai": GraduationCap,
  "/portal/duan-cohoi": Rocket,
  "/portal/premium": Crown,
  "/portal/hanhtrinhcuatoi": Compass,
  "/portal/su-menh-companion": Sparkles,
  "/portal/congdongai": Users,
};

/** Gradient thương hiệu của chữ "Companion" — cùng gradient đã dùng ở
 * hero "/portal/su-menh-companion" (linear-gradient #111827 → #2563EB →
 * #7C3AED → #F97316), không phát minh màu mới. */
const COMPANION_GRADIENT = "linear-gradient(90deg, #111827, #2563EB, #7C3AED, #F97316)";

/** Portal 4.0 Menu Update: chữ "Companion" trong cả 2 mục ("Companion" và
 * "Sứ mệnh Companion") dùng gradient thương hiệu khi mục đang KHÔNG active
 * — để nổi bật giữa các mục còn lại. Khi người dùng đang ở đúng trang đó,
 * chữ "Companion" trở về màu xanh giống mọi mục active khác trong menu,
 * nhất quán với hành vi active-state chung của sidebar. */
function renderLabel(label: string, active: boolean) {
  if (!label.includes("Companion")) return label;
  const [before, after] = label.split("Companion");
  return (
    <>
      {before}
      {active ? (
        <span>Companion</span>
      ) : (
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: COMPANION_GRADIENT }}
        >
          Companion
        </span>
      )}
      {after}
    </>
  );
}

// Khu vườn của bạn dùng tông xanh lá riêng cho active state (đúng
// Design Reference VDAI-GARDEN-001), khác với tông xanh dương mặc định
// của các mục Portal khác.
const activeToneOverrides: Record<string, string> = {
  "/portal/khuvuoncuaban": "bg-green-50 font-bold text-green-700",
};

// "Dự án & Cơ hội" và "Premium" gắn dấu V thương hiệu (đúng logo VO DUONG
// AI: chữ V xanh + chấm cam) — theo yêu cầu IA & Route Localization
// Refactor v1.0, dùng lại chính asset logo đã có ở Header/Footer.
const V_BADGE_ROUTES = new Set(["/portal/duan-cohoi", "/portal/premium"]);

function VBrandBadge() {
  return (
    <svg width="12" height="12" viewBox="0 0 32 32" fill="none" className="ml-1 shrink-0" aria-hidden="true">
      <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
      <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
    </svg>
  );
}

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
    <nav aria-label="Điều hướng Học viện">
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
  const idleClass = "font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900";
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={!showLabel ? item.label : undefined}
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
        active ? activeClass : idleClass
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
      {showLabel && (
        <span className="flex min-w-0 items-center truncate">
          <span className="truncate">{renderLabel(item.label, active)}</span>
          {V_BADGE_ROUTES.has(item.href) && <VBrandBadge />}
        </span>
      )}
      {!showLabel && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 opacity-0 shadow-lg transition group-hover:opacity-100">
          {item.label}
        </span>
      )}
    </Link>
  );
}
