"use client";

import Link from "next/link";
import { Check, Sprout } from "lucide-react";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import { SEED_STAGE_LABELS, KnowledgeSeedStage } from "../types/knowledge-seed.types";
import { computeSeedProgress } from "../services/knowledge-seed.service";
import { useSeedProgress } from "../utils/use-seed-progress";

export function SeedListItem({ seed, index }: { seed: KnowledgeSeed; index: number }) {
  const { completedStepIds } = useSeedProgress(seed.id);
  const progress = computeSeedProgress(seed, completedStepIds);
  const completed = progress.stage === KnowledgeSeedStage.MATURED;

  return (
    <Link
      href={`/portal/library/${seed.slug}`}
      className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition hover:border-blue-200"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          completed ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        {completed ? <Check className="h-4 w-4" /> : index + 1}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-gray-900">{seed.title}</span>
        <span className="block truncate text-xs text-gray-500">{seed.summary}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
        <Sprout className="h-3 w-3" />
        {SEED_STAGE_LABELS[progress.stage]}
      </span>
    </Link>
  );
}
