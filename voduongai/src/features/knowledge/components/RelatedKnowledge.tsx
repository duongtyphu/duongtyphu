import Link from "next/link";
import { Link2 } from "lucide-react";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

/** Feature 08 — Related Knowledge: "Có thể bạn cũng cần", cuối mỗi Seed, không ngắt quãng hành trình. */
export function RelatedKnowledge({ seeds }: { seeds: KnowledgeSeed[] }) {
  if (seeds.length === 0) return null;
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Link2 className="h-3.5 w-3.5" />
        Có thể bạn cũng cần
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {seeds.map((seed) => (
          <Link
            key={seed.id}
            href={`/portal/hetrithucai/${seed.slug}`}
            className="rounded-xl border border-gray-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition hover:border-blue-200"
          >
            <p className="text-sm font-bold text-gray-900">{seed.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{seed.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
