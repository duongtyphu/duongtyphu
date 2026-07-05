import Link from "next/link";
import { PartyPopper } from "lucide-react";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";

/** Feature 09 — Collection Complete: chúc mừng + Companion đề xuất Collection phù hợp nhất tiếp theo. */
export function CollectionCompleteBanner({
  collection,
  suggestedNext,
}: {
  collection: KnowledgeCollection;
  suggestedNext: KnowledgeCollection | null;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center shadow-sm backdrop-blur-sm">
      <PartyPopper className="mx-auto h-6 w-6 text-emerald-500" />
      <p className="text-lg font-extrabold text-gray-900">Chúc mừng!</p>
      <p className="text-sm text-gray-600">
        Bạn đã hoàn thành: <span className="font-bold text-gray-900">{collection.title}</span>.
      </p>
      {suggestedNext && (
        <div className="pt-1">
          <p className="mb-2 text-xs font-semibold text-gray-500">Tiếp theo Companion đề xuất:</p>
          <Link
            href={`/portal/hetrithucai/collection/${suggestedNext.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
          >
            {suggestedNext.title}
          </Link>
        </div>
      )}
    </div>
  );
}
