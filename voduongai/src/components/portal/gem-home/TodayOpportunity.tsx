import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";

export type OpportunityItem = {
  id: string;
  title: string;
  description: string;
  href: string;
};

/**
 * Answers: "Người dùng có thấy đây là một cơ hội học hỏi/phát triển, không phải một lượt bán hàng?"
 */
export function TodayOpportunity({ items }: { items: OpportunityItem[] }) {
  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-gray-900">Cơ hội hôm nay</h2>
        <Link href="/portal/build" className="text-sm font-semibold text-blue-600 hover:underline">
          Xem tất cả →
        </Link>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Những cơ hội học hỏi và phát triển đang chờ bạn khám phá — không có gì cần vội.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <GemCard key={item.id} className="flex h-full flex-col">
            <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
            <p className="mt-1.5 flex-1 text-xs text-gray-500">{item.description}</p>
            <Button href={item.href} variant="secondary" className="mt-3 self-start">
              Khi bạn sẵn sàng, tìm hiểu thêm →
            </Button>
          </GemCard>
        ))}
      </div>
    </section>
  );
}
