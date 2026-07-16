"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

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

export function QuizAssessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );

  const isLastStep = step === QUESTIONS.length - 1;
  const resultReady = isLastStep && answers[step] !== null;
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

  const restart = () => {
    setStep(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
  };

  return (
    <section className="py-9 text-white md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70 backdrop-blur-md">
            🧠 Đánh giá năng lực AI
          </span>
          <h2 className="mt-5 text-2xl font-extrabold md:text-3xl">
            Bạn đang ở đâu trong{" "}
            <span style={{ color: ACCENT }}>hành trình AI</span>?
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Left: quiz card */}
          <div className="flex flex-col rounded-[24px] border border-white/10 bg-white/[0.04] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8">
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
                <p className="mt-6 text-xs text-white/40">
                  Câu hỏi {step + 1}/{QUESTIONS.length}
                </p>
                <h3 className="mt-2 text-lg font-bold text-white md:text-xl">
                  {QUESTIONS[step].question}
                </h3>

                <div className="mt-5 space-y-2.5">
                  {QUESTIONS[step].answers.map((answer, i) => {
                    const selected = answers[step] === i;
                    return (
                      <button
                        key={answer}
                        type="button"
                        onClick={() => selectAnswer(i)}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-white/80 transition hover:border-white/25 hover:bg-white/[0.05]"
                        style={
                          selected
                            ? {
                                borderColor: ACCENT,
                                backgroundColor: `${ACCENT}1A`,
                                color: "#fff",
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
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mt-6 rounded-2xl border p-5"
                  style={{
                    borderColor: `${ACCENT}66`,
                    backgroundColor: `${ACCENT}0D`,
                  }}
                >
                  <p className="text-sm font-bold" style={{ color: ACCENT }}>
                    🎯 Kết quả của bạn
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {level.emoji} Trình độ của bạn: <strong>{level.label}</strong>.{" "}
                    {level.intro} Hãy bắt đầu với lộ trình &quot;{level.path}&quot; –{" "}
                    {level.pathDetail}.
                  </p>

                  <Link
                    href="#cta-cuoi"
                    className="mt-4 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT}, #FFB199)`,
                      boxShadow: `0 10px 30px -10px ${ACCENT}66`,
                    }}
                  >
                    Nhập lộ trình phù hợp →
                  </Link>

                  <button
                    type="button"
                    onClick={restart}
                    className="mt-3 block text-xs font-medium text-white/40 transition hover:text-white/70"
                  >
                    Làm lại bài đánh giá
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className="text-sm font-semibold text-white/60 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Quay lại
              </button>
              {!isLastStep && (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={answers[step] === null}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}, #FFB199)`,
                    boxShadow: `0 10px 30px -10px ${ACCENT}66`,
                  }}
                >
                  Tiếp theo →
                </button>
              )}
            </div>
          </div>

          {/* Right: level scale */}
          <div className="flex flex-col rounded-[24px] border border-white/10 bg-white/[0.04] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white/80">
                📊 Thang đánh giá năng lực
              </p>
              {resultReady && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/70">
                  ✅ Cấp độ: {level.label}
                </span>
              )}
            </div>

            <div className="mt-5 space-y-3.5">
              {LEVELS.map((lvl, i) => {
                const active = resultReady && i === levelIndex;
                return (
                  <div
                    key={lvl.label}
                    className="rounded-2xl border p-4 transition"
                    style={
                      active
                        ? {
                            borderColor: `${ACCENT}80`,
                            backgroundColor: `${ACCENT}1A`,
                            boxShadow: `0 0 30px -8px ${ACCENT}73`,
                          }
                        : {
                            borderColor: "rgba(255,255,255,0.1)",
                            backgroundColor: "rgba(255,255,255,0.02)",
                          }
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-semibold ${active ? "text-white" : "text-white/75"}`}
                      >
                        {lvl.emoji} {lvl.label}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: active ? ACCENT : "rgba(255,255,255,0.4)" }}
                      >
                        {lvl.score}/10
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-white/40">{lvl.subtitle}</p>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${lvl.score * 10}%`,
                          background: active
                            ? `linear-gradient(90deg, ${ACCENT}, #FFB199)`
                            : "rgba(255,255,255,0.2)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {!resultReady && (
              <p className="mt-5 text-center text-xs text-white/40">
                📍 Cấp độ sẽ được xác định sau khi bạn hoàn thành bài test.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
