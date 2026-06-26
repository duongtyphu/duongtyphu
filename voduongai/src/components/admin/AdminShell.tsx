"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const COLLAPSE_KEY = "vdai_admin_sidebar_collapsed";

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
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
    // Closes the mobile drawer on route change; there is no render-time
    // signal for "navigation just happened".
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
    <div className="flex min-h-screen flex-col bg-[#06142D] text-white">
      <AdminHeader email={email} onToggleSidebar={handleToggleSidebar} />

      <div className="flex flex-1">
        <aside
          className={`hidden shrink-0 border-r border-white/10 py-6 transition-all md:block ${
            collapsed ? "w-[68px] px-2" : "w-64 px-4"
          }`}
        >
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-6">
            <AdminSidebar collapsed={collapsed} variant="desktop" />
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
            <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto border-r border-white/10 bg-[#0B1F4D] p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">Menu Admin</span>
                <button
                  type="button"
                  aria-label="Đóng menu"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <AdminSidebar variant="mobile" onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
