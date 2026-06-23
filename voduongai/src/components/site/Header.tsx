import Link from "next/link";
import { mainNav, siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-brand-orange">
              {siteConfig.name}
            </span>
            <span className="hidden whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider text-brand-blue sm:block">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-gray-700 transition hover:text-brand-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/portal"
          className="rounded-full gradient-surface px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Vào Portal
        </Link>
      </div>
    </header>
  );
}
