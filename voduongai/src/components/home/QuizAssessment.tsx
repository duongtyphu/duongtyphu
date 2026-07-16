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
    question: "Bạn hiểu gì về việc tự động hoá bằng AI (AI Agent, workflow)?",
    answers: [
      "Chưa từng nghe tới",
      "Nghe qua nhưng chưa hiểu rõ",
      "Hiểu cơ bản, đã thử một vài công cụ",
      "Đã tự xây dựng workflow/AI Agent riêng",
    ],
  },
];

const LEVELS = [
  {
    emoji: "🌟",
    label: "Mới bắt đầu",
    score: 1,
    desc: "Bạn mới làm quen với AI — đây là thời điểm tốt nhất để bắt đầu học đúng hướng.",
  },
  {
    emoji: "📘",
    label: "Cơ bản",
    score: 3,
    desc: "Bạn đã có nền tảng ban đầu, cần hệ thống hoá kiến thức để tiến nhanh hơn.",
  },
  {
    emoji: "⚡",
    label: "Trung cấp",
    score: 5,
    desc: "Bạn dùng AI khá tốt — đã đến lúc biến kỹ năng thành thu nhập thực tế.",
  },
  {
    emoji: "🚀",
    label: "Nâng cao",
    score: 7,
    desc: "Bạn đã ứng dụng AI vào công việc/kinh doanh, sẵn sàng mở rộng quy mô.",
  },
  {
    emoji: "🏆",
    label: "Chuyên sâu",
    score: 9,
    desc: "Bạn thuộc nhóm dẫn đầu — đủ sức xây hệ thống AI Agent và tài sản số bền vững.",
  },
];

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

  const completed = step >= QUESTIONS.length;
  const totalScore = completed
    ? answers.reduce<number>((sum, a) => sum + (a ?? 0) + 1, 0)
    : 0;
  const levelIndex = scoreToLevelIndex(totalScore);

  const selectAnswer = (answerIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = answerIndex;
      return next;
    });
  };

  const goNext = () => {
    if (answers[step] === null) return;
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
            Bạn đang ở đâu trong <span className="text-amber-400">hành trình AI</span>?
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
          {/* Left: quiz card */}
          <div className="card-shine min-h-[420px] rounded-[24px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <AnimatePresence mode="wait">
              {!completed ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {QUESTIONS.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          i === step
                            ? "scale-125 bg-brand-orange"
                            : i < step
                              ? "bg-brand-orange/60"
                              : "bg-white/15"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-white/40">
                    Câu {step + 1}/{QUESTIONS.length}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-white md:text-xl">
                    {QUESTIONS[step].question}
                  </h3>

                  <div className="mt-5 space-y-2.5">
                    {QUESTIONS[step].answers.map((answer, i) => (
                      <button
                        key={answer}
                        type="button"
                        onClick={() => selectAnswer(i)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          answers[step] === i
                            ? "border-brand-orange bg-brand-orange/10 text-white"
                            : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/25 hover:bg-white/[0.05]"
                        }`}
                      >
                        {answer}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={step === 0}
                      className="text-sm font-semibold text-white/60 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ← Quay lại
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={answers[step] === null}
                      className="rounded-full gradient-surface px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {step === QUESTIONS.length - 1 ? "Xem kết quả" : "Tiếp theo →"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center py-4 text-center"
                >
                  <span className="text-4xl">{LEVELS[levelIndex].emoji}</span>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                    Kết quả đánh giá
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold text-white">
                    {LEVELS[levelIndex].label}
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                    {LEVELS[levelIndex].desc}
                  </p>

                  <Link
                    href="#cta-cuoi"
                    className="mt-6 inline-flex rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:opacity-90"
                  >
                    Nhập lộ trình phù hợp →
                  </Link>

                  <button
                    type="button"
                    onClick={restart}
                    className="mt-4 text-xs font-medium text-white/40 transition hover:text-white/70"
                  >
                    Làm lại bài đánh giá
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: level scale */}
          <div className="card-shine rounded-[24px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
              Thang đánh giá năng lực AI
            </p>
            <div className="mt-5 space-y-3.5">
              {LEVELS.map((lvl, i) => {
                const active = completed && i === levelIndex;
                return (
                  <div
                    key={lvl.label}
                    className={`rounded-2xl border p-4 transition ${
                      active
                        ? "border-brand-orange/50 bg-brand-orange/10 shadow-[0_0_30px_-8px_rgba(255,122,0,0.45)]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-semibold ${active ? "text-white" : "text-white/75"}`}
                      >
                        {lvl.emoji} {lvl.label}
                      </span>
                      <span
                        className={`text-xs font-medium ${active ? "text-brand-orange" : "text-white/40"}`}
                      >
                        {lvl.score}/10
                      </span>
                    </div>
                    {active && (
                      <p className="mt-1 text-[11px] font-semibold text-brand-orange">
                        📍 Bạn đang ở đây
                      </p>
                    )}
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          active
                            ? "bg-gradient-to-r from-brand-orange to-amber-400"
                            : "bg-white/25"
                        }`}
                        style={{ width: `${lvl.score * 10}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {!completed && (
              <p className="mt-5 text-center text-xs text-white/40">
                Hoàn thành bài đánh giá bên trái để xem bạn đang ở cấp độ nào.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
