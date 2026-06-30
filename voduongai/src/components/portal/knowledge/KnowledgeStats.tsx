import { GemCard } from "@/components/portal/ui/GemCard";
import type { KnowledgeStat } from "@/data/portal/knowledge-hub";

/**
 * Answers: "Tôi đã tích lũy được bao nhiêu tri thức và thực hành thật cho riêng mình?"
 */
export function KnowledgeStats({ stats }: { stats: KnowledgeStat[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">Thống kê Tri thức của bạn</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => (
          <GemCard key={s.label} className="text-center">
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="mt-1 text-xs text-gray-500">{s.label}</p>
          </GemCard>
        ))}
      </div>
    </section>
  );
}
