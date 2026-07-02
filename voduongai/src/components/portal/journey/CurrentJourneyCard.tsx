import { GemCard } from "@/components/portal/ui/GemCard";
import { GemProgress } from "@/components/portal/ui/GemProgress";
import type { CurrentJourney } from "@/data/portal/journey-hub";

/**
 * Answers: "Tôi đang theo đuổi mục tiêu gì, và tổng thể tôi đã đi được bao xa?"
 */
export function CurrentJourneyCard({ journey }: { journey: CurrentJourney }) {
  const facts = [
    { label: "Mục tiêu chính", value: journey.goalLabel },
    { label: "Cấp độ hiện tại", value: journey.levelLabel },
    { label: "Thời gian học mỗi ngày", value: journey.dailyTimeLabel },
    { label: "Ngày bắt đầu", value: journey.startedAtLabel },
  ];

  return (
    <GemCard>
      <h2 className="gemos-card-title text-sm font-bold text-gray-900">Hành trình hiện tại</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {facts.map((f) => (
          <div key={f.label} className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-3">
            <p className="text-[11px] font-semibold text-gray-900/45">{f.label}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{f.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <GemProgress percent={journey.overallPercent} label="Tiến độ tổng thể" />
      </div>
    </GemCard>
  );
}
