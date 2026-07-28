"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "/images/landing-preview/icons/platform-community.png",
    title: "Cộng đồng tích cực",
    desc: "Hơn 10,000+ thành viên cùng học hỏi và hỗ trợ nhau mỗi ngày.",
  },
  {
    icon: "/images/landing-preview/icons/community-knowledge.png",
    title: "Kiến thức chọn lọc",
    desc: "Nội dung chất lượng, được chọn lọc và cập nhật liên tục.",
  },
  {
    icon: "/images/landing-preview/icons/community-companion.png",
    title: "Đồng hành dài hạn",
    desc: "Companion AI và đội ngũ luôn bên bạn trên hành trình phát triển.",
  },
];

const VALUES = [
  { icon: "🧭", title: "Tư duy đúng", desc: "Định hướng rõ ràng" },
  { icon: "📝", title: "Hành động mỗi ngày", desc: "Tiến bộ từng bước" },
  { icon: "🏅", title: "Giá trị thực tế", desc: "Tạo ra kết quả" },
  { icon: "🎗️", title: "Đóng góp cộng đồng", desc: "Lan tỏa và phụng sự" },
];

/**
 * "Cộng đồng" section — only the eyebrow badge is kept from the old page;
 * everything else was ported from the now-removed /landing-preview
 * design preview. Section background follows the same theme-aware
 * pattern as the rest of the page so the background stays one
 * continuous, unbroken sweep.
 */
export function TrustStats({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <section
      id="cong-dong"
      className={`scroll-mt-24 border-t py-[32.4px] md:py-[43.2px] ${isLight ? "border-[#E2E8F0] bg-[#F6F7F9] text-[#0F172A]" : "border-white/5 text-white"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${
              isLight ? "border-[#E2E8F0] bg-white text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
            }`}
          >
            🌐 Cộng đồng
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="grid items-stretch gap-6 md:grid-cols-[1fr_1.2fr]"
        >
          <div
            className={`card-shine flex flex-col justify-center rounded-[10.8px] border p-6 md:p-8 ${
              isLight
                ? "border-[#ECEDF5] bg-white shadow-[0_4px_24px_rgba(15,23,60,.06)]"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <h2
              className={`text-[1.4rem] font-extrabold leading-[1.3] tracking-[-.3px] md:text-[1.6rem] ${
                isLight ? "text-[#0B0F2E]" : "text-white"
              }`}
            >
              Hệ sinh thái dành cho người Việt
            </h2>
            <p className={`mt-3.5 leading-[1.7] ${isLight ? "text-[#5B6B85]" : "text-white/60"}`}>
              Kết nối tri thức, công cụ, cơ hội và cộng đồng để cùng nhau phát triển và tạo ra tác động tích cực.
            </p>
            <ul className="mt-[26px] flex flex-col gap-5">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-center gap-3.5">
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center">
                    <Image
                      src={f.icon}
                      alt=""
                      width={400}
                      height={400}
                      className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(91,33,214,.25)]"
                    />
                  </span>
                  <div>
                    <h4 className={`text-[.98rem] font-extrabold ${isLight ? "text-[#0B0F2E]" : "text-white"}`}>
                      {f.title}
                    </h4>
                    <p className={`mt-1 text-[.86rem] leading-[1.6] ${isLight ? "text-[#5B6B85]" : "text-white/60"}`}>
                      {f.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-[1.3fr_1fr] gap-2">
            <div className="card-shine overflow-hidden rounded-[10.8px] shadow-[0_4px_24px_rgba(15,23,60,.06)]">
              <Image
                src="/images/landing-preview/community-main.jpg"
                alt="Cùng nhau học tập, chia sẻ và tạo ra giá trị bền vững"
                width={1100}
                height={734}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="card-shine flex-1 overflow-hidden rounded-[10.8px] shadow-[0_4px_24px_rgba(15,23,60,.06)]">
                <Image
                  src="/images/landing-preview/community-workshop.jpg"
                  alt="Hội thảo & Workshop — cập nhật xu hướng AI mới nhất"
                  width={900}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="card-shine flex-1 overflow-hidden rounded-[10.8px] shadow-[0_4px_24px_rgba(15,23,60,.06)]">
                <Image
                  src="/images/landing-preview/community-project.jpg"
                  alt="Dự án thực tế — học đi đôi với ứng dụng"
                  width={900}
                  height={450}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="card-shine mt-8 grid gap-6 rounded-[10.8px] p-6 text-white md:grid-cols-[1.1fr_1.6fr] md:items-center md:p-8"
          style={{ background: "linear-gradient(120deg,#0B1140 0%,#171154 100%)" }}
        >
          <div>
            <span className="mb-1.5 block text-[2.2rem] font-extrabold leading-[.6] text-[#7C5CFC]">&ldquo;</span>
            <h3 className="text-[1.15rem] font-bold leading-[1.4] md:text-[1.3rem]">
              Không đo bằng lượng <span className="text-[#A78BFA]">kiến thức</span>;
              <br />
              đo bằng sự <span className="text-[#A78BFA]">chuyển hóa</span>.
            </h3>
          </div>
          <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {VALUES.map((v) => (
              <li key={v.title} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#7C5CFC] text-lg">
                  {v.icon}
                </div>
                <h5 className="text-[.86rem] font-bold text-white">{v.title}</h5>
                <p className="mt-1 text-[.75rem] text-[#9AA1C7]">{v.desc}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
