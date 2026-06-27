import { Compass } from "lucide-react";
import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { HumanFlowState } from "@/lib/portal/human-flow";

/**
 * Answers: "Tôi nên làm gì tiếp theo, và vì sao điều đó quan trọng?"
 */
export function NextBestActionCard({ flow }: { flow: HumanFlowState }) {
  return (
    <GemCard variant="featured">
      <div className="flex items-center gap-2">
        <Compass className="h-4 w-4 text-[#22D3EE]" />
        <h2 className="text-sm font-bold text-white">Bước tiếp theo của bạn</h2>
      </div>
      {flow.hardTimeLine && <p className="mt-3 text-sm text-white/70">{flow.hardTimeLine}</p>}
      <p className="mt-3 text-sm font-semibold text-white">{flow.nextBestAction}</p>
      <p className="mt-2 text-sm text-white/65">{flow.reason}</p>
      <Button href={flow.recommendedRoute} variant="primary" className="mt-4">
        {flow.recommendedCTA} →
      </Button>
    </GemCard>
  );
}
