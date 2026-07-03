import { JOURNEY_TIMELINE_MILESTONES, type JourneyStage } from "../types/journey.types";

/**
 * Feature 04 — Journey Timeline. KHÔNG phải timeline thời gian, là timeline
 * trưởng thành: 🌱 Khám phá → 📘 Hiểu → ✍️ Thực hành → 🚀 Áp dụng → 🌿 Trưởng thành.
 */
export function JourneyTimeline({ currentStage }: { currentStage: JourneyStage }) {
  const activeIndex = JOURNEY_TIMELINE_MILESTONES.findIndex(
    (m) => (m.stages as readonly JourneyStage[]).includes(currentStage)
  );
  // Nếu currentStage chưa khớp milestone nào (chưa bắt đầu), coi như đang ở mốc "Khám phá".
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="flex items-center justify-between">
      {JOURNEY_TIMELINE_MILESTONES.map((milestone, i) => {
        const state = i < resolvedIndex ? "done" : i === resolvedIndex ? "active" : "upcoming";
        return (
          <div key={milestone.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-base transition ${
                  state === "active"
                    ? "bg-emerald-500 text-white shadow-md"
                    : state === "done"
                      ? "bg-emerald-100"
                      : "bg-gray-100 opacity-50"
                }`}
              >
                {milestone.emoji}
              </span>
              <span
                className={`text-[10px] font-semibold ${
                  state === "active" ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {milestone.label}
              </span>
            </div>
            {i < JOURNEY_TIMELINE_MILESTONES.length - 1 && (
              <div className={`mx-1 h-px flex-1 ${i < resolvedIndex ? "bg-emerald-300" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
