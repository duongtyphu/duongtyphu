import { GemCard } from "@/components/portal/ui/GemCard";
import { GemProgress } from "@/components/portal/ui/GemProgress";
import type { ConnectProgressDimension } from "@/data/portal/connect-os";

/**
 * Answers: "Tôi đã thực sự kết nối, đóng góp và tạo tác động được bao nhiêu?"
 */
export function ConnectProgressCard({ dimensions }: { dimensions: ConnectProgressDimension[] }) {
  return (
    <GemCard variant="progress">
      <h2 className="gemos-card-title text-sm font-bold text-gray-900">Connect Progress</h2>
      <div className="mt-4 space-y-4">
        {dimensions.map((d) => (
          <GemProgress key={d.id} percent={d.percent} label={d.label} />
        ))}
      </div>
    </GemCard>
  );
}
