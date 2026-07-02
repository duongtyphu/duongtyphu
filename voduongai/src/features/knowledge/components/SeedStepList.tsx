"use client";

import { Check } from "lucide-react";
import { KNOWLEDGE_TYPE_LABELS } from "../utils/knowledge-labels";
import type { KnowledgeSeedStep } from "../types/knowledge-seed.types";

export function SeedStepList({
  steps,
  completedStepIds,
  onToggle,
}: {
  steps: KnowledgeSeedStep[];
  completedStepIds: string[];
  onToggle: (stepId: string) => void;
}) {
  const ordered = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {ordered.map((step) => {
        const done = completedStepIds.includes(step.id);
        const comingSoon = !step.assetId;
        return (
          <button
            key={step.id}
            type="button"
            disabled={comingSoon}
            onClick={() => onToggle(step.id)}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
              done
                ? "border-emerald-200 bg-emerald-50/60"
                : comingSoon
                  ? "cursor-not-allowed border-dashed border-gray-200 bg-gray-50 opacity-60"
                  : "border-gray-200 bg-white hover:border-blue-300"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                done ? "bg-emerald-500 text-white" : "border border-gray-300 text-gray-400"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : step.order}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {KNOWLEDGE_TYPE_LABELS[step.type]}
              </span>
              <span className="block truncate text-sm font-semibold text-gray-800">
                {step.title}
                {comingSoon && <span className="ml-2 text-xs font-normal text-gray-400">(sắp có)</span>}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
