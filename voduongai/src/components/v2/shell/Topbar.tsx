"use client";

import Link from "next/link";
import { Bell, Crown, Search } from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";

export type TopbarUser = {
  name: string;
  initials: string;
  /** Nhãn gói hiển thị cạnh tên: "Premium", "Free", "Super Admin"... */
  planLabel: string;
};

/** Topbar dùng chung. Portal và Admin khác nhau ở phần bên phải, không phải khung. */
export function Topbar({
  variant,
  user,
  searchPlaceholder,
  notificationCount = 0,
}: {
  variant: "portal" | "admin";
  user: TopbarUser;
  searchPlaceholder: string;
  notificationCount?: number;
}) {
  const isAdmin = variant === "admin";

  return (
    <header className="sticky top-0 z-[5] flex items-center gap-4 border-b border-[var(--v2-line)] bg-[var(--v2-surface)] px-7 py-4">
      {isAdmin ? (
        <div className="flex max-w-[420px] flex-1 items-center gap-[10px] rounded-[10px] border border-[var(--v2-line)] bg-[var(--v2-bg)] px-[14px] py-[9px]">
          <Search className="h-4 w-4 shrink-0 text-[var(--v2-muted)]" aria-hidden="true" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="flex-1 border-none bg-transparent text-[13px] outline-none"
          />
          <kbd className="rounded-[5px] border border-[var(--v2-line)] bg-[var(--v2-surface)] px-[6px] py-[2px] text-[11px] text-[var(--v2-muted)]">
            ⌘ K
          </kbd>
        </div>
      ) : (
        <div className="relative max-w-[640px] flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--v2-muted)]"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full rounded-[10px] border border-[var(--v2-line)] bg-[var(--v2-bg)] py-[10px] pr-[14px] pl-[38px] text-[13.5px] focus:border-[var(--v2-violet)] focus:outline-2 focus:outline-[var(--v2-violet-light)]"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-4">
        {isAdmin ? (
          <div className="flex items-center gap-[6px] rounded-lg bg-[#e6f7ed] px-3 py-[6px] text-[11.5px] font-bold text-[var(--v2-green)]">
            <span className="h-[6px] w-[6px] rounded-full bg-[var(--v2-green)]" aria-hidden="true" />
            Production
          </div>
        ) : (
          <Link
            href={`${V2_PORTAL_BASE}/premium`}
            className="flex items-center gap-[7px] rounded-[9px] border-[1.5px] border-[var(--v2-gold)] bg-[#fffaf0] px-4 py-[9px] text-[13px] font-bold whitespace-nowrap text-[#a9822c] transition-[transform,box-shadow,background] duration-150 hover:-translate-y-px hover:bg-[#fff3d9] hover:shadow-[0_6px_14px_rgba(226,178,60,.35)] active:translate-y-0 active:scale-[.97]"
          >
            <Crown className="h-4 w-4" aria-hidden="true" />
            Nâng cấp Premium
          </Link>
        )}

        <button
          type="button"
          aria-label={
            notificationCount > 0 ? `Thông báo — ${notificationCount} mới` : "Thông báo"
          }
          className="relative flex h-[38px] w-[38px] items-center justify-center rounded-[9px] border-none bg-[var(--v2-bg)] text-[var(--v2-text)]"
        >
          <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
          {notificationCount > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-4 rounded-lg bg-[#ef4444] px-[5px] py-px text-center text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          ) : null}
        </button>

        <div className="flex items-center gap-[9px]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b7bde,#5f4bc9)] text-[14px] font-bold text-white">
            {user.initials}
          </span>
          <div>
            <div className="text-[13px] leading-[1.25] font-semibold">{user.name}</div>
            {isAdmin ? (
              <span className="text-[11px] font-bold text-[var(--v2-gold)]">{user.planLabel}</span>
            ) : (
              <span className="mt-px inline-block rounded-md bg-[#fef3c7] px-[7px] py-px text-[10.5px] font-bold text-[#92720a]">
                {user.planLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
