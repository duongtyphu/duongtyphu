import { ProgressRing } from "@/components/portal/ui/ProgressRing";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Người dùng có cảm nhận được sự tiến bộ tích lũy của chính mình không?"
 */
export function GemProgressCard({ percent }: { percent: number }) {
  return (
    <GemCard variant="progress" className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
      <ProgressRing percent={percent} size={88} strokeWidth={8} />
      <div>
        <h2 className="gemos-card-title text-sm font-bold text-gray-900">Gem Progress</h2>
        <p className="mt-1 text-sm text-gray-600">
          Viên ngọc của bạn đã sáng hơn từng chút một qua mỗi hành động.
        </p>
      </div>
    </GemCard>
  );
}
