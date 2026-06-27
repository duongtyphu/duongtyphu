import { Network } from "lucide-react";
import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { HumanNetwork } from "@/data/portal/connect-os";

/**
 * Answers: "Tôi không đơn độc — mình đang là một phần của mạng lưới những con người cùng trưởng thành."
 */
export function HumanNetworkCard({ network }: { network: HumanNetwork }) {
  return (
    <GemCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A78BFA]/15 text-[#A78BFA]">
        <Network className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <h2 className="text-sm font-bold text-white">{network.title}</h2>
        <p className="mt-1 text-xs text-white/55">{network.description}</p>
      </div>
      <Button href={network.href} variant="secondary" className="shrink-0">
        {network.cta} →
      </Button>
    </GemCard>
  );
}
