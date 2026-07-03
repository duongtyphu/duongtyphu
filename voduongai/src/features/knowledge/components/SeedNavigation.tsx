import Link from "next/link";
import { ArrowLeft, ArrowRight, Link2 } from "lucide-react";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

/** Knowledge Navigation — Previous/Next/Related, để người học không bị mất phương hướng. */
export function SeedNavigation({
  previous,
  next,
  related,
}: {
  previous: KnowledgeSeed | null;
  next: KnowledgeSeed | null;
  related: KnowledgeSeed[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/portal/library/${previous.slug}`}
            className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white/70 p-4 text-left shadow-sm backdrop-blur-sm transition hover:border-blue-200"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Seed trước</span>
              <span className="block truncate text-sm font-bold text-gray-900">{previous.title}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/portal/library/${next.slug}`}
            className="flex items-center justify-end gap-2 rounded-xl border border-gray-100 bg-white/70 p-4 text-right shadow-sm backdrop-blur-sm transition hover:border-blue-200"
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Seed tiếp theo</span>
              <span className="block truncate text-sm font-bold text-gray-900">{next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {related.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link2 className="h-3.5 w-3.5" />
            Seed liên quan
          </p>
          <div className="flex flex-wrap gap-2">
            {related.map((seed) => (
              <Link
                key={seed.id}
                href={`/portal/library/${seed.slug}`}
                className="rounded-full border border-gray-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-gray-600 backdrop-blur-sm transition hover:border-blue-300 hover:text-blue-600"
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
