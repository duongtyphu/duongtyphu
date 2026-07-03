import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

/** Feature 04 — Knowledge Map: Collection → Current Seed → Next Seed → Collection Complete. */
export function KnowledgeMap({
  collection,
  seed,
  next,
  isLastSeed,
}: {
  collection: KnowledgeCollection | undefined;
  seed: KnowledgeSeed;
  next: KnowledgeSeed | null;
  isLastSeed: boolean;
}) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500" aria-label="Knowledge Map">
      {collection && (
        <>
          <Link href={`/portal/library/collection/${collection.slug}`} className="font-semibold hover:text-blue-600">
            {collection.title}
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-300" />
        </>
      )}
      <span className="font-bold text-gray-900">{seed.title}</span>
      <ChevronRight className="h-3 w-3 text-gray-300" />
      {next ? (
        <Link href={`/portal/library/${next.slug}`} className="hover:text-blue-600">
          {next.title}
        </Link>
      ) : (
        <span className={isLastSeed ? "font-semibold text-emerald-600" : ""}>Collection Complete</span>
      )}
    </nav>
  );
}
