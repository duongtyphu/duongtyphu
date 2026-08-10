"use client";

import { usePathname } from "next/navigation";

import {
  PORTAL_NAV,
  PORTAL_NAV_FLAT,
  bestMatchHref,
  isGroupOpen,
} from "@/components/v2/nav/nav-config";
import { BrandMark } from "./BrandMark";
import { NavLink } from "./NavLink";
import { PromoUpgrade } from "./PromoUpgrade";
import { ThemeToggle } from "./ThemeToggle";

export function PortalSidebar({ isPremium }: { isPremium: boolean }) {
  const pathname = usePathname();
  const activeHref = bestMatchHref(pathname, PORTAL_NAV_FLAT);

  return (
    <aside className="v2-sidebar-scroll flex w-[var(--v2-sidebar-w)] shrink-0 flex-col overflow-y-auto bg-[var(--v2-sidebar)] px-[14px] py-5 text-[#cbc6e8]">
      <BrandMark />

      {PORTAL_NAV.map((section, index) => {
        // Mục thuộc một cụm chỉ hiện khi người dùng đang đứng trong cụm đó.
        const visible = section.items.filter(
          (item) => !item.group || isGroupOpen(item.group, pathname),
        );

        if (visible.length === 0) return null;

        return (
          <div key={section.label ?? `section-${index}`}>
            {section.label ? (
              <div className="mx-3 mt-[10px] mb-[6px] text-[11px] font-bold tracking-[0.08em] text-[#6f6a91] uppercase">
                {section.label}
              </div>
            ) : null}
            <nav className="mb-[18px] flex flex-col gap-[2px]">
              {visible.map((item) => (
                <NavLink
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  active={activeHref === item.href}
                  indented={Boolean(item.group)}
                />
              ))}
            </nav>
          </div>
        );
      })}

      {isPremium ? <div className="mt-auto" /> : <PromoUpgrade />}
      <ThemeToggle />
    </aside>
  );
}
