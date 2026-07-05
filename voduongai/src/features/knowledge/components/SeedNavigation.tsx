import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

/** Knowledge Navigation — Previous/Next Seed, để người học không bị mất phương hướng. */
export function SeedNavigation({
  previous,
  next,
}: {
  previous: KnowledgeSeed | null;
  next: KnowledgeSeed | null;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/portal/hetrithucai/${previous.slug}`}
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
          href={`/portal/hetrithucai/${next.slug}`}
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
  );
}
