import { GemCard } from "@/components/portal/ui/GemCard";
import { GemProgress } from "@/components/portal/ui/GemProgress";
import type { MissionDay } from "@/data/portal/journey-hub";

const DOT_STYLE: Record<MissionDay["status"], string> = {
  completed: "bg-[#22D3EE] text-[#050B18]",
  current: "bg-[#FBBF24] text-[#050B18] gemos-glow-pulse",
  upcoming: "bg-white/[0.06] text-white/40",
};

/**
 * Answers: "Tôi đã duy trì được bao nhiêu ngày, và ngày hôm nay/sắp tới là gì?"
 */
export function Mission30DayCard({
  totalDays,
  currentDay,
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
        <h2 className="text-sm font-bold text-white">Nhiệm vụ 30 ngày</h2>
        <span className="text-xs font-semibold text-white/50">Ngày {currentDay}/{totalDays}</span>
      </div>
      <div className="mt-4">
        <GemProgress percent={(completedCount / totalDays) * 100} label="Tiến độ chuỗi 30 ngày" />
      </div>
      <div className="mt-4 grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))]">
        {days.map((d) => (
          <span
            key={d.day}
            title={`Ngày ${d.day}`}
            className={`flex aspect-square items-center justify-center rounded-md text-[10px] font-bold ${DOT_STYLE[d.status]}`}
          >
            {d.day}
          </span>
        ))}
      </div>
    </GemCard>
  );
}
