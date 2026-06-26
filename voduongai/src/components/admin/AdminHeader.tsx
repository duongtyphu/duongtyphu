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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06142D]/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Mở hoặc thu gọn menu"
          title="Mở hoặc thu gọn menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-brand-blue/40 hover:text-white"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#5B8CFF" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <span className="hidden text-sm font-extrabold tracking-tight text-brand-orange sm:inline">
            VO DUONG AI · Admin
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
