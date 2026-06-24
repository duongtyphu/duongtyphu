"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ProfileQuickMenuProps = {
  email: string;
  fullName?: string;
  memberSince: string;
  purchasedCount: number;
};

export function ProfileQuickMenu({ email, fullName, memberSince, purchasedCount }: ProfileQuickMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = (fullName || email).trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 transition hover:border-brand-blue/40"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 text-sm font-bold text-brand-orange">
          {initial}
        </span>
        <span className="max-w-[140px] truncate text-sm font-bold text-white">{fullName || "Học viên"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0B1F4D] p-5 shadow-xl">
          <p className="text-sm font-bold text-white">{fullName || "Học viên"}</p>
          <p className="truncate text-xs text-white/60">{email}</p>
          <p className="mt-3 text-xs text-white/50">📅 Đăng ký từ {memberSince}</p>
          <div className="mt-3">
            <p className="text-base font-extrabold text-white">{purchasedCount}</p>
            <p className="text-xs text-white/50">Đã mua</p>
          </div>
          <Link
            href="/portal/account"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-full bg-brand-blue px-4 py-2 text-center text-xs font-semibold text-white transition hover:opacity-90"
          >
            Xem hồ sơ đầy đủ →
          </Link>
        </div>
      )}
    </div>
  );
}
