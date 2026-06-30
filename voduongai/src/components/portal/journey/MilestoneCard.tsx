import { Award } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import type { Milestone } from "@/data/portal/journey-hub";

/**
 * Answers: "Mốc tiếp theo của tôi là gì, và tôi cần làm gì để đạt được?"
 */
export function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <GemCard variant="success">
      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-[#FBBF24]" />
        <h2 className="text-sm font-bold text-gray-900">Chứng chỉ &amp; Mốc tiếp theo</h2>
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-900">{milestone.certificateLabel}</p>
      <p className="mt-1 text-xs text-gray-500">Mốc tiếp theo: {milestone.nextMilestoneLabel}</p>
      <p className="mt-1 text-xs text-gray-900/45">{milestone.conditionLabel}</p>
      <Button href="/portal/legacy" variant="secondary" className="mt-4">
        Xem chứng chỉ →
      </Button>
    </GemCard>
  );
}
