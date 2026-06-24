"use client";

import { useState } from "react";

export function EmailOptInForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Có lỗi xảy ra, vui lòng thử lại.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setError("Không thể kết nối. Vui lòng thử lại.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-2xl border border-green-400/20 bg-green-500/5 p-4 text-sm font-semibold text-green-400">
        Đã nhận email của bạn! Tôi sẽ liên hệ hoặc gửi nội dung mới sớm nhất.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <p className="mb-3 text-sm text-white/70">
        Để lại email để nhận tài nguyên AI mới và được tư vấn nhanh hơn.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ban@email.com"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-blue"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full gradient-surface px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Đang gửi..." : "Đăng ký"}
        </button>
      </div>
      {status === "error" && <p className="mt-2 text-xs font-medium text-red-400">{error}</p>}
    </form>
  );
}
