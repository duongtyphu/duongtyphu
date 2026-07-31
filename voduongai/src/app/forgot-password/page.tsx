"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useLandingTheme } from "@/components/site/LandingThemeProvider";
import { authTheme } from "@/lib/site/auth-theme";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const { theme } = useLandingTheme();
  const t = authTheme[theme];
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
    <div className={t.pageBg}>
      <section className="mx-auto flex max-w-sm flex-col px-5 py-20 md:py-28">
        <h1 className={`text-2xl font-extrabold ${t.heading}`}>Quên mật khẩu</h1>
        <p className={`mt-2 text-sm leading-relaxed ${t.subtext}`}>
          Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
        </p>

        {status === "sent" ? (
          <div className={`card-shine mt-8 rounded-[10.8px] border p-5 text-sm ${t.card}`}>
            Đã gửi liên kết đặt lại mật khẩu tới <span className={`font-semibold ${t.heading}`}>{email}</span>.
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
              className={`w-full rounded-[10.8px] border px-4 py-3 text-sm ${t.input}`}
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

        <Link href="/login" className={`mt-6 text-center text-xs font-semibold ${t.link}`}>
          Quay lại đăng nhập
        </Link>
      </section>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
