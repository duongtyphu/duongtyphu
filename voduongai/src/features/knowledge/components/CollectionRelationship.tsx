import Link from "next/link";
import { Link2 } from "lucide-react";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";

/** Feature 07 — Collection Relationship: chuỗi Collection nên học tiếp theo. */
export function CollectionRelationship({ related }: { related: KnowledgeCollection[] }) {
  if (related.length === 0) return null;
  return (
    <div className="space-y-2 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Link2 className="h-3.5 w-3.5" />
        Collection liên quan
      </p>
      <div className="flex flex-wrap gap-2">
        {related.map((collection) => (
          <Link
            key={collection.id}
            href={`/portal/hetrithucai/collection/${collection.slug}`}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600"
          >
            {collection.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
