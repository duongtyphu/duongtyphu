"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const notAdmin = searchParams.get("error") === "not_admin";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin/dashboard`,
      },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06142D] px-4 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1F4D] p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-2">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#5B8CFF" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <div>
            <p className="text-sm font-extrabold text-brand-orange">VO DUONG AI</p>
            <p className="text-xs text-white/50">Admin Console</p>
          </div>
        </div>

        {notAdmin && (
          <p className="mb-4 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            Tài khoản này không có quyền Admin.
          </p>
        )}

        {status === "sent" ? (
          <p className="text-sm text-white/80">
            Đã gửi liên kết đăng nhập tới <span className="font-semibold text-white">{email}</span>. Mở email và
            bấm vào liên kết để vào trang Admin.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Email Admin
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="ban@email.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-brand-blue py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
            </button>
            {status === "error" && <p className="text-sm text-red-300">Không gửi được liên kết, vui lòng thử lại.</p>}
          </form>
        )}

        <p className="mt-5 text-center text-xs text-white/30">
          Chỉ tài khoản có quyền Admin mới truy cập được trang này.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
