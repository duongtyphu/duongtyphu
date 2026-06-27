import { Sparkles } from "lucide-react";
import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { AiConnectTip } from "@/data/portal/connect-os";

/**
 * Answers: "Trong cả Hệ Kết Nối rộng lớn này, tôi nên bắt đầu kết nối từ đâu hôm nay?"
 */
export function AIConnectCoach({ tip }: { tip: AiConnectTip }) {
  return (
    <GemCard variant="featured">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#22D3EE]" />
        <h2 className="text-sm font-bold text-white">AI Connect Coach</h2>
      </div>
      <p className="mt-3 text-sm text-white/70">{tip.message}</p>
      <Button href={tip.href} variant="primary" className="mt-4">
        {tip.cta} →
      </Button>
    </GemCard>
  );
}
