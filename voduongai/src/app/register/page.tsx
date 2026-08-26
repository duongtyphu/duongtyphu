"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { sanitizeNextParam } from "@/lib/auth/safe-next";
import { useLandingTheme } from "@/components/site/LandingThemeProvider";
import { authTheme } from "@/lib/site/auth-theme";

type Status = "idle" | "submitting" | "verify-email" | "done" | "error";

function RegisterForm() {
  const searchParams = useSearchParams();
  const next = sanitizeNextParam(searchParams.get("next"));
  const { theme } = useLandingTheme();
  const t = authTheme[theme];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleRegister() {
    setGoogleLoading(true);
    const supabase = getSupabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Mật khẩu cần tối thiểu 8 ký tự.");
      setStatus("error");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu nhập lại không khớp.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setStatus("error");
      // Supabase trả cùng 1 dạng lỗi cho "email đã tồn tại" tuỳ cấu hình dự
      // án (đôi khi trả user giả để tránh lộ email đã đăng ký) — hiển thị
      // thông báo chung, không suy đoán chi tiết lỗi thật từ message thô.
      setErrorMsg(
        error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("already exists")
          ? "Email này đã có tài khoản. Hãy đăng nhập hoặc dùng Quên mật khẩu."
          : "Không thể tạo tài khoản, vui lòng thử lại.",
      );
      return;
    }

    // Nếu Supabase Auth bật "Confirm email" (mặc định khuyến nghị bật), signUp
    // thành công không kèm session — user phải bấm link xác thực trong email
    // trước khi đăng nhập được. Nếu tắt, session có ngay, tự vào thẳng next.
    if (data.session) {
      window.location.href = next;
      return;
    }
    setStatus("verify-email");
  }

  if (status === "verify-email") {
    return (
      <div className={t.pageBg}>
        <section className="mx-auto flex max-w-sm flex-col px-5 py-20 md:py-28">
          <h1 className={`text-2xl font-extrabold ${t.heading}`}>Kiểm tra email của bạn</h1>
          <div className={`card-shine mt-6 rounded-[10.8px] border p-5 text-sm ${t.card}`}>
            Đã gửi email xác thực tới <span className={`font-semibold ${t.heading}`}>{email}</span>.
            Mở email và bấm vào liên kết xác thực để hoàn tất đăng ký.
          </div>
          <Link href="/login" className={`mt-6 text-center text-xs font-semibold ${t.link}`}>
            Quay lại đăng nhập
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className={t.pageBg}>
      <section className="mx-auto flex max-w-sm flex-col px-5 py-20 md:py-28">
        <h1 className={`text-2xl font-extrabold ${t.heading}`}>Tạo tài khoản</h1>
        <p className={`mt-2 text-sm leading-relaxed ${t.subtext}`}>
          Miễn phí, chỉ mất vài giây để vào Học viện AI.
        </p>

        <button
          type="button"
          onClick={handleGoogleRegister}
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-3" noValidate>
          <div>
            <label htmlFor="fullName" className="sr-only">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Họ và tên"
              className={`w-full rounded-[10.8px] border px-4 py-3 text-sm ${t.input}`}
            />
          </div>
          <div>
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
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu (tối thiểu 8 ký tự)"
              className={`w-full rounded-[10.8px] border px-4 py-3 text-sm ${t.input}`}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Nhập lại mật khẩu
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className={`w-full rounded-[10.8px] border px-4 py-3 text-sm ${t.input}`}
            />
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="card-shine w-full rounded-[10.8px] bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(91,33,214,.35)] transition disabled:opacity-60"
          >
            {status === "submitting" ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
          {status === "error" && <p className="text-xs text-red-400">{errorMsg}</p>}
        </form>

        <p className={`mt-6 text-center text-xs ${t.faint}`}>
          Đã có tài khoản?{" "}
          <Link
            href={`/login${next !== "/v2/trang-chu" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className={`font-semibold ${t.link}`}
          >
            Đăng nhập
          </Link>
        </p>
      </section>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
