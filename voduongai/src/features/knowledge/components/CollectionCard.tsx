"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";
import { getSeedsInCollection, computeCollectionProgress } from "../services/knowledge-collection.service";
import { getSeedCompletedStepIds } from "../utils/use-seed-progress";

export function CollectionCard({ collection }: { collection: KnowledgeCollection }) {
  const seeds = getSeedsInCollection(collection);
  const progress = computeCollectionProgress(collection, getSeedCompletedStepIds);

  return (
    <Link
      href={`/portal/library/collection/${collection.slug}`}
      className="block rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
          <Layers className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {seeds.length} Knowledge Seed
        </span>
      </div>
      <h3 className="mb-1.5 text-base font-bold text-gray-900">{collection.title}</h3>
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">{collection.description}</p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${progress.percent}%` }} />
      </div>
      <p className="mt-1.5 text-xs font-medium text-gray-400">
        {progress.completedSeeds}/{progress.totalSeeds} đã trưởng thành
      </p>
    </Link>
  );
}
