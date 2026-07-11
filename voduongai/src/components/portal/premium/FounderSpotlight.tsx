"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import { FOUNDER } from "@/data/portal/founder";

/**
 * Section "Người đồng hành cùng bạn" — dựa trên ý tưởng section "Đội ngũ
 * chuyên gia" của V-Academy cũ (index.html gốc) nhưng thiết kế lại theo
 * ngôn ngữ Premium của VO DUONG AI: nền tối, glow AI, glass, depth.
 *
 * Dữ liệu Founder đọc từ `@/data/portal/founder` (Single Source of Truth,
 * Content Cleanup Sprint 7) — cùng nguồn với `CommunityGuides.tsx`, không
 * còn khai báo trùng ở đây.
 */

export function FounderSpotlight() {
  const [open, setOpen] = useState(false);

  // Đóng modal bằng phím Escape + khoá scroll nền khi modal mở.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="nguoi-dong-hanh" className="scroll-mt-24">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">🤝 Người đồng hành</p>
        <h2 className="mt-1 text-xl font-extrabold text-white md:text-2xl">Người đồng hành cùng bạn</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
          Đằng sau mọi chương trình Premium là một người thật — với trải nghiệm thật và trách nhiệm thật
          với con đường bạn sắp đi.
        </p>
      </div>

      {/* Founder card nổi bật */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-violet-500 to-orange-400" />

        <div className="relative grid gap-6 p-6 md:grid-cols-[240px_1fr] md:items-center md:p-8">
          <div className="relative mx-auto w-full max-w-[240px]">
            <div aria-hidden className="absolute -inset-4 rounded-2xl bg-blue-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-[0_0_50px_-10px_rgba(37,99,235,0.5)]">
              <Image
                src={FOUNDER.photo}
                alt={`${FOUNDER.name} — ${FOUNDER.role}`}
                width={480}
                height={480}
                className="h-auto w-full object-cover"
                sizes="240px"
              />
            </div>
            <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-orange-400/40 bg-gradient-to-r from-orange-500/90 to-amber-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              Nhà sáng lập
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white">{FOUNDER.name}</h3>
            <p className="mt-1 text-sm font-semibold text-blue-300">{FOUNDER.role}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">{FOUNDER.intro}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {FOUNDER.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Xem hồ sơ <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal hồ sơ Founder — không chuyển trang */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Hồ sơ ${FOUNDER.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Đóng hồ sơ"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_0_80px_-10px_rgba(37,99,235,0.45)]">
            <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-violet-500 to-orange-400" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/70 transition hover:bg-white/15 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6 md:p-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/15 shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)]">
                  <Image src={FOUNDER.photo} alt={FOUNDER.name} fill className="object-cover" sizes="96px" />
                </div>
                <div>
                  <span className="rounded-full border border-orange-400/40 bg-orange-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                    Nhà sáng lập
                  </span>
                  <h3 className="mt-1.5 text-xl font-extrabold text-white">{FOUNDER.name}</h3>
                  <p className="text-sm font-semibold text-blue-300">{FOUNDER.role}</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-white/70">{FOUNDER.intro}</p>

              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Lĩnh vực chuyên môn</p>
                <ul className="mt-2 space-y-1.5">
                  {FOUNDER.expertise.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-sm leading-relaxed text-white/70">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Triết lý giảng dạy</p>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-white/85">
                  &ldquo;{FOUNDER.philosophy}&rdquo;
                </p>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Hành trình thật</p>
                <ul className="mt-2 space-y-1.5">
                  {FOUNDER.achievements.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm leading-relaxed text-white/70">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href="#chuong-trinh"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                >
                  Xem các chương trình Premium <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
