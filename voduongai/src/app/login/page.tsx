"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

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
      <h1 className="text-2xl font-extrabold text-white">Đăng nhập Portal</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        {mode === "magic"
          ? "Nhập email để nhận liên kết đăng nhập — không cần mật khẩu."
          : "Đăng nhập bằng email và mật khẩu đã đặt trong tài khoản."}
      </p>

      <div className="mt-6 flex gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`rounded-full px-3 py-1.5 ${mode === "magic" ? "bg-brand-blue text-white" : "border border-white/15 text-white/60"}`}
        >
          Liên kết qua email
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`rounded-full px-3 py-1.5 ${mode === "password" ? "bg-brand-blue text-white" : "border border-white/15 text-white/60"}`}
        >
          Mật khẩu
        </button>
      </div>

      {mode === "magic" && (
        status === "sent" ? (
          <div className="card-shine mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/80">
            Đã gửi liên kết đăng nhập tới <span className="font-semibold text-white">{email}</span>.
            Mở email và bấm vào liên kết để vào Portal.
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="mt-8 space-y-3">
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
        )
      )}

      {mode === "password" && (
        <form onSubmit={handlePasswordLogin} className="mt-8 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@email.com"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand-violet"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand-violet"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="card-shine w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
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
                className="text-xs font-semibold text-brand-violet hover:underline disabled:opacity-60"
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
