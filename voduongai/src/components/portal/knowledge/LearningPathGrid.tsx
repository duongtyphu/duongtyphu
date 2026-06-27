import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemProgress } from "@/components/portal/ui/GemProgress";
import type { LearningPath } from "@/data/portal/knowledge-hub";

/**
 * Answers: "Tôi nên học theo lộ trình nào, và tôi đã đi được bao xa trên mỗi lộ trình?"
 */
export function LearningPathGrid({ paths }: { paths: LearningPath[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Lộ trình học</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((p) => (
          <Link key={p.id} href={p.href} className="block">
            <GemCard className="h-full transition hover:-translate-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">{p.title}</h3>
                <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/55">{p.level}</span>
              </div>
              <p className="mt-1.5 text-xs text-white/55">{p.description}</p>
              <div className="mt-4">
                <GemProgress percent={p.progressPercent} />
              </div>
            </GemCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
