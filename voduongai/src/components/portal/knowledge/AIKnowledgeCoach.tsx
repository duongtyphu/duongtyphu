import { Sparkles } from "lucide-react";
import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { AiKnowledgeTip } from "@/data/portal/knowledge-hub";

/**
 * Answers: "Trong cả Hệ Tri Thức rộng lớn này, tôi nên bắt đầu từ đâu hôm nay?"
 */
export function AIKnowledgeCoach({ tip }: { tip: AiKnowledgeTip }) {
  return (
    <GemCard variant="featured">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#A78BFA]" />
        <h2 className="text-sm font-bold text-white">AI Knowledge Coach</h2>
      </div>
      <p className="mt-3 text-sm text-white/70">{tip.message}</p>
      <Button href={tip.href} variant="primary" className="mt-4">
        {tip.cta} →
      </Button>
    </GemCard>
  );
}
