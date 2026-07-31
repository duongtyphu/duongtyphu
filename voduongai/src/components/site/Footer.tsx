"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/site-settings";
import { brandMain, brandAccent } from "@/lib/brand-name";
import { useLandingTheme } from "@/components/site/LandingThemeProvider";
import { isThemeAwareRoute } from "@/lib/site/theme-routes";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Khám phá",
    links: [
      { label: "Học viện AI", href: "/login" },
      { label: "Hệ tri thức AI (CKOS)", href: "/login" },
      { label: "Dự án & Cơ hội", href: "/login" },
      { label: "Premium", href: "/login" },
    ],
  },
  {
    title: "Hành trình",
    links: [
      { label: "My Story", href: "/login" },
      { label: "Nhật ký học tập", href: "/login" },
      { label: "Bản đồ hành trình", href: "/login" },
      { label: "Khu vườn của bạn", href: "/login" },
    ],
  },
];

function getSocials(settings: SiteSettings) {
  return [
    {
      label: "Facebook",
      href: settings.facebookUrl,
      bg: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#fff">
          <path d="M14.5 8.5H16.8V5.7H14.5C12.4 5.7 10.7 7.4 10.7 9.5V11.3H8.6V14H10.7V19.5H13.4V14H15.7L16.1 11.3H13.4V9.7C13.4 9.04 13.84 8.5 14.5 8.5Z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: settings.youtubeUrl,
      bg: "#FF0000",
      icon: (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#fff">
          <path d="M9.7 8.6 16 12l-6.3 3.4V8.6Z" />
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: settings.tiktokUrl,
      bg: "#000000",
      icon: (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#fff">
          <path d="M16.5 3c.5 2 2 3.5 4 3.8v3a7 7 0 0 1-4-1.3v6.7a5.7 5.7 0 1 1-5-5.66v3.1a2.6 2.6 0 1 0 2 2.5V3h3Z" />
        </svg>
      ),
    },
    {
      label: "Zalo",
      href: settings.zaloUrl,
      bg: "#0068FF",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
            Z
          </text>
        </svg>
      ),
    },
  ];
}

export function Footer({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const { theme } = useLandingTheme();
  const isLight = isThemeAwareRoute(pathname) && theme === "light";
  const socials = getSocials(settings);

  return (
    <footer className={`relative ${isLight ? "bg-white text-[#0F172A]" : ""}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/70 to-transparent shadow-[0_0_24px_2px_rgba(91,140,255,0.55)]" />
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <svg width="34" height="34" viewBox="0 0 32 32" fill="none" className="shrink-0">
                <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
                <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
              </svg>
              <span className="text-base font-extrabold tracking-tight">
                <span className="text-[#2563EB]">{brandMain(settings.siteName)}</span>
                <span className={isLight ? "text-[#5B21D6]" : "text-white"}>{brandAccent(settings.siteName)}</span>
              </span>
            </Link>
            <p
              className={`mt-2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider ${
                isLight ? "text-[#5B21D6]" : "text-white"
              }`}
            >
              {settings.slogan}
            </p>
            <p className={`mt-4 max-w-xs text-sm leading-relaxed ${isLight ? "text-[#54637A]" : "text-white/50"}`}>
              Hệ sinh thái học tập AI, bổ sung các kỹ năng AI, ứng dụng vào
              công việc thực tế và đồng hành cùng bạn trong kỷ nguyên mới.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{ "--glow": s.bg } as CSSProperties}
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,.15)] transition-all duration-300 hover:-translate-y-1 hover:scale-110"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70"
                    style={{ backgroundColor: s.bg }}
                  />
                  <span
                    className="relative flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-white/10 transition-shadow duration-300 group-hover:shadow-[0_0_22px_2px_var(--glow)]"
                    style={{ backgroundColor: s.bg }}
                  >
                    {s.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`-mx-2 block rounded-lg px-2 py-1 text-sm transition ${
                        isLight
                          ? "text-[#54637A] hover:bg-[#0F172A]/5 hover:text-[#0F172A]"
                          : "text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Liên hệ
            </h3>
            <ul className="mt-4 space-y-3">
              <li
                className={`flex items-center gap-2.5 text-sm ${isLight ? "text-[#54637A]" : "text-white/50"}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-violet/10 text-brand-violet">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {settings.adminEmailNotify}
              </li>
              <li
                className={`flex items-center gap-2.5 text-sm ${isLight ? "text-[#54637A]" : "text-white/50"}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-violet/10 text-brand-violet">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path
                      d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 2Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                (+84) {siteConfig.contact.phone}
              </li>
              <li
                className={`flex items-center gap-2.5 text-sm ${isLight ? "text-[#54637A]" : "text-white/50"}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-violet/10 text-brand-violet">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                TP. Hồ Chí Minh, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`mt-14 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs md:flex-row ${
            isLight ? "border-[#E2E8F0] text-[#94A3B8]" : "border-white/10 text-white/60"
          }`}
        >
          <span>
            Copyright © {new Date().getFullYear()} {settings.siteName}
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className={isLight ? "hover:text-[#0F172A]" : "hover:text-white"}>
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className={isLight ? "hover:text-[#0F172A]" : "hover:text-white"}>
              Điều khoản sử dụng
            </Link>
            <Link href="/refund-policy" className={isLight ? "hover:text-[#0F172A]" : "hover:text-white"}>
              Chính sách hoàn phí
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
