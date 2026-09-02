"use client";

/**
 * Thanh điều hướng dưới cho điện thoại (< 720px) — 1:1 với mockup dòng
 * 1184-1192, 5 mục (`navDefs`): Trang chủ/Kho ý tưởng/Từ điển/Lịch học/Hồ sơ.
 * CSS (`.mnyt-bottom-nav*`) đã tự ẩn ở `min-width:720px` qua
 * `.mnyt .mnyt-nav`... — thực ra CSS chỉ ẩn `.mnyt-nav` (nav desktop) dưới
 * 720px; component NÀY chỉ render khi `< 720px` qua hook `useIsMobile()`
 * (khớp đúng `showBottomNav: vw < 720` của mockup).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MNYT_ROUTES } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";

function useIsMobile(breakpoint = 720) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}

const NAV_ITEMS = [
  { href: MNYT_ROUTES.home, labelVi: "Trang chủ", labelEn: "Home", glyph: "M4 11.5 12 4l8 7.5M6 10v10h12V10" },
  {
    href: MNYT_ROUTES.archive,
    labelVi: "Kho ý tưởng",
    labelEn: "Library",
    glyph: "M4 5h6v14H4zM14 5h6v14h-6M14 9h6M14 14h6",
  },
  {
    href: MNYT_ROUTES.glossary,
    labelVi: "Từ điển",
    labelEn: "Glossary",
    glyph: "M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3ZM17 7h2v13H8",
  },
  { href: MNYT_ROUTES.calendar, labelVi: "Lịch học", labelEn: "Calendar", glyph: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" },
  {
    href: MNYT_ROUTES.profile,
    labelVi: "Hồ sơ",
    labelEn: "You",
    glyph: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21c0-3.5 3.1-6 7-6s7 2.5 7 6",
  },
] as const;

export function MnytBottomNav({ lang }: { lang: "vi" | "en" }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isVi = lang === "vi";

  if (!isMobile) return null;

  return (
    <nav aria-label={isVi ? "Điều hướng nhanh" : "Quick navigation"} className="mnyt-bottom-nav">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className="mnyt-bottom-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d={item.glyph} />
            </svg>
            <span>{isVi ? item.labelVi : item.labelEn}</span>
          </Link>
        );
      })}
    </nav>
  );
}
