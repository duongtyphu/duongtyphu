import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import type { GrowthPathStep } from "@/data/portal/journey-hub";

const STATUS_STYLE = {
  completed: { icon: CheckCircle2, dot: "border-[#22D3EE] bg-[#22D3EE]/15 text-blue-600", text: "text-white" },
  current: { icon: Circle, dot: "border-[#FBBF24] bg-[#FBBF24]/15 text-[#FBBF24] gemos-glow-pulse", text: "text-white" },
  locked: { icon: Lock, dot: "border-white/15 bg-gray-50 text-gray-400", text: "text-gray-400" },
} as const;

/**
 * Answers: "Tôi đang ở bước nào trong 7 chặng trưởng thành, và bước nào đã qua/sắp tới?"
 */
export function GrowthPathTimeline({ steps }: { steps: GrowthPathStep[] }) {
  return (
    <GemCard>
      <h2 className="text-sm font-bold text-gray-900">Growth Path</h2>
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
                  style={{ background: step.status === "locked" ? "rgba(255,255,255,0.08)" : "linear-gradient(to bottom, #22D3EE, rgba(34,211,238,0.15))" }}
                />
              )}
              <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${style.dot}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-sm font-bold tracking-wide ${style.text}`}>{step.label}</h3>
                  {step.status === "current" && (
                    <span className="rounded-full bg-[#FBBF24]/15 px-2 py-0.5 text-[10px] font-bold text-[#FBBF24]">Đang ở đây</span>
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
