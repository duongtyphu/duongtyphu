"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const sidebar = [
  "Tổng quan",
  "AI Academy",
  "VDAI Academy",
  "Affiliate Hub",
  "Thư viện Công cụ",
  "Thư viện Prompt",
  "Tài nguyên miễn phí",
  "Tài nguyên Premium",
  "Cộng đồng",
];

const cards = [
  { title: "Bộ công cụ AI", badge: "Miễn phí" as const },
  { title: "100+ Prompt ChatGPT", badge: "Miễn phí" as const },
  { title: "Lộ trình Affiliate", badge: "Portal" as const },
  { title: "VDAI SOLO", badge: "Premium" as const },
  { title: "Thư viện công cụ", badge: "Portal" as const },
  { title: "Lịch nội dung", badge: "Miễn phí" as const },
];

const badgeStyle: Record<string, string> = {
  "Miễn phí": "bg-brand-orange/15 text-brand-orange",
  Portal: "bg-brand-blue/10 text-brand-blue",
  Premium: "bg-brand-violet/15 text-brand-violet",
};

const filters = ["Tất cả", "AI Academy", "Affiliate", "Công cụ", "Prompt", "Premium"];

export function PortalPreview() {
  return (
    <section className="py-9 text-white md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Bên trong Võ Đương AI Portal có gì?
          </h2>
          <p className="mt-3 text-white/60">
            Một không gian duy nhất để bạn truy cập tài nguyên AI, Thư viện
            Prompt, Thư viện công cụ, Affiliate Hub, VDAI Academy, tài liệu
            miễn phí và các sản phẩm số.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="card-tilt mx-auto mt-10 max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur [perspective:1200px]"
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            <div className="ml-3 flex flex-1 items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/40">
              <span>⌕</span>
              <span>Tìm tài nguyên, prompt, công cụ...</span>
            </div>
          </div>

          <div className="flex">
            <div className="hidden w-44 flex-shrink-0 space-y-1 border-r border-white/10 p-4 sm:block">
              {sidebar.map((item, i) => (
                <div
                  key={item}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    i === 0 ? "bg-white/10 text-white" : "text-white/50"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="flex-1 p-5">
              <div className="flex flex-wrap gap-2">
                {filters.map((f, i) => (
                  <span
                    key={f}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      i === 0
                        ? "bg-white text-brand-navy"
                        : "border border-white/15 text-white/50"
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                {cards.map((c) => (
                  <div
                    key={c.title}
                    className="card-shine rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="h-7 w-7 rounded-lg gradient-surface" />
                    <p className="mt-3 text-sm font-semibold text-white">
                      {c.title}
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeStyle[c.badge]}`}
                    >
                      {c.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            href="/portal"
            className="inline-flex rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:opacity-90"
          >
            Truy cập Portal
          </Link>
        </div>
      </div>
    </section>
  );
}
