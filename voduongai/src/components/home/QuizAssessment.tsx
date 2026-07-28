"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { RevealText } from "@/components/home/RevealText";

const QUESTIONS = [
  {
    question: "Bạn đã từng dùng ChatGPT hoặc công cụ AI chưa?",
    answers: [
      "Chưa bao giờ",
      "Đã dùng thử vài lần",
      "Dùng thường xuyên cho công việc",
      "Dùng AI mỗi ngày, kết hợp nhiều công cụ",
    ],
  },
  {
    question: "Bạn có biết cách viết prompt để AI trả lời đúng ý mình không?",
    answers: [
      "Không biết prompt là gì",
      "Biết nhưng chưa áp dụng được",
      "Viết được prompt cơ bản, đôi khi hiệu quả",
      "Thành thạo, biết tối ưu prompt cho từng mục đích",
    ],
  },
  {
    question: "Bạn đã dùng AI để tạo thu nhập hoặc phục vụ công việc/kinh doanh chưa?",
    answers: [
      "Chưa nghĩ tới việc này",
      "Đang tìm hiểu, chưa bắt đầu",
      "Đã thử áp dụng vào công việc/affiliate",
      "Đã có hệ thống/tài sản số tạo thu nhập từ AI",
    ],
  },
  {
    question: "Bạn sẵn sàng dành bao nhiêu thời gian mỗi ngày cho AI?",
    answers: ["15-30 phút", "30-60 phút", "1-2 giờ", "2 giờ trở lên"],
  },
];

// Accent orange for this section — unify with #FF6B35 going forward.
const ACCENT = "#FF6B35";

const LEVELS = [
  {
    emoji: "🌟",
    label: "Mới bắt đầu",
    subtitle: "Chưa từng dùng AI",
    score: 1,
    path: "Khởi động",
    intro: "Bạn mới bắt đầu hành trình AI.",
    pathDetail: "làm quen với AI từ những điều cơ bản nhất",
  },
  {
    emoji: "📘",
    label: "Cơ bản",
    subtitle: "Đã dùng thử vài lần",
    score: 3,
    path: "Làm quen",
    intro: "Bạn đã có nền tảng cơ bản.",
    pathDetail: "ứng dụng AI vào công việc hàng ngày",
  },
  {
    emoji: "⚡",
    label: "Trung cấp",
    subtitle: "Dùng AI hàng ngày",
    score: 5,
    path: "Tăng tốc",
    intro: "Bạn đã dùng AI thành thói quen.",
    pathDetail: "biến kỹ năng AI thành thu nhập thực tế",
  },
  {
    emoji: "🚀",
    label: "Nâng cao",
    subtitle: "Xây dựng hệ thống AI",
    score: 7,
    path: "Mở rộng",
    intro: "Bạn đã biết xây hệ thống AI.",
    pathDetail: "mở rộng quy mô và xây tài sản số bền vững",
  },
  {
    emoji: "🏆",
    label: "Chuyên sâu",
    subtitle: "Tối ưu & nhân bản hệ thống",
    score: 9,
    path: "Dẫn đầu",
    intro: "Bạn thuộc nhóm dẫn đầu về AI.",
    pathDetail: "tối ưu và nhân bản hệ thống AI Agent của riêng bạn",
  },
];

// Levels map onto sum-of-4-answers thresholds, which is equivalent to
// thresholding the average score (sum / 4) — same ranking, no extra math.
function scoreToLevelIndex(total: number) {
  if (total <= 6) return 0;
  if (total <= 9) return 1;
  if (total <= 11) return 2;
  if (total <= 13) return 3;
  return 4;
}

export function QuizAssessment({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );
  const [revealed, setRevealed] = useState(false);

  const isLastStep = step === QUESTIONS.length - 1;
  const lastAnswered = isLastStep && answers[step] !== null;
  const resultReady = revealed;
  const totalScore = answers.reduce<number>((sum, a) => sum + (a ?? 0) + 1, 0);
  const levelIndex = scoreToLevelIndex(totalScore);
  const level = LEVELS[levelIndex];

  const selectAnswer = (answerIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = answerIndex;
      return next;
    });
  };

  const goNext = () => {
    if (answers[step] === null || isLastStep) return;
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const showResult = () => {
    if (!lastAnswered) return;
    setRevealed(true);
  };

  return (
    <section
      id="danh-gia-nang-luc-ai"
      className={`scroll-mt-24 py-7 md:py-9 ${isLight ? "bg-[#F6F7F9] text-[#0F172A]" : "text-white"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] backdrop-blur-md ${
              isLight
                ? "border-[#E2E8F0] bg-white text-[#54637A]"
                : "border-white/15 bg-white/5 text-white/70"
            }`}
          >
            🧠 Đánh giá năng lực AI
          </span>
          <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">
            <RevealText>
              Bạn đang ở đâu trong <span style={{ color: ACCENT }}>hành trình AI</span>?
            </RevealText>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-6 grid gap-5 lg:grid-cols-2"
        >
          {/* Left: quiz card — layout animates so it grows smoothly once
              the result is appended, instead of everything being
              stretched to equal height upfront. */}
          <motion.div
            layout
            whileHover={{ y: -4 }}
            transition={{ layout: { duration: 0.4, ease: "easeInOut" }, y: { duration: 0.2 } }}
            className={`flex flex-col rounded-xl border p-5 md:p-6 ${
              isLight ? "border-[#E2E8F0] bg-white shadow-[var(--shadow-token-sm)]" : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full transition"
                  style={{
                    backgroundColor:
                      i === step
                        ? ACCENT
                        : i < step || answers[i] !== null
                          ? `${ACCENT}99`
                          : isLight
                            ? "rgba(15,23,42,0.12)"
                            : "rgba(255,255,255,0.15)",
                    transform: i === step ? "scale(1.25)" : undefined,
                  }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <p className={`mt-4 text-xs ${isLight ? "text-[#54637A]" : "text-white/40"}`}>
                  Câu hỏi {step + 1}/{QUESTIONS.length}
                </p>
                <h3
                  className={`mt-1.5 text-base font-bold md:text-lg ${isLight ? "text-[#0F172A]" : "text-white"}`}
                >
                  {QUESTIONS[step].question}
                </h3>

                <div className="mt-3.5 space-y-2">
                  {QUESTIONS[step].answers.map((answer, i) => {
                    const selected = answers[step] === i;
                    return (
                      <button
                        key={answer}
                        type="button"
                        onClick={() => selectAnswer(i)}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${
                          isLight
                            ? "border-[#E2E8F0] bg-[#F6F7F9] text-[#334155] hover:border-[#CBD5E1] hover:bg-white"
                            : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/25 hover:bg-white/[0.05]"
                        }`}
                        style={
                          selected
                            ? {
                                borderColor: ACCENT,
                                backgroundColor: `${ACCENT}1A`,
                                color: isLight ? "#0F172A" : "#fff",
                              }
                            : undefined
                        }
                      >
                        {String.fromCharCode(65 + i)}. {answer}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {resultReady && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
                  className="mt-4 rounded-xl border p-4"
                  style={{
                    borderColor: `${ACCENT}66`,
                    backgroundColor: `${ACCENT}0D`,
                  }}
                >
                  <p className="text-sm font-bold" style={{ color: ACCENT }}>
                    🎯 Kết quả của bạn
                  </p>
                  <p className={`mt-1.5 text-sm leading-relaxed ${isLight ? "text-[#334155]" : "text-white/80"}`}>
                    {level.emoji} Trình độ của bạn: <strong>{level.label}</strong>.{" "}
                    {level.intro} Hãy bắt đầu với lộ trình &quot;{level.path}&quot; –{" "}
                    {level.pathDetail}.
                  </p>

                  <Link
                    href="#cta-cuoi"
                    className="mt-3.5 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT}, #FFB199)`,
                      boxShadow: `0 10px 30px -10px ${ACCENT}66`,
                    }}
                  >
                    Nhập lộ trình phù hợp →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {!resultReady && (
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className={`text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-30 ${
                    isLight ? "text-[#54637A] hover:text-[#0F172A]" : "text-white/60 hover:text-white"
                  }`}
                >
                  ← Quay lại
                </button>
                <button
                  type="button"
                  onClick={isLastStep ? showResult : goNext}
                  disabled={answers[step] === null}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}, #FFB199)`,
                    boxShadow: `0 10px 30px -10px ${ACCENT}66`,
                  }}
                >
                  {isLastStep ? "Xem kết quả" : "Tiếp theo →"}
                </button>
              </div>
            )}
          </motion.div>

          {/* Right: level scale */}
          <motion.div
            layout
            whileHover={{ y: -4 }}
            transition={{ layout: { duration: 0.4, ease: "easeInOut" }, y: { duration: 0.2 } }}
            className={`flex flex-col rounded-xl border p-5 md:p-6 ${
              isLight ? "border-[#E2E8F0] bg-white shadow-[var(--shadow-token-sm)]" : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className={`text-sm font-semibold ${isLight ? "text-[#334155]" : "text-white/80"}`}>
                📊 Thang đánh giá năng lực
              </p>
              {resultReady ? (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
                    isLight ? "border-[#E2E8F0] bg-[#F6F7F9] text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
                  }`}
                >
                  ✅ Cấp độ: {level.label}
                </span>
              ) : (
                <span className={`text-xs ${isLight ? "text-[#94A3B8]" : "text-white/30"}`}>Chưa có dữ liệu</span>
              )}
            </div>

            <div className="mt-3 space-y-1.5">
              {LEVELS.map((lvl, i) => {
                const active = resultReady && i === levelIndex;
                return (
                  <div
                    key={lvl.label}
                    className="rounded-xl border p-2.5"
                    style={
                      active
                        ? {
                            borderColor: `${ACCENT}80`,
                            backgroundColor: `${ACCENT}1A`,
                            boxShadow: `0 0 30px -8px ${ACCENT}73`,
                          }
                        : isLight
                          ? { borderColor: "#E2E8F0", backgroundColor: "#F6F7F9" }
                          : {
                              borderColor: "rgba(255,255,255,0.1)",
                              backgroundColor: "rgba(255,255,255,0.02)",
                            }
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          active ? (isLight ? "text-[#0F172A]" : "text-white") : isLight ? "text-[#334155]" : "text-white/75"
                        }`}
                      >
                        {lvl.emoji} {lvl.label}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: active ? ACCENT : isLight ? "#94A3B8" : "rgba(255,255,255,0.4)" }}
                      >
                        {lvl.score}/10
                      </span>
                    </div>
                    <p className={`mt-0.5 text-xs ${isLight ? "text-[#54637A]" : "text-white/40"}`}>{lvl.subtitle}</p>
                    <div
                      className={`mt-1.5 h-1.5 w-full overflow-hidden rounded-full ${isLight ? "bg-[#E2E8F0]" : "bg-white/10"}`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${lvl.score * 10}%`,
                          background: active
                            ? `linear-gradient(90deg, ${ACCENT}, #FFB199)`
                            : isLight
                              ? "#CBD5E1"
                              : "rgba(255,255,255,0.2)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {!resultReady && (
              <p className={`mt-3 text-center text-xs ${isLight ? "text-[#54637A]" : "text-white/40"}`}>
                📍 Cấp độ sẽ được xác định sau khi bạn hoàn thành bài test.
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
