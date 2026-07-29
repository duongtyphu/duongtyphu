"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { GemBackground } from "@/components/portal/ui/GemBackground";

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
    <div className="relative flex min-h-screen items-center justify-center px-4 text-gray-900">
      <GemBackground />
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-2">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <div>
            <p className="text-sm font-extrabold">
              <span className="text-[#2563EB]">VO DUONG</span> <span className="text-[#5B21D6]">AI</span>
            </p>
            <p className="text-xs text-gray-500">Admin Console</p>
          </div>
        </div>

        {notAdmin && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            Tài khoản này không có quyền Admin.
          </p>
        )}

        {status === "sent" ? (
          <p className="text-sm text-gray-700">
            Đã gửi liên kết đăng nhập tới <span className="font-semibold text-gray-900">{email}</span>. Mở email và
            bấm vào liên kết để vào trang Admin.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email Admin
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="ban@email.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-brand-blue py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
            </button>
            {status === "error" && <p className="text-sm text-red-600">Không gửi được liên kết, vui lòng thử lại.</p>}
          </form>
        )}

        <p className="mt-5 text-center text-xs text-gray-400">
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
