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
      <h2 className="gemos-card-title text-sm font-bold text-gray-900">Tiếp tục học</h2>
      <Link href={item.href} className="group mt-3 block rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-4 transition hover:border-violet-200">
        <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">{item.title}</h3>
        <p className="mt-1 text-xs text-gray-500">{item.description}</p>
        <div className="mt-3">
          <GemProgress percent={item.progressPercent} />
        </div>
        <span className="mt-3 inline-flex text-xs font-semibold text-blue-600">Tiếp tục học →</span>
      </Link>
    </GemCard>
  );
}
