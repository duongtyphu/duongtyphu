import Link from "next/link";
import { Layers, Clock, ArrowRight } from "lucide-react";
import type { KnowledgeCollection, KnowledgeCollectionProgress } from "../types/knowledge-collection.types";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import { getCollectionTotalMinutes } from "../services/knowledge-collection.service";

/** Feature 02 — Collection Dashboard: tên, mô tả, số Seed, tổng thời gian, đã hoàn thành, Seed tiếp theo, progress. */
export function CollectionHeader({
  collection,
  progress,
  nextSeed,
}: {
  collection: KnowledgeCollection;
  progress: KnowledgeCollectionProgress;
  nextSeed: KnowledgeSeed | null;
}) {
  const totalMinutes = getCollectionTotalMinutes(collection);

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
          <Layers className="h-4 w-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Collection</span>
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900">{collection.title}</h1>
      <p className="max-w-2xl text-gray-500">{collection.description}</p>

      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <span>{progress.totalSeeds} Seed</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {totalMinutes} phút
        </span>
        <span>
          Bạn đã học <span className="font-bold text-gray-900">{progress.completedSeeds} / {progress.totalSeeds}</span>
        </span>
      </div>

      <div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-1.5 text-xs font-medium text-gray-400">{progress.percent}% hoàn thành</p>
      </div>

      {nextSeed && (
        <Link
          href={`/portal/library/${nextSeed.slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          Tiếp tục {nextSeed.title}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
