"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "#top" },
  { label: "Học viện AI", href: "#hoc-vien-ai" },
  { label: "Companion", href: "#companion-ai" },
  { label: "Hệ tri thức AI", href: "#ckos" },
  { label: "Dự án & Cơ hội", href: "#du-an-co-hoi" },
  { label: "Premium", href: "#premium" },
  { label: "Cộng đồng", href: "#cong-dong" },
];

function LogoMark({ small }: { small?: boolean }) {
  const size = small ? 28 : 32;
  return (
    <span className="inline-flex items-center gap-[7px]">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
        <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
        <circle cx="27" cy="7.5" r="3" fill="#F97316" />
      </svg>
      <span className="flex flex-col leading-none">
        <b className="text-[15px] font-extrabold tracking-[1.5px] text-[#2563EB]">VO DUONG</b>
        <small className="text-[8px] font-semibold tracking-[3px] text-[#5B21D6]">AI</small>
      </span>
    </span>
  );
}

export function LandingPreviewHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header id="lp-nav" className="sticky top-0 z-[200] border-b border-white/[.06] bg-[#05061a]/85 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-6">
          <Link href="#top" className="shrink-0 no-underline">
            <LogoMark />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Menu chính">
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative py-2 text-[.92rem] font-semibold transition-colors ${
                  i === 0 ? "text-white after:absolute after:-bottom-[19px] after:left-0 after:right-0 after:h-[2px] after:bg-[#7C5CFC]" : "text-[#C7CCEA] hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              aria-label="Tìm kiếm"
              className="hidden h-[38px] w-[38px] items-center justify-center rounded-full text-[#C7CCEA] transition-colors hover:bg-white/[.08] hover:text-white lg:inline-flex"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
            </button>
            <Link
              href="/login"
              className="hidden rounded-[10px] border-[1.5px] border-white/25 px-[18px] py-[9px] text-[.85rem] font-bold text-white transition-colors hover:bg-white/[.08] lg:inline-block"
            >
              Đăng nhập
            </Link>
            <Link
              href="/login"
              className="rounded-[10px] bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-[18px] py-[9px] text-[.85rem] font-bold text-white shadow-[0_6px_16px_rgba(91,33,214,.4)]"
            >
              Đăng ký miễn phí
            </Link>
            <button
              type="button"
              aria-label="Mở menu"
              onClick={() => setOpen(true)}
              className="flex h-[38px] w-[38px] items-center justify-center text-white lg:hidden"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[300] ${open ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-[340px] flex-col gap-6 overflow-y-auto bg-[#020D22] p-5 transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <LogoMark small />
            <button
              type="button"
              aria-label="Đóng menu"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/[.08] text-white"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/[.06] py-3 text-[1rem] font-semibold text-[#C7CCEA]"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-2.5">
            <Link
              href="/login"
              className="rounded-xl border-[1.5px] border-[#DADCF0] px-4 py-3 text-center text-sm font-bold text-white"
            >
              Đăng nhập
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-4 py-3 text-center text-sm font-bold text-white"
            >
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
