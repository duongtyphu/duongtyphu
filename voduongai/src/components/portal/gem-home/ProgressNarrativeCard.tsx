import { GemCard } from "@/components/portal/ui/GemCard";
import type { HumanFlowState } from "@/lib/portal/human-flow";

/**
 * Answers: "Tôi đang trưởng thành hơn như thế nào, không chỉ bằng bao nhiêu %?"
 */
export function ProgressNarrativeCard({ flow }: { flow: HumanFlowState }) {
  return (
    <GemCard variant="progress" className="h-full">
      <h2 className="gemos-card-title text-sm font-bold text-gray-900">{flow.currentStage}</h2>
      <p className="mt-2 text-sm text-gray-600">{flow.progressNarrative}</p>
    </GemCard>
  );
}
