import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemProgress } from "@/components/portal/ui/GemProgress";

export type ContinueLearningItem = {
  title: string;
  description: string;
  href: string;
  progressPercent: number;
};

/**
 * Answers: "Người dùng có dễ dàng quay lại đúng nơi mình đang học không?"
 */
export function ContinueLearningCard({ item }: { item: ContinueLearningItem }) {
  return (
    <GemCard>
      <h2 className="text-sm font-bold text-white">Tiếp tục học</h2>
      <Link href={item.href} className="mt-3 block rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-[#22D3EE]/30">
        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
        <p className="mt-1 text-xs text-white/55">{item.description}</p>
        <div className="mt-3">
          <GemProgress percent={item.progressPercent} />
        </div>
        <span className="mt-3 inline-flex text-xs font-semibold text-[#22D3EE]">Tiếp tục học →</span>
      </Link>
    </GemCard>
  );
}
