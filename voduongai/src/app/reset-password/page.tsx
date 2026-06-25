"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      return;
    }
    setStatus("saving");

    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.updateUser({ password });

    setStatus(error ? "error" : "done");
  }

  return (
    <section className="mx-auto flex max-w-sm flex-col px-5 py-20 md:py-28">
      <h1 className="text-2xl font-extrabold text-white">Đặt lại mật khẩu</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        Nhập mật khẩu mới cho tài khoản của bạn.
      </p>

      {status === "done" ? (
        <div className="card-shine mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/80">
          Đã đặt lại mật khẩu thành công. Bạn có thể{" "}
          <a href="/login" className="font-semibold text-brand-violet hover:underline">
            đăng nhập
          </a>{" "}
          bằng mật khẩu mới.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand-violet"
          />
          <button
            type="submit"
            disabled={status === "saving"}
            className="card-shine w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
          >
            {status === "saving" ? "Đang lưu..." : "Đặt lại mật khẩu"}
          </button>
          {status === "error" && (
            <p className="text-xs text-red-400">
              Không thể đặt lại mật khẩu. Liên kết có thể đã hết hạn, vui lòng thử lại từ trang đăng nhập.
            </p>
          )}
        </form>
      )}
    </section>
  );
}
