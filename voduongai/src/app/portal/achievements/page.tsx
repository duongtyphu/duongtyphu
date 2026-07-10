import Link from "next/link";
import { TrendingUp, BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";

export const metadata = { title: "Thành tựu", description: "Case Study và thành công học viên — những viên ngọc đã tỏa sáng trong hệ sinh thái." };

const ITEMS = [
  { icon: TrendingUp, title: "Case Study", description: "Những câu chuyện thực chiến và kết quả cụ thể.", href: "/portal/case-studies" },
  { icon: BadgeCheck, title: "Câu chuyện cộng đồng", description: "Hành trình tỏa sáng của những người học cùng VO DUONG AI.", href: "/portal/congdongai" },
];

export default function AchievementsHubPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Thành tựu"
        description="Mỗi viên ngọc đã tỏa sáng đều bắt đầu từ một bước đi nhỏ — đây là những câu chuyện đó."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <GemCard variant="success" className="h-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FBBF24]/25 to-[#7C3AED]/20 text-[#FBBF24]">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
            </GemCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
