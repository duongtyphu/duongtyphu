import { Sprout } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Tôi đang trưởng thành như thế nào?" — không điểm số, không Level, không Rank.
 */
export function HumanGrowthDashboardCard({ qualities }: { qualities: string[] }) {
  return (
    <GemCard>
      <div className="flex items-center gap-2">
        <Sprout className="h-4 w-4 text-blue-600" />
        <h2 className="gemos-card-title text-sm font-bold text-gray-900">Tôi đang trưởng thành như thế nào?</h2>
      </div>
      {qualities.length === 0 ? (
        <p className="mt-3 text-sm text-gray-600">
          Những hạt giống trưởng thành của bạn sẽ xuất hiện khi bạn có thêm vài suy ngẫm trong My Story.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {qualities.map((q) => (
            <li key={q} className="flex items-center gap-2 text-sm text-gray-600">
              <span aria-hidden>🌱</span>
              {q}
            </li>
          ))}
        </ul>
      )}
    </GemCard>
  );
}
