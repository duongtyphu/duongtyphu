import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import type { RecommendedItem } from "@/data/portal/gem-home";

/**
 * Answers: "Người dùng có biết nên dùng tài nguyên nào tiếp theo không, thay vì tự mò?"
 */
export function RecommendedResources({ items }: { items: RecommendedItem[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Gợi ý dành cho bạn</h2>
      <p className="mt-1 text-sm text-white/55">
        Không cần tự mò hết — đây là vài điều có thể có ích cho bước tiếp theo của bạn.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="block">
            <GemCard className="h-full">
              <GemBadge tone="free">{item.kind}</GemBadge>
              <h3 className="mt-3 text-sm font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-white/55">{item.description}</p>
            </GemCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
