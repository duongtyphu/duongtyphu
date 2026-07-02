import { Sprout } from "lucide-react";
import type { KnowledgeSeedProgress } from "../types/knowledge-seed.types";
import { SEED_STAGE_LABELS } from "../types/knowledge-seed.types";

export function JourneyProgress({ progress }: { progress: KnowledgeSeedProgress }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
          <Sprout className="h-4 w-4 text-emerald-500" />
          {SEED_STAGE_LABELS[progress.stage]}
        </span>
        <span className="text-xs font-semibold text-gray-400">{progress.percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}
