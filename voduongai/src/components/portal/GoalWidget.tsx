"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GOAL_STORAGE_KEY, ONBOARDING_GOALS } from "@/lib/portal/onboarding";

const STORAGE_KEY = GOAL_STORAGE_KEY;
export const GOALS = ONBOARDING_GOALS;

export function GoalWidget() {
  const [goalId, setGoalId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydration-safe: render starts with goalId=null (matches SSR), then this
    // mount effect syncs the real value from localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoalId(window.localStorage.getItem(STORAGE_KEY));
    setReady(true);
  }, []);

  function selectGoal(id: string) {
    window.localStorage.setItem(STORAGE_KEY, id);
    setGoalId(id);
  }

  if (!ready) return null;
  const active = GOALS.find((g) => g.id === goalId);

  return (
    <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
      <h3 className="text-sm font-bold text-gray-900">Mục tiêu của tôi</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => selectGoal(g.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              g.id === goalId
                ? "bg-brand-blue text-white"
                : "border border-gray-200 text-gray-600 hover:border-brand-blue/50 hover:text-gray-900"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-4 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-3 text-sm text-gray-700">
          Dựa trên mục tiêu của bạn, hãy bắt đầu với{" "}
          <Link href={active.href} className="font-semibold text-brand-blue hover:underline">
            {active.label}
          </Link>
          . {active.hint}
        </div>
      )}
    </div>
  );
}
