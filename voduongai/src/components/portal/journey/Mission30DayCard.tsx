import { GemCard } from "@/components/portal/ui/GemCard";
import { GemProgress } from "@/components/portal/ui/GemProgress";
import type { MissionDay } from "@/data/portal/journey-hub";

const DOT_STYLE: Record<MissionDay["status"], string> = {
  completed: "bg-gradient-to-br from-blue-500 to-violet-500 text-white",
  current: "bg-orange-400 text-white",
  upcoming: "bg-gray-100 text-gray-400",
};

/**
 * Answers: "Những cột mốc nào tôi đã đi qua trong 30 ngày đầu tiên?"
 */
export function Mission30DayCard({
  totalDays,
  days,
}: {
  totalDays: number;
  currentDay: number;
  days: MissionDay[];
}) {
  const completedCount = days.filter((d) => d.status === "completed").length;

  return (
    <GemCard>
      <div className="flex items-center justify-between">
        <h2 className="gemos-card-title text-sm font-bold text-gray-900">30 ngày đầu tiên</h2>
        <span className="text-xs font-semibold text-gray-500">{completedCount}/{totalDays} cột mốc</span>
      </div>
      <div className="mt-4">
        <GemProgress percent={(completedCount / totalDays) * 100} label="Các cột mốc trong 30 ngày đầu" />
      </div>
      <div className="mt-4 grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))]">
        {days.map((d) => (
          <span
            key={d.day}
            title={`Ngày ${d.day}`}
            className={`mission-day-dot flex aspect-square cursor-default items-center justify-center rounded-md text-[10px] font-bold transition-transform duration-150 ease-out hover:-translate-y-1 hover:scale-110 hover:shadow-md ${DOT_STYLE[d.status]}`}
          >
            {d.day}
          </span>
        ))}
      </div>
    </GemCard>
  );
}
