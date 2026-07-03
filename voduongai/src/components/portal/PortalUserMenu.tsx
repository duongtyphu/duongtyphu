"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, ExternalLink, LogOut } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";

export function PortalUserMenu({
  email,
  fullName,
  companionTheme = false,
}: {
  email: string;
  fullName?: string;
  companionTheme?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initial = (fullName || email).trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Tài khoản"
        className={
          companionTheme
            ? "flex items-center gap-2 rounded-full border border-violet-400/20 bg-white/5 px-2 py-1.5 text-sm font-semibold text-white transition hover:border-violet-300/50"
            : "flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1.5 text-sm font-semibold text-gray-900 transition hover:border-brand-blue"
        }
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/20 text-xs font-bold text-brand-orange">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate sm:inline">{fullName || email}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl"
        >
          <p className="truncate px-1 text-sm font-bold text-gray-900">{fullName || "Học viên"}</p>
          <p className="truncate px-1 text-xs text-gray-500">{email}</p>

          <div className="mt-3 space-y-1 border-t border-gray-200 pt-3">
            <Link
              href="/portal/account"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 text-gray-400" />
              Cài đặt tài khoản
            </Link>
            <Link
              href="/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4 text-gray-400" />
              Về website chính
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>

          <div className="mt-2 border-t border-gray-200 pt-2">
            <LanguageSwitcher onSelect={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
