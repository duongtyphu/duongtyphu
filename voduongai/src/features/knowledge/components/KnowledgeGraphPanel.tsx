import Link from "next/link";
import { Layers, Sparkles, Wrench, Briefcase, ArrowUpRight } from "lucide-react";
import { TagPill } from "./TagPill";
import type { KnowledgeGraphView } from "../services/knowledge-graph.service";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";

/**
 * Feature 01/03/04/05 — Knowledge Graph: hiển thị vị trí của Seed trong hệ
 * tri thức (Collection → Skill → AI Tool → Scenario), không để Seed đứng
 * độc lập. Knowledge Dependency (Feature 06) hiển thị riêng ở `KnowledgeDependency`.
 */
export function KnowledgeGraphPanel({
  collection,
  graph,
}: {
  collection: KnowledgeCollection | undefined;
  graph: KnowledgeGraphView;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Knowledge Graph</p>

      {collection && (
        <div className="flex items-center gap-2 text-sm">
          <Layers className="h-4 w-4 shrink-0 text-blue-500" />
          <span className="text-gray-500">Collection:</span>
          <Link href={`/portal/library/collection/${collection.slug}`} className="font-semibold text-blue-600 hover:underline">
            {collection.title}
          </Link>
        </div>
      )}

      {graph.skills.length > 0 && (
        <div className="flex items-start gap-2">
          <Sparkles className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
          <div className="flex flex-wrap gap-1.5">
            {graph.skills.map((s) => (
              <TagPill key={s.id} label={s.label} tone="skill" />
            ))}
          </div>
        </div>
      )}

      {graph.aiTools.length > 0 && (
        <div className="flex items-start gap-2">
          <Wrench className="mt-1 h-4 w-4 shrink-0 text-violet-500" />
          <div className="flex flex-wrap gap-1.5">
            {graph.aiTools.map((t) => (
              <TagPill key={t.id} label={t.label} tone="tool" />
            ))}
          </div>
        </div>
      )}

      {graph.scenarios.length > 0 && (
        <div className="flex items-start gap-2">
          <Briefcase className="mt-1 h-4 w-4 shrink-0 text-amber-600" />
          <div className="flex flex-wrap gap-1.5">
            {graph.scenarios.map((s) => (
              <TagPill key={s.id} label={s.label} tone="scenario" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Feature 06 — Knowledge Dependency: bạn nên học trước / bạn nên học sau. */
export function KnowledgeDependency({
  prerequisites,
  dependents,
}: {
  prerequisites: KnowledgeSeed[];
  dependents: KnowledgeSeed[];
}) {
  if (prerequisites.length === 0 && dependents.length === 0) return null;
  return (
    <div className="space-y-3 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      {prerequisites.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">Bạn nên học trước</p>
          <div className="flex flex-wrap gap-2">
            {prerequisites.map((seed) => (
              <Link
                key={seed.id}
                href={`/portal/library/${seed.slug}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600"
              >
                {seed.title}
              </Link>
            ))}
          </div>
        </div>
      )}
      {dependents.length > 0 && (
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gray-400">
            Bạn nên học sau <ArrowUpRight className="h-3 w-3" />
          </p>
          <div className="flex flex-wrap gap-2">
            {dependents.map((seed) => (
              <Link
                key={seed.id}
                href={`/portal/library/${seed.slug}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600"
              >
                {seed.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
