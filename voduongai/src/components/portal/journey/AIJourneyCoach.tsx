import { Sparkles } from "lucide-react";
import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { AiJourneyTip } from "@/data/portal/journey-hub";

/**
 * Answers: "AI nghĩ tôi nên tập trung vào điều gì tiếp theo trong hành trình này?"
 */
export function AIJourneyCoach({ tip }: { tip: AiJourneyTip }) {
  return (
    <GemCard variant="featured">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-500" />
        <h2 className="gemos-card-title text-sm font-bold text-gray-900">AI Journey Coach</h2>
      </div>
      <p className="mt-3 text-sm text-gray-600">{tip.message}</p>
      <Button href={tip.href} variant="primary" className="mt-4">
        {tip.cta} →
      </Button>
    </GemCard>
  );
}
