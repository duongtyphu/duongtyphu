"use client";

/**
 * BUG FIX P0 — Mobile Header Navigation.
 *
 * Header.tsx (Server Component) chỉ hiện `mainNav` ở `lg:flex` (≥1024px)
 * — dưới 1024px trước đây KHÔNG có cách nào mở menu (Hamburger chưa tồn
 * tại). Component này cung cấp đúng nút Hamburger (☰) + Drawer trượt từ
 * phải, hiển thị lại `mainNav` (nguồn nav duy nhất, không tạo danh sách
 * song song) cộng khối tài khoản (Đăng nhập hoặc Hồ sơ/Bảng điều
 * khiển/Đăng xuất khi đã đăng nhập).
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type NavItem = { label: string; href: string };

export function MobileNavDrawer({
  navItems,
  user,
  isLight = false,
}: {
  navItems: NavItem[];
  user: { email: string; fullName?: string } | null;
  isLight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // createPortal cần document — chỉ có ở client, chưa sẵn sàng lúc SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở menu"
        aria-expanded={open}
        className={`flex shrink-0 items-center justify-center rounded-lg p-2 transition lg:hidden ${
          isLight ? "text-[#0F172A] hover:bg-[#0F172A]/5" : "text-white hover:bg-white/10"
        }`}
      >
        <Menu className="h-6 w-6" />
      </button>

      {mounted && open &&
        createPortal(
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button
              type="button"
              aria-label="Đóng menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <div className="absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-brand-navy p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wide text-white/60">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Đóng menu"
                  className="rounded-lg p-2 text-white transition hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto border-t border-white/10 pt-4">
                {user ? (
                  <div className="flex flex-col gap-1">
                    <p className="truncate px-3 text-xs text-white/50">{user.fullName || user.email}</p>
                    {/* Portal 2.0 chạy song song với Portal 1.0 — nhãn ghi rõ
                        phiên bản để không lẫn với "Bảng điều khiển" bên dưới. */}
                    <Link
                      href="/v2/trang-chu"
                      onClick={() => setOpen(false)}
                      className="rounded-lg bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-3 py-3 text-base font-semibold text-white transition hover:opacity-90"
                    >
                      Vào Portal 2.0
                    </Link>
                    <Link href="/portal/account" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-semibold text-white transition hover:bg-white/10">
                      Hồ sơ
                    </Link>
                    <Link href="/portal/hocvienai" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-semibold text-white transition hover:bg-white/10">
                      Bảng điều khiển
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg px-3 py-3 text-left text-base font-semibold text-red-300 transition hover:bg-white/10"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base font-semibold text-white transition hover:bg-white/10">
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
