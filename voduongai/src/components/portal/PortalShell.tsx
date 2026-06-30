"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { GemBackground } from "@/components/portal/ui/GemBackground";
import { CompanionPresence } from "@/components/portal/companion/CompanionPresence";
import { LocaleProvider } from "@/lib/i18n/use-locale";
import type { ThoughtContext } from "@/lib/portal/companion/daily-thought-source";
import type { LifeMoment } from "@/lib/portal/life-moments/life-moments";

const COLLAPSE_KEY = "vdai_portal_sidebar_collapsed";

export function PortalShell({
  user,
  dailyThoughtContext,
  lifeMoment,
  returnAfterSilenceMilestone,
  children,
}: {
  user: { email: string; fullName?: string } | null;
  dailyThoughtContext?: ThoughtContext;
  /** Sprint 18.8 — Presence Coordinator: tín hiệu server, thread xuống CompanionPresence. */
  lifeMoment?: LifeMoment | null;
  returnAfterSilenceMilestone?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Hydration-safe: render starts collapsed=false (matches SSR), then this
    // mount effect syncs the persisted preference from localStorage.
    const stored = window.localStorage.getItem(COLLAPSE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    // Closes the mobile drawer on route change; reacting to navigation,
    // not a pure render computation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function handleToggleSidebar() {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setDrawerOpen((v) => !v);
      return;
    }
    setCollapsed((v) => {
      const next = !v;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <LocaleProvider>
    <div className="flex min-h-screen flex-col">
      <GemBackground />
      <PortalHeader user={user} onToggleSidebar={handleToggleSidebar} />

      <div className="flex flex-1">
        <aside
          className={`hidden shrink-0 border-r border-gray-200 bg-white py-6 transition-all md:block ${
            collapsed ? "w-[68px] px-2" : "w-64 px-4"
          }`}
        >
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-6">
            <PortalSidebar collapsed={collapsed} variant="desktop" />
          </div>
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Đóng menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black/60"
            />
            <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto border-r border-gray-200 bg-white p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-extrabold text-gray-900">Menu Portal</span>
                <button
                  type="button"
                  aria-label="Đóng menu"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <PortalSidebar variant="mobile" onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>

      <CompanionPresence
        dailyThoughtContext={dailyThoughtContext}
        lifeMoment={lifeMoment ?? null}
        returnAfterSilenceMilestone={returnAfterSilenceMilestone ?? null}
        addressProfile={user?.fullName ? { fullName: user.fullName } : null}
      />
    </div>
    </LocaleProvider>
  );
}
