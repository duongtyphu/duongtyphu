"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <section className="mx-auto flex max-w-sm flex-col px-5 py-20 md:py-28">
      <h1 className="text-2xl font-extrabold text-white">Quên mật khẩu</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
      </p>

      {status === "sent" ? (
        <div className="card-shine mt-8 rounded-[10.8px] border border-white/10 bg-white/[0.04] p-5 text-sm text-white/80">
          Đã gửi liên kết đặt lại mật khẩu tới <span className="font-semibold text-white">{email}</span>.
          Mở email và bấm vào liên kết để tiếp tục.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-3" noValidate>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@email.com"
            className="w-full rounded-[10.8px] border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#7C5CFC]"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="card-shine w-full rounded-[10.8px] bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(91,33,214,.35)] transition disabled:opacity-60"
          >
            {status === "sending" ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
          </button>
          {status === "error" && (
            <p className="text-xs text-red-400">Không gửi được liên kết, vui lòng thử lại.</p>
          )}
        </form>
      )}

      <Link href="/login" className="mt-6 text-center text-xs font-semibold text-[#7C5CFC] hover:underline">
        Quay lại đăng nhập
      </Link>
    </section>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
