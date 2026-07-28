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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight">
              <span className="text-[#2563EB]">{brandMain(siteName)}</span>
              <span className="text-[#5B21D6]">{brandAccent(siteName)}</span>
            </span>
            <span className="hidden whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider text-[#5B21D6] sm:block">
              {slogan}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition xl:text-sm ${
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
            className="hidden shrink-0 rounded-[10.8px] bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 min-[400px]:inline-flex"
          >
            Đăng ký miễn phí
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
