"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ADMIN_BACK_TO_PORTAL,
  ADMIN_NAV,
  ADMIN_NAV_FLAT,
  bestMatchHref,
} from "@/components/v2/nav/nav-config";
import { BrandMark } from "./BrandMark";
import { NavLink } from "./NavLink";

export function AdminSidebar() {
  const pathname = usePathname();
  const activeHref = bestMatchHref(pathname, ADMIN_NAV_FLAT);
  const BackIcon = ADMIN_BACK_TO_PORTAL.icon;

  return (
    <aside className="v2-sidebar-scroll flex w-[var(--v2-sidebar-w)] shrink-0 flex-col overflow-y-auto bg-[var(--v2-sidebar)] px-[14px] py-5 text-[#cbc6e8]">
      <BrandMark href={ADMIN_BACK_TO_PORTAL.href} />

      <div className="mx-2 mb-[18px] rounded-lg border border-[rgba(226,178,60,.35)] bg-[rgba(226,178,60,.14)] py-[6px] text-center text-[11px] font-extrabold tracking-[0.05em] text-[var(--v2-gold)]">
        ADMIN PANEL
      </div>

      {ADMIN_NAV.map((section) => (
        <div key={section.label}>
          <div className="px-3 pt-[14px] pb-[6px] text-[10.5px] font-extrabold tracking-[0.07em] text-[#6f699a] uppercase">
            {section.label}
          </div>
          <nav className="mb-[6px] flex flex-col gap-[2px]">
            {section.items.map((item) => (
              <NavLink
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                active={activeHref === item.href}
              />
            ))}
          </nav>
        </div>
      ))}

      <Link
        href={ADMIN_BACK_TO_PORTAL.href}
        className="mt-auto flex items-center gap-[9px] rounded-[9px] border border-white/12 px-3 py-[11px] text-[13px] font-bold text-[#cbc6e8] transition-colors hover:bg-[var(--v2-sidebar-hover)] hover:text-white"
      >
        <BackIcon className="h-[15px] w-[15px]" aria-hidden="true" />
        {ADMIN_BACK_TO_PORTAL.label}
      </Link>
    </aside>
  );
}
