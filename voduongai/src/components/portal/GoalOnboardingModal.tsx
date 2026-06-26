"use client";

import { useEffect, useState } from "react";
import { GOALS, GOAL_STORAGE_KEY } from "@/components/portal/GoalWidget";

const SKIPPED_KEY = "vdai_portal_goal_onboarding_skipped";

export function GoalOnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Hydration-safe: render starts closed (matches SSR), then this mount
    // effect opens the modal based on localStorage, unavailable on the server.
    const hasGoal = window.localStorage.getItem(GOAL_STORAGE_KEY);
    const skipped = window.localStorage.getItem(SKIPPED_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!hasGoal && !skipped) setOpen(true);
  }, []);

  function selectGoal(id: string) {
    window.localStorage.setItem(GOAL_STORAGE_KEY, id);
    setOpen(false);
  }

  function skip() {
    window.localStorage.setItem(SKIPPED_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-onboarding-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1F4D] p-6 shadow-2xl">
        <h2 id="goal-onboarding-title" className="text-lg font-bold text-white">
          Bạn muốn bắt đầu với mục tiêu nào?
        </h2>
        <p className="mt-1 text-sm text-white/60">
          Chọn 1 mục tiêu để Portal gợi ý đúng nội dung tiếp theo cho bạn. Bạn có thể đổi lại bất cứ lúc nào.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => selectGoal(g.id)}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-brand-blue/50 hover:bg-white/[0.08]"
            >
              {g.label}
              <span className="mt-0.5 block text-xs font-normal text-white/50">{g.hint}</span>
            </button>
          ))}
        </div>
        <button
          onClick={skip}
          className="mt-4 w-full rounded-full border border-white/10 px-4 py-2 text-center text-xs font-semibold text-white/60 transition hover:text-white"
        >
          Bỏ qua, để sau
        </button>
      </div>
    </div>
  );
}
