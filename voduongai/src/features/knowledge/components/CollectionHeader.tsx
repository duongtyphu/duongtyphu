import { Layers } from "lucide-react";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";
import type { KnowledgeCollectionProgress } from "../types/knowledge-collection.types";

export function CollectionHeader({
  collection,
  progress,
}: {
  collection: KnowledgeCollection;
  progress: KnowledgeCollectionProgress;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
          <Layers className="h-4 w-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Collection · {progress.totalSeeds} Knowledge Seed
        </span>
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900">{collection.title}</h1>
      <p className="max-w-2xl text-gray-500">{collection.description}</p>
      <div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-1.5 text-xs font-medium text-gray-400">
          {progress.completedSeeds}/{progress.totalSeeds} Seed đã trưởng thành · {progress.percent}%
        </p>
      </div>
    </div>
  );
}
