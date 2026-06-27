import { Compass } from "lucide-react";
import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { FounderJourney } from "@/data/portal/build-os";

/**
 * Answers: "Liệu con đường kiến tạo này có thật, đã có ai đi qua và thành công chưa?"
 */
export function FounderJourneyCard({ journey }: { journey: FounderJourney }) {
  return (
    <GemCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#22D3EE]/15 text-[#22D3EE]">
        <Compass className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <h2 className="text-sm font-bold text-white">{journey.title}</h2>
        <p className="mt-1 text-xs text-white/55">{journey.description}</p>
      </div>
      <Button href={journey.href} variant="secondary" className="shrink-0">
        {journey.cta} →
      </Button>
    </GemCard>
  );
}
