import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";

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
      <SectionHeader
        eyebrow="Projects & Opportunities"
        title="Cơ hội hôm nay"
        description="Những cơ hội học hỏi và phát triển đang chờ bạn khám phá — không có gì cần vội."
        action={
          <Link href="/portal/duan-cohoi" className="text-sm font-semibold text-blue-600 hover:underline">
            Xem tất cả →
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
