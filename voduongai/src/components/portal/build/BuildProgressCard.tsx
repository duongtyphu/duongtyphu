import { GemCard } from "@/components/portal/ui/GemCard";
import { GemProgress } from "@/components/portal/ui/GemProgress";
import type { BuildProgressDimension } from "@/data/portal/build-os";

/**
 * Answers: "Tôi đã thực sự kiến tạo được bao nhiêu giá trị trên mỗi trụ cột?"
 */
export function BuildProgressCard({ dimensions }: { dimensions: BuildProgressDimension[] }) {
  return (
    <GemCard variant="progress">
      <h2 className="text-sm font-bold text-gray-900">Build Progress</h2>
      <div className="mt-4 space-y-4">
        {dimensions.map((d) => (
          <GemProgress key={d.id} percent={d.percent} label={d.label} />
        ))}
      </div>
    </GemCard>
  );
}
