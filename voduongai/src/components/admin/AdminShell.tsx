"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { adminNavGroups } from "@/lib/admin/nav";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await getSupabaseBrowser().auth.signOut();
    router.push("/admin/login");
  }

  const activeLabel =
    adminNavGroups.flatMap((g) => g.items).find((i) => pathname?.startsWith(i.href))?.label ?? "Admin";

  return (
    <div className="flex min-h-screen bg-[#06142D] text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 overflow-y-auto border-r border-white/10 bg-[#0B1F4D] transition-transform md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#5B8CFF" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <span className="text-sm font-extrabold tracking-tight text-brand-orange">VO DUONG AI · Admin</span>
        </div>
        <nav className="space-y-4 p-4">
          {adminNavGroups.map((g, i) => (
            <div key={g.group ?? `top-${i}`}>
              {g.group && (
                <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">{g.group}</p>
              )}
              <div className="space-y-1">
                {g.items.map((item) => {
                  const active = pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                        active ? "bg-brand-blue text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex min-h-screen flex-1 flex-col md:ml-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#06142D]/90 px-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-lg border border-white/10 p-2 text-white/70 hover:bg-white/10 md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <h1 className="text-sm font-bold text-white/80">{activeLabel}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-white/50 sm:inline">{email}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:border-red-400/40 hover:text-red-300"
            >
              Đăng xuất
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
