import { Gem } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { MomentumSignal } from "@/data/portal/living-portal";

/**
 * Answers: "Động lực của tôi được giữ bằng ý nghĩa, không chỉ bằng điểm số?"
 */
export function HumanMomentumCard({ signals, closing }: { signals: MomentumSignal[]; closing: string }) {
  return (
    <GemCard className="h-full">
      <div className="flex items-center gap-2">
        <Gem className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-bold text-gray-900">Điều đang giữ bạn tiếp tục</h2>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
        {signals.map((s) => (
          <li key={s.id}>• {s.message}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm font-semibold text-gray-900/85">{closing}</p>
    </GemCard>
  );
}
