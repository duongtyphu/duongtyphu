"use client";

import { Sparkles } from "lucide-react";
import { DiscoveryGoalCard } from "./DiscoveryGoalCard";
import { DISCOVERY_GOALS } from "../data/discovery-goals";

export function CompanionDiscovery({
  activeGoalId,
  onSelectGoal,
}: {
  activeGoalId: string | null;
  onSelectGoal: (goalId: string) => void;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
          <Sparkles className="h-4 w-4 text-violet-500" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-500">Companion Discovery</p>
          <h1 className="mt-1 text-xl font-extrabold text-gray-900">
            Xin chào. Hôm nay mình có thể đồng hành cùng bạn ở điều gì?
          </h1>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {DISCOVERY_GOALS.map((goal) => (
          <DiscoveryGoalCard
            key={goal.id}
            label={goal.label}
            active={activeGoalId === goal.id}
            onClick={() => onSelectGoal(goal.id)}
          />
        ))}
      </div>
    </div>
  );
}
