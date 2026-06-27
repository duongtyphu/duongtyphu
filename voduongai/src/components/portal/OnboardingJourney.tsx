"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gem, ChevronLeft } from "lucide-react";
import {
  ONBOARDING_GOALS,
  ONBOARDING_LEVELS,
  ONBOARDING_TIMES,
  hasCompletedOnboarding,
  saveOnboardingProfile,
  type OnboardingGoalId,
  type OnboardingLevelId,
  type OnboardingTimeId,
} from "@/lib/portal/onboarding";

const TOTAL_STEPS = 3;

export function OnboardingJourney() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<OnboardingGoalId | null>(null);
  const [level, setLevel] = useState<OnboardingLevelId | null>(null);
  const [time, setTime] = useState<OnboardingTimeId | null>(null);

  useEffect(() => {
    // Hydration-safe: decide visibility only after mount, since it depends on localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(!hasCompletedOnboarding());
  }, []);

  if (!open) return null;

  function next() {
    if (step < TOTAL_STEPS) setStep(step + 1);
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  function finish() {
    if (!goal || !level || !time) return;
    saveOnboardingProfile({ goal, level, dailyTime: time });
    setOpen(false);
    const selectedGoal = ONBOARDING_GOALS.find((g) => g.id === goal);
    router.push(selectedGoal?.href ?? "/portal");
  }

  function skip() {
    saveOnboardingProfile({
      goal: goal ?? "learn-ai",
      level: level ?? "beginner",
      dailyTime: time ?? "30",
    });
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#020817] p-4 py-10 sm:p-6">
      <div className="mesh-navy absolute inset-0" />

      <div className="glass-dark glow-gem relative z-10 w-full max-w-2xl rounded-[28px] border border-white/10 p-6 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
            <div className="spin-slow absolute inset-0 rounded-full border border-dashed border-brand-purple/40" />
            <div className="glow-gem flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan sm:h-14 sm:w-14">
              <Gem className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </div>
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-white sm:text-2xl">
            Chào mừng bạn đến với VO DUONG AI
          </h1>
          <p className="gradient-text mt-2 text-sm font-semibold sm:text-base">
            Mỗi con người đều là một viên ngọc quý. AI chỉ là công cụ giúp bạn tỏa sáng.
          </p>
          <p className="mt-3 max-w-md text-sm text-white/60">
            Hãy bắt đầu hành trình mài giũa phiên bản tốt hơn của chính mình trong kỷ nguyên AI.
          </p>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? "w-10 bg-gradient-to-r from-brand-purple to-brand-cyan" : s < step ? "w-6 bg-brand-cyan/60" : "w-6 bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="mt-8">
          {step === 1 && (
            <StepBlock
              prompt="Hôm nay, bạn muốn bắt đầu hành trình nào?"
              options={ONBOARDING_GOALS.map((g) => ({ id: g.id, label: g.label }))}
              selected={goal}
              onSelect={(id) => setGoal(id as OnboardingGoalId)}
            />
          )}
          {step === 2 && (
            <StepBlock
              prompt="Bạn đang ở cấp độ nào?"
              options={ONBOARDING_LEVELS.map((l) => ({ id: l.id, label: l.label }))}
              selected={level}
              onSelect={(id) => setLevel(id as OnboardingLevelId)}
            />
          )}
          {step === 3 && (
            <StepBlock
              prompt="Bạn có thể dành bao nhiêu thời gian mỗi ngày?"
              options={ONBOARDING_TIMES.map((t) => ({ id: t.id, label: t.label }))}
              selected={time}
              onSelect={(id) => setTime(id as OnboardingTimeId)}
              columns={4}
            />
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-1 rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Quay lại
            </button>
          ) : (
            <button
              type="button"
              onClick={skip}
              className="text-sm font-semibold text-white/40 transition hover:text-white/70"
            >
              Bỏ qua, để sau
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={next}
              disabled={(step === 1 && !goal) || (step === 2 && !level)}
              className="gradient-surface rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-purple/30 transition disabled:cursor-not-allowed disabled:opacity-30"
            >
              Tiếp tục
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              disabled={!time}
              className="gradient-surface rounded-full px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-purple/30 transition disabled:cursor-not-allowed disabled:opacity-30"
            >
              Bắt đầu hành trình
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          Bạn có thể thay đổi mục tiêu bất cứ lúc nào trong Không gian của tôi.
        </p>
      </div>
    </div>
  );
}

function StepBlock({
  prompt,
  options,
  selected,
  onSelect,
  columns = 2,
}: {
  prompt: string;
  options: { id: string; label: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
  columns?: number;
}) {
  return (
    <div>
      <h2 className="text-center text-base font-bold text-white sm:text-lg">{prompt}</h2>
      <div
        className={`mt-5 grid gap-3 ${
          columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-2"
        }`}
      >
        {options.map((opt) => {
          const isSelected = opt.id === selected;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`card-shine rounded-2xl border p-4 text-left text-sm font-semibold transition ${
                isSelected
                  ? "glow-gem border-brand-purple/60 bg-gradient-to-br from-brand-purple/20 to-brand-cyan/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/75 hover:border-brand-purple/30 hover:text-white"
              } ${columns === 4 ? "text-center" : ""}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
