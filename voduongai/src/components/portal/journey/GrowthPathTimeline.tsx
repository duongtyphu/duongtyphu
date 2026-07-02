import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import type { GrowthPathStep } from "@/data/portal/journey-hub";

const STATUS_STYLE = {
  completed: { icon: CheckCircle2, dot: "border-blue-500 bg-blue-50 text-blue-600", text: "text-gray-900" },
  current: { icon: Circle, dot: "border-orange-400 bg-orange-50 text-orange-500", text: "text-gray-900" },
  locked: { icon: Lock, dot: "border-gray-200 bg-gray-50 text-gray-400", text: "text-gray-400" },
} as const;

/**
 * Answers: "Tôi đang ở bước nào trong 7 chặng trưởng thành, và bước nào đã qua/sắp tới?"
 */
export function GrowthPathTimeline({ steps }: { steps: GrowthPathStep[] }) {
  return (
    <GemCard>
      <h2 className="gemos-card-title text-sm font-bold text-gray-900">Growth Path</h2>
      <ol className="mt-5 space-y-0">
        {steps.map((step, i) => {
          const style = STATUS_STYLE[step.status];
          const Icon = style.icon;
          const isLast = i === steps.length - 1;
          return (
            <li key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
              {!isLast && (
                <span
                  className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px"
                  style={{ background: step.status === "locked" ? "#E5E7EB" : "linear-gradient(to bottom, #2563EB, rgba(37,99,235,0.15))" }}
                />
              )}
              <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${style.dot}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-sm font-bold tracking-wide ${style.text}`}>{step.label}</h3>
                  {step.status === "current" && (
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-500">Đang ở đây</span>
                  )}
                </div>
                <p className={`mt-1 text-xs ${step.status === "locked" ? "text-gray-400" : "text-gray-500"}`}>{step.description}</p>
                {step.status === "current" && step.href && (
                  <Button href={step.href} variant="secondary" className="mt-2.5 !px-4 !py-1.5 !text-xs">
                    Tiếp tục bước này →
                  </Button>
                )}
                {step.status === "completed" && step.href && (
                  <Link href={step.href} className="mt-2.5 inline-flex text-xs font-semibold text-blue-600 hover:underline">
                    Xem lại →
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </GemCard>
  );
}
