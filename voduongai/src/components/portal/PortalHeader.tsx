"use client";

import Link from "next/link";
import { Menu, Bell, Bookmark } from "lucide-react";
import { PortalSearch } from "@/components/portal/PortalSearch";
import { PortalUserMenu } from "@/components/portal/PortalUserMenu";
import { TopbarGlass } from "@/components/portal/ui/TopbarGlass";
import { createNavigationFallbackHandler } from "@/lib/portal/navigationFallback";

export function PortalHeader({
  user,
  onToggleSidebar,
}: {
  user: { email: string; fullName?: string } | null;
  onToggleSidebar: () => void;
}) {
  const iconButtonBase =
    "h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-brand-blue hover:text-brand-blue";
  const iconButtonClass = `flex ${iconButtonBase}`;

  return (
    <TopbarGlass>
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Mở hoặc thu gọn menu"
          title="Mở hoặc thu gọn menu"
          className={iconButtonClass}
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <Link href="/portal" prefetch={false} onClick={createNavigationFallbackHandler("/portal")} className="flex shrink-0 items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <span className="hidden text-sm font-extrabold tracking-tight text-gray-900 sm:inline">Học viện AI</span>
        </Link>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 md:flex-none md:gap-3">
          <PortalSearch />

          {/* prefetch={false} trên toàn bộ Link ở Header: xem giải thích ở
              PortalSidebar.tsx NavLink — tránh dồn nhiều prefetch cùng lúc
              gây tranh chấp refresh token qua middleware. */}
          <Link
            href="/portal/congdongai#tin-tuc"
            prefetch={false}
            onClick={createNavigationFallbackHandler("/portal/congdongai#tin-tuc")}
            aria-label="Thông báo"
            title="Thông báo"
            className={iconButtonClass}
          >
            <Bell className="h-4 w-4" />
          </Link>

          <Link
            href="/portal/saved"
            prefetch={false}
            onClick={createNavigationFallbackHandler("/portal/saved")}
            aria-label="Nội dung đã lưu"
            title="Nội dung đã lưu"
            className={`hidden sm:flex ${iconButtonBase}`}
          >
            <Bookmark className="h-4 w-4" />
          </Link>

          {user && <PortalUserMenu email={user.email} fullName={user.fullName} />}
        </div>
      </div>
    </TopbarGlass>
  );
}
