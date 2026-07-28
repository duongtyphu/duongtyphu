"use client";

import { Menu } from "lucide-react";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";

export function AdminHeader({
  email,
  onToggleSidebar,
}: {
  email: string;
  onToggleSidebar: () => void;
}) {
  return (
    <header className="gemos-topbar sticky top-0 z-40">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Mở hoặc thu gọn menu"
          title="Mở hoặc thu gọn menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-brand-blue hover:text-brand-blue"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
            <circle cx="27" cy="7.5" r="3" fill="#5B21D6" />
          </svg>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-extrabold tracking-tight text-gray-900">
              VO DUONG <span className="text-brand-orange">AI</span>
            </span>
            <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider text-brand-blue">
              Admin
            </span>
          </span>
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 md:flex-none md:gap-3">
          <AdminSearch />
          <AdminUserMenu email={email} />
        </div>
      </div>
    </header>
  );
}
