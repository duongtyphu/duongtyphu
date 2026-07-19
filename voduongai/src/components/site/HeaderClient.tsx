"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site";
import { AccountMenu } from "@/components/site/AccountMenu";
import { MobileNavDrawer } from "@/components/site/MobileNavDrawer";
import { ThemeToggleButton } from "@/components/site/ThemeToggleButton";
import { useLandingTheme } from "@/components/site/LandingThemeProvider";
import { brandMain, brandAccent } from "@/lib/brand-name";

export function HeaderClient({
  siteName,
  slogan,
  userEmail,
  fullName,
}: {
  siteName: string;
  slogan: string;
  userEmail?: string;
  fullName?: string;
}) {
  const pathname = usePathname();
  const { theme } = useLandingTheme();
  const isLight = pathname === "/" && theme === "light";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
        isLight ? "border-[#E2E8F0] bg-white/85" : "border-white/10 bg-brand-navy/70"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <span className="flex flex-col leading-tight">
            <span
              className={`text-sm font-extrabold tracking-tight ${isLight ? "text-[#0F172A]" : "text-white"}`}
            >
              {brandMain(siteName)}
              <span className="text-brand-orange">{brandAccent(siteName)}</span>
            </span>
            <span
              className={`hidden whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider sm:block ${
                isLight ? "text-brand-blue" : "text-brand-blue"
              }`}
            >
              {slogan}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isLight
                  ? "text-[#334155] hover:bg-[#0F172A]/5 hover:text-[#0F172A]"
                  : "text-white hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggleButton />
          <Link
            href="/login"
            className="hidden shrink-0 rounded-full gradient-surface px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 min-[400px]:inline-flex"
          >
            Vào Học viện
          </Link>
          {userEmail && <AccountMenu email={userEmail} fullName={fullName} isLight={isLight} />}
          <MobileNavDrawer
            navItems={mainNav}
            user={userEmail ? { email: userEmail, fullName } : null}
            isLight={isLight}
          />
        </div>
      </div>
    </header>
  );
}
