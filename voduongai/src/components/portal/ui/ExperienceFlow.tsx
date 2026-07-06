import type { LucideIcon } from "lucide-react";

// Portal 3.0 — Product Transformation Wave 3 (Experience Reconstruction).
//
// Purely descriptive — explains HOW this pillar is meant to be used
// (Explore -> Learn -> Apply -> Continue, Decision flow, Value flow...),
// not a personalized progress tracker. Deliberately does NOT claim "bạn
// đang ở bước X" with a fake percentage/highlight, since there is no real
// per-user stage data behind it — that would be exactly the "fake
// progress" the brief forbids. It reframes the page as an activity
// ("bạn đang khám phá/học/quyết định...") rather than a destination.
export type FlowStage = { icon: LucideIcon; label: string; description: string };

export function ExperienceFlow({ stages }: { stages: FlowStage[] }) {
  return (
    <div className="flex flex-wrap items-stretch gap-2 rounded-2xl border border-gray-100 bg-white/60 p-3 sm:gap-0 sm:divide-x sm:divide-gray-100">
      {stages.map((s, i) => (
        <div key={s.label} className="flex flex-1 items-start gap-2 px-2 sm:px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <s.icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-300">Bước {i + 1}</p>
            <p className="text-xs font-bold text-gray-900">{s.label}</p>
            <p className="text-[11px] leading-snug text-gray-500">{s.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
