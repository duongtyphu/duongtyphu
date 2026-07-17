"use client";

import { motion } from "framer-motion";
import { RevealText } from "@/components/home/RevealText";

// Unified landing-page accent (orange). The 3 audience cards each get one
// of the site's existing brand colors (blue/violet/emerald) purely to tell
// them apart at a glance — not a departure from the orange accent, which
// stays the section's primary color (heading highlight, ✕ marks, the
// "VO DUONG AI" answer card).
const ACCENT = "#FF6B35";
const PROBLEM_COLOR = "#F87171";

const AUDIENCES = [
  {
    icon: "🧑‍🎓",
    label: "Người mới học AI",
    desc: "Bị quá tải bởi hàng nghìn video, bài viết, khoá học – không biết đâu là lộ trình đúng.",
    question: "Tôi nên bắt đầu từ đâu?",
    color: "#2563EB",
  },
  {
    icon: "💼",
    label: "Người đã biết AI cơ bản",
    desc: "Đã dùng ChatGPT, Canva, nhưng chưa biết ứng dụng AI vào công việc và kinh doanh thực tế.",
    question: "Làm sao để AI tạo ra giá trị?",
    color: "#8B5CF6",
  },
  {
    icon: "📈",
    label: "Người muốn xây Affiliate",
    desc: "Muốn xây dựng hệ thống thu nhập thụ động bằng Affiliate, nhưng không có lộ trình rõ ràng.",
    question: "Affiliate có dành cho người mới?",
    color: "#06D6A0",
  },
];

const PROBLEMS = [
  "Học rải rác, không có lộ trình.",
  "Tự mò mẫm, mất hàng tháng mà vẫn chưa ra kết quả.",
  "AI quá nhiều – không biết bắt đầu từ đâu.",
  "Tool quá nhiều – không biết nên chọn cái gì.",
  "Nội dung phân tán – không có nơi học tập trung.",
];

const STRENGTHS = [
  { pre: "Học theo lộ trình: ", bold: "CKOS → Workspace → Companion", post: "" },
  { pre: "Chọn ", bold: "đúng công cụ", post: " cho từng mục tiêu cụ thể" },
  { pre: "Có quy trình rõ ràng, ", bold: "biến ý tưởng thành output thật", post: "" },
  { pre: "Tri thức được ", bold: "kết nối trong một hệ thống", post: " duy nhất" },
  { pre: "Có ", bold: "Companion", post: " đồng hành, hỗ trợ mọi lúc" },
];

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5L21 19.5H3L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 9.5V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="0.9" fill="currentColor" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 7.4L6.2 15M12 7.4L17.8 15M7.4 17H16.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="5" r="2.4" fill="currentColor" />
      <circle cx="5" cy="17" r="2.4" fill="currentColor" />
      <circle cx="19" cy="17" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function AudienceProblem() {
  return (
    <section className="border-t border-white/5 py-9 text-white md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/70 backdrop-blur-md">
            🎯 Đối tượng & vấn đề
          </span>
          <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">
            <RevealText>
              Nếu bạn đang <span style={{ color: ACCENT }}>gặp những điều này</span>,
              <br />
              bạn đang ở đúng nơi.
            </RevealText>
          </h2>
        </motion.div>

        {/* 3 audience banners */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {AUDIENCES.map((a) => (
            <div key={a.label} className="audience-card">
              <span
                className="icon-glow-badge h-14 w-14 text-2xl"
                style={{ backgroundColor: `${a.color}26`, color: a.color }}
              >
                {a.icon}
              </span>
              <p className="mt-3.5 text-sm font-bold text-white">{a.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/55">{a.desc}</p>
              <p
                className="audience-question"
                style={{
                  borderColor: `${a.color}40`,
                  backgroundColor: `${a.color}12`,
                  color: a.color,
                }}
              >
                &ldquo;{a.question}&rdquo;
              </p>
            </div>
          ))}
        </motion.div>

        {/* Problems vs. solution */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mt-6 grid gap-5 lg:grid-cols-2"
        >
          <div className="problem-panel">
            <div className="flex items-center gap-3">
              <span
                className="icon-glow-badge h-11 w-11 text-lg"
                style={{ backgroundColor: `${PROBLEM_COLOR}22`, color: PROBLEM_COLOR }}
              >
                <WarningIcon />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                Những vấn đề bạn đang gặp phải?
              </p>
            </div>
            <ul className="mt-5 space-y-3.5">
              {PROBLEMS.map((p) => {
                const [lead, ...restParts] = p.split(" – ");
                const rest = restParts.join(" – ");
                return (
                  <li key={p} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: `${ACCENT}26`, color: ACCENT }}
                    >
                      ✕
                    </span>
                    <p className="text-sm leading-relaxed text-white/70">
                      {rest ? (
                        <>
                          <strong className="font-bold text-white">{lead}</strong> – {rest}
                        </>
                      ) : (
                        lead
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="solution-card">
            <div className="flex items-center gap-3">
              <span
                className="icon-glow-badge h-11 w-11 text-lg"
                style={{ backgroundColor: `${ACCENT}22`, color: ACCENT }}
              >
                <NetworkIcon />
              </span>
              <div>
                <p className="text-lg font-extrabold" style={{ color: ACCENT }}>
                  VO DUONG AI
                </p>
                <p className="text-xs text-white/40">Hệ sinh thái tri thức số</p>
              </div>
            </div>
            <div className="my-4 border-t border-white/10" />
            <ul className="space-y-3">
              {STRENGTHS.map((s) => (
                <li key={s.pre + s.bold} className="flex items-start gap-3">
                  <span className="mt-0.5 text-sm font-bold" style={{ color: ACCENT }}>
                    ✓
                  </span>
                  <p className="text-sm leading-relaxed text-white/75">
                    {s.pre}
                    {s.bold && <strong className="font-bold text-white">{s.bold}</strong>}
                    {s.post}
                  </p>
                </li>
              ))}
            </ul>
            <p
              className="mt-5 border-t pt-4 text-center text-sm font-semibold"
              style={{ borderColor: `${ACCENT}33`, color: `${ACCENT}CC` }}
            >
              🚀 Kết quả: Tiết kiệm thời gian, có kết quả thật, xây dựng tài
              sản số.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
