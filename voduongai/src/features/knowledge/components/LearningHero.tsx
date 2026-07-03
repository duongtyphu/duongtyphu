import { Clock, Target, Sparkles } from "lucide-react";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";

/** Feature 01 — Learning Hero: tạo động lực học, không chỉ hiển thị tiêu đề. */
export function LearningHero({
  seed,
  collection,
  collectionProgressLabel,
}: {
  seed: KnowledgeSeed;
  collection: KnowledgeCollection | undefined;
  collectionProgressLabel: string | null;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      {collection && (
        <span className="text-xs font-bold uppercase tracking-widest text-blue-500">{collection.title}</span>
      )}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{seed.title}</h1>
        <p className="mt-1 text-base text-gray-500">{seed.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-orange-500" />
          {seed.estimatedTime}
        </span>
        <span className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-blue-500" />
          {seed.difficulty}
        </span>
        {collectionProgressLabel && (
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            {collectionProgressLabel}
          </span>
        )}
      </div>

      {seed.skillsGained.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {seed.skillsGained.map((skill) => (
            <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
