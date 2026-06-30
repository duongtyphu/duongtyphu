import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import type { RecommendedKnowledgeItem } from "@/data/portal/knowledge-hub";

/**
 * Answers: "Trong vô số lựa chọn, đâu là điều tốt nhất tôi nên xem tiếp theo?"
 */
export function RecommendedKnowledge({ items }: { items: RecommendedKnowledgeItem[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">Gợi ý dành cho bạn</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="block">
            <GemCard className="h-full transition hover:-translate-y-1">
              <GemBadge tone="free">{item.kind}</GemBadge>
              <h3 className="mt-3 text-sm font-bold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{item.description}</p>
            </GemCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
