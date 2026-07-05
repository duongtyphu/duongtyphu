import Link from "next/link";
import { mainNav } from "@/lib/site";
import { getSupabaseServer } from "@/lib/supabase-server";
import { AccountMenu } from "@/components/site/AccountMenu";
import { MobileNavDrawer } from "@/components/site/MobileNavDrawer";
import type { SiteSettings } from "@/lib/site-settings";
import { brandMain, brandAccent } from "@/lib/brand-name";

async function getCurrentUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function Header({ settings }: { settings: SiteSettings }) {
  const user = await getCurrentUser();
  const meta = user?.user_metadata ?? {};

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-white">
              {brandMain(settings.siteName)}
              <span className="text-brand-orange">{brandAccent(settings.siteName)}</span>
            </span>
            <span className="hidden whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider text-brand-blue sm:block">
              {settings.slogan}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/portal/hocvienai"
            className="hidden shrink-0 rounded-full gradient-surface px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 min-[400px]:inline-flex"
          >
            Vào Học viện
          </Link>
          {user?.email && <AccountMenu email={user.email} fullName={meta.full_name} />}
          <MobileNavDrawer navItems={mainNav} user={user?.email ? { email: user.email, fullName: meta.full_name } : null} />
        </div>
      </div>
    </header>
  );
}
