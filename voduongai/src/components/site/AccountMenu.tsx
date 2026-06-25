"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type AccountMenuProps = {
  email: string;
  fullName?: string;
};

export function AccountMenu({ email, fullName }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (pathname?.startsWith("/portal")) return null;

  const initial = (fullName || email).trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-sm font-semibold text-white transition hover:border-brand-violet"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange/20 text-xs font-bold text-brand-orange">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate sm:inline">{fullName || email}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0B1F4D] p-3 shadow-xl">
          <p className="truncate px-1 text-sm font-bold text-white">{fullName || "Học viên"}</p>
          <p className="truncate px-1 text-xs text-white/60">{email}</p>

          <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
            <Link
              href="/portal/account"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-white/15"
            >
              Hồ sơ
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:border-red-400/40 hover:text-red-300"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
