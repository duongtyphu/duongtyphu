"use client";

import { motion } from "framer-motion";
import { RevealText } from "@/components/home/RevealText";

const STATS = [
  { value: "10K+", label: "Người theo dõi", sub: "Từ hoạt động thực" },
  { value: "50+", label: "Tài liệu & công cụ", sub: "Sử dụng được ngay" },
  { value: "12+", label: "Công cụ AI thực tế", sub: "Mỗi ngày" },
  { value: "3+", label: "Năm kinh nghiệm", sub: "Thực chiến" },
];

const TRUST_BADGES = ["⭐ 4.9/5 hài lòng", "🎯 97% học viên tiến bộ", "🛡️ Hoàn tiền 7 ngày"];

export function TrustStats({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <section className={`border-t py-9 md:py-12 ${isLight ? "border-[#E2E8F0] bg-white text-[#0F172A]" : "border-white/5 text-white"}`}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md ${
                isLight ? "border-[#E2E8F0] bg-[#F6F7F9] text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
              }`}
            >
              🌐 Cộng đồng
            </span>
            <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">
              <RevealText>
                Bạn <span style={{ color: "#FF6B35" }}>không học một mình</span>
              </RevealText>
            </h2>
            <p className={`mt-3 max-w-md text-sm ${isLight ? "text-[#54637A]" : "text-white/50"}`}>
              Tham gia cộng đồng để học hỏi, chia sẻ và cập nhật cùng những
              người đang xây hệ thống AI & Affiliate.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {TRUST_BADGES.map((badge) => (
                <span key={badge} className={`trust-badge ${isLight ? "trust-badge--light" : ""}`}>
                  {badge}
                </span>
              ))}
            </div>

            <p className={`mt-6 text-xs ${isLight ? "text-[#54637A]" : "text-white/50"}`}>
              📌 Cộng đồng đang phát triển cùng nhau mỗi ngày
            </p>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className={`community-stat-card text-center ${isLight ? "community-stat-card--light" : ""}`}>
                <div className="stat-number">{s.value}</div>
                <p className={`mt-2 text-xs ${isLight ? "text-[#54637A]" : "text-white/50"}`}>{s.label}</p>
                <p className={`mt-1 text-[10px] ${isLight ? "text-[#94A3B8]" : "text-white/50"}`}>{s.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
