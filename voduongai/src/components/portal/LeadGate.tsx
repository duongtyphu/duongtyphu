"use client";

import { useState } from "react";

type LeadGateProps = {
  source: string;
  downloadHref: string;
  downloadFilename?: string;
  ctaLabel: string;
};

export function LeadGate({
  source,
  downloadHref,
  downloadFilename,
  ctaLabel,
}: LeadGateProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "unlocked" | "error">("idle");
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

      setStatus("unlocked");
    } catch {
      setError("Không thể kết nối. Vui lòng thử lại.");
      setStatus("error");
    }
  }

  if (status === "unlocked") {
    return (
      <a
        href={downloadHref}
        download={downloadFilename}
        className="inline-flex rounded-full gradient-surface px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {ctaLabel}
      </a>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <p className="mb-3 text-sm text-brand-gray-500">
        Nhập email để mở khoá tải miễn phí — bạn sẽ nhận thêm tài nguyên mới từ VO DUONG AI.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ban@email.com"
          className="flex-1 rounded-full border border-brand-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full gradient-surface px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Đang xử lý..." : "Nhận ngay"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
      )}
    </form>
  );
}
