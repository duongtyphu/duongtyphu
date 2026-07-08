"use client";

import { useState } from "react";
import { Phone, Copy, Check, MessageCircle } from "lucide-react";

/**
 * Tư vấn 1:1 — khối riêng, tách khỏi 5 card chương trình.
 * Toàn bộ liên hệ là dữ liệu THẬT từ siteConfig (phone 0909150587,
 * zalo.me/0909150587) — không bịa kênh chưa có (Messenger không có link
 * thật nên không hiển thị).
 */

const PHONE_DISPLAY = "09 09 15 05 87";
const PHONE_RAW = "0909150587";
const ZALO_URL = "https://zalo.me/0909150587";

export function PremiumConsult() {
  const [copied, setCopied] = useState(false);

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(PHONE_RAW);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard bị chặn (trình duyệt cũ / không HTTPS) — số vẫn hiển thị
      // ngay trên nút để người dùng tự bấm gọi hoặc chép tay.
    }
  }

  return (
    <section id="tu-van-1-1" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-blue-950/80 p-6 backdrop-blur md:p-8">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Không chắc nên chọn gì?</p>
            <h2 className="mt-1 text-xl font-extrabold text-white">Tư vấn 1:1</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
              Dành cho người cần được trao đổi trực tiếp để xác định lộ trình phù hợp, lựa chọn khóa học,
              xây hệ thống AI hoặc phát triển chiến lược Affiliate cá nhân / đội nhóm.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 md:min-w-[240px]">
            <a
              href={`tel:${PHONE_RAW}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              <Phone className="h-4 w-4" /> Liên hệ tư vấn — {PHONE_DISPLAY}
            </a>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={copyPhone}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Đã sao chép" : "Sao chép số"}
              </button>
              <a
                href={ZALO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
