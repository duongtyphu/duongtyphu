"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
    >
      Đăng xuất
    </button>
  );
}
