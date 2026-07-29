"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
      <path
        fill="#fff"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62Z"
      />
      <path
        fill="#fff"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#fff"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z"
      />
      <path
        fill="#fff"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") ?? "/portal";
  // Only allow same-site relative paths — a raw query param used as a
  // redirect target is an open-redirect vector ("/login?next=https://evil.com").
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/portal";
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resetStatus, setResetStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
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

  async function handleForgotPassword() {
    if (!email) {
      setResetStatus("error");
      return;
    }
    setResetStatus("sending");

    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
    });

    setResetStatus(error ? "error" : "sent");
  }

  return (
    <section className="mx-auto flex max-w-sm flex-col px-5 py-20 md:py-28">
      <h1 className="text-2xl font-extrabold text-white">Đăng ký / Đăng nhập</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
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
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium text-white/40">hoặc dùng email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="mt-4 flex gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`rounded-full px-3 py-1.5 ${mode === "magic" ? "bg-[#7C5CFC] text-white" : "border border-white/15 text-white/60"}`}
        >
          Liên kết qua email
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`rounded-full px-3 py-1.5 ${mode === "password" ? "bg-[#7C5CFC] text-white" : "border border-white/15 text-white/60"}`}
        >
          Mật khẩu
        </button>
      </div>

      {mode === "magic" && (
        status === "sent" ? (
          <div className="card-shine mt-6 rounded-[10.8px] border border-white/10 bg-white/[0.04] p-5 text-sm text-white/80">
            Đã gửi liên kết đăng nhập tới <span className="font-semibold text-white">{email}</span>.
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
              className="w-full rounded-[10.8px] border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#7C5CFC]"
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
            className="w-full rounded-[10.8px] border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#7C5CFC]"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full rounded-[10.8px] border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#7C5CFC]"
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
            {resetStatus === "sent" ? (
              <p className="text-xs text-white/60">
                Đã gửi liên kết đặt lại mật khẩu tới {email}.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetStatus === "sending"}
                className="text-xs font-semibold text-[#7C5CFC] hover:underline disabled:opacity-60"
              >
                {resetStatus === "sending" ? "Đang gửi..." : "Quên mật khẩu?"}
              </button>
            )}
          </div>
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
