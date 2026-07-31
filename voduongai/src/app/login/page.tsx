"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { sanitizeNextParam } from "@/lib/auth/safe-next";
import { useLandingTheme } from "@/components/site/LandingThemeProvider";
import { authTheme } from "@/lib/site/auth-theme";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = sanitizeNextParam(searchParams.get("next"));
  const { theme } = useLandingTheme();
  const t = authTheme[theme];
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const supabase = getSupabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    // Browser is redirected to Google by the call above; no further local
    // state update is needed (or reachable) on success.
  }

  async function handleMagicLink(e: React.FormEvent) {
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

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setErrorMsg("Email hoặc mật khẩu không đúng.");
      return;
    }

    window.location.href = next;
  }

  return (
    <div className={t.pageBg}>
      <section className="mx-auto flex max-w-sm flex-col px-5 py-20 md:py-28">
        <h1 className={`text-2xl font-extrabold ${t.heading}`}>Đăng ký / Đăng nhập</h1>
        <p className={`mt-2 text-sm leading-relaxed ${t.subtext}`}>
          Vào thẳng Học viện AI — miễn phí, chỉ mất vài giây.
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="card-shine mt-8 flex w-full items-center justify-center gap-2.5 rounded-[10.8px] bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(91,33,214,.35)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-60"
        >
          <GoogleIcon />
          {googleLoading ? "Đang chuyển đến Google..." : "Tiếp tục với Google"}
        </button>

        <div className="mt-6 flex items-center gap-3">
          <div className={`h-px flex-1 ${t.border}`} />
          <span className={`text-xs font-medium ${t.faint}`}>hoặc dùng email</span>
          <div className={`h-px flex-1 ${t.border}`} />
        </div>

        <div className="mt-4 flex gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`rounded-full px-3 py-1.5 ${mode === "magic" ? t.tabActive : t.tabInactive}`}
          >
            Liên kết qua email
          </button>
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`rounded-full px-3 py-1.5 ${mode === "password" ? t.tabActive : t.tabInactive}`}
          >
            Mật khẩu
          </button>
        </div>

        {mode === "magic" && (
          status === "sent" ? (
            <div className={`card-shine mt-6 rounded-[10.8px] border p-5 text-sm ${t.card}`}>
              Đã gửi liên kết đăng nhập tới <span className={`font-semibold ${t.heading}`}>{email}</span>.
              Mở email và bấm vào liên kết để vào Học viện.
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="mt-6 space-y-3">
              <input
                type="email"
                required
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
                {status === "sending" ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
              </button>
              {status === "error" && (
                <p className="text-xs text-red-400">
                  Không gửi được liên kết, vui lòng thử lại.
                </p>
              )}
            </form>
          )
        )}

        {mode === "password" && (
          <form onSubmit={handlePasswordLogin} className="mt-6 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@email.com"
              className={`w-full rounded-[10.8px] border px-4 py-3 text-sm ${t.input}`}
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className={`w-full rounded-[10.8px] border px-4 py-3 text-sm ${t.input}`}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="card-shine w-full rounded-[10.8px] bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(91,33,214,.35)] transition disabled:opacity-60"
            >
              {status === "sending" ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            {status === "error" && <p className="text-xs text-red-400">{errorMsg}</p>}

            <div className="pt-1 text-right">
              <Link
                href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                className={`text-xs font-semibold ${t.link}`}
              >
                Quên mật khẩu?
              </Link>
            </div>
          </form>
        )}

        <p className={`mt-6 text-center text-xs ${t.faint}`}>
          Chưa có tài khoản?{" "}
          <Link
            href={`/register${next !== "/portal" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className={`font-semibold ${t.link}`}
          >
            Đăng ký
          </Link>
        </p>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
