import { GemCard } from "@/components/portal/ui/GemCard";
import { GemProgress } from "@/components/portal/ui/GemProgress";
import type { GrowthDetailDimension } from "@/data/portal/journey-hub";

/**
 * Answers: "Tôi đang trưởng thành như thế nào ở từng khía cạnh, và nên cải thiện điều gì?"
 */
export function HumanGrowthDetail({ dimensions }: { dimensions: GrowthDetailDimension[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">Human Growth chi tiết</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {dimensions.map((d) => (
          <GemCard key={d.key}>
            <GemProgress percent={d.percent} label={d.label} />
            <p className="mt-3 text-xs text-gray-500">{d.description}</p>
            <p className="mt-2 text-xs font-semibold text-[#A78BFA]">Gợi ý: {d.tip}</p>
          </GemCard>
        ))}
      </div>
    </section>
  );
}
