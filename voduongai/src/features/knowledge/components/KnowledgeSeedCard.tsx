"use client";

import Link from "next/link";
import { Sprout } from "lucide-react";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import { SEED_STAGE_LABELS } from "../types/knowledge-seed.types";
import { computeSeedProgress } from "../services/knowledge-seed.service";
import { useSeedProgress } from "../utils/use-seed-progress";

export function KnowledgeSeedCard({ seed }: { seed: KnowledgeSeed }) {
  const { completedStepIds } = useSeedProgress(seed.id);
  const progress = computeSeedProgress(seed, completedStepIds);

  return (
    <Link href={`/portal/library/${seed.slug}`} className="gemos-gem-card block rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
          <Sprout className="h-3 w-3" />
          {SEED_STAGE_LABELS[progress.stage]}
        </span>
        <span className="text-[10px] text-gray-400">{seed.estimatedTime}</span>
      </div>
      <h3 className="gemos-card-title mb-2 text-sm font-bold leading-snug text-gray-900">{seed.title}</h3>
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">{seed.summary}</p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </Link>
  );
}
