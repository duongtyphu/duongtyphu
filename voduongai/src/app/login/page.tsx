"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/portal";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <section className="mx-auto flex max-w-sm flex-col px-5 py-20 md:py-28">
      <h1 className="text-2xl font-extrabold text-white">Đăng nhập Portal</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        Nhập email để nhận liên kết đăng nhập — không cần mật khẩu.
      </p>

      {status === "sent" ? (
        <div className="card-shine mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/80">
          Đã gửi liên kết đăng nhập tới <span className="font-semibold text-white">{email}</span>.
          Mở email và bấm vào liên kết để vào Portal.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@email.com"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand-violet"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="card-shine w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
          >
            {status === "sending" ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
          </button>
          {status === "error" && (
            <p className="text-xs text-red-400">
              Không gửi được liên kết, vui lòng thử lại.
            </p>
          )}
        </form>
      )}
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
