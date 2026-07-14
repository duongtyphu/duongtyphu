"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export function AdminUserMenu({ email }: { email: string }) {
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
    router.push("/admin/login");
    router.refresh();
  }

  const initial = email.trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Tài khoản"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-sm font-semibold text-white transition hover:border-brand-violet"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/20 text-xs font-bold text-brand-orange">
          {initial}
        </span>
        <span className="hidden max-w-[160px] truncate sm:inline">{email}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-white/10 bg-[#0B1F4D] p-3 shadow-xl"
        >
          <p className="truncate px-1 text-sm font-bold text-white">Quản trị viên</p>
          <p className="truncate px-1 text-xs text-white/60">{email}</p>

          <div className="mt-3 space-y-1 border-t border-white/10 pt-3">
            <Link
              href="/portal"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4 text-white/60" />
              Về trang Portal
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-white/70 hover:bg-red-400/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
