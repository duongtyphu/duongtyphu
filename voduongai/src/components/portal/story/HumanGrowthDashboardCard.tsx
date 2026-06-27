import { Sprout } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Tôi đang trưởng thành như thế nào?" — không điểm số, không Level, không Rank.
 */
export function HumanGrowthDashboardCard({ qualities }: { qualities: string[] }) {
  return (
    <GemCard>
      <div className="flex items-center gap-2">
        <Sprout className="h-4 w-4 text-[#22D3EE]" />
        <h2 className="text-sm font-bold text-white">Tôi đang trưởng thành như thế nào?</h2>
      </div>
      {qualities.length === 0 ? (
        <p className="mt-3 text-sm text-white/65">
          Những hạt giống trưởng thành của bạn sẽ xuất hiện khi bạn có thêm vài suy ngẫm trong My Story.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {qualities.map((q) => (
            <li key={q} className="flex items-center gap-2 text-sm text-white/75">
              <span aria-hidden>🌱</span>
              {q}
            </li>
          ))}
        </ul>
      )}
    </GemCard>
  );
}
