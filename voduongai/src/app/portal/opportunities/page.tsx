import Link from "next/link";
import { Boxes, Layers, Building2, Bitcoin, Link2, LineChart } from "lucide-react";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";

export const metadata = { title: "Dự án & Cơ hội", description: "ĐẦU TƯ CÙNG TÔI — các dự án và cơ hội xây tài sản, di sản số dài hạn." };

const ITEMS = [
  { icon: Boxes, title: "Tổng quan ĐẦU TƯ CÙNG TÔI", description: "Toàn cảnh các dự án và cơ hội đang đồng hành.", href: "/portal/digital-assets" },
  { icon: Layers, title: "Hệ sinh thái DigiU", description: "Khám phá hệ sinh thái DigiU.", href: "/portal/digital-assets/category/digiu" },
  { icon: Building2, title: "Đầu tư cổ phần SolarGroup", description: "Cơ hội đầu tư cổ phần dài hạn.", href: "/portal/digital-assets/category/equity" },
  { icon: Bitcoin, title: "Sàn giao dịch Crypto", description: "Các sàn giao dịch Crypto được đề xuất.", href: "/portal/digital-assets/category/crypto" },
  { icon: Link2, title: "Blockchain", description: "Dự án và kiến thức Blockchain.", href: "/portal/digital-assets/category/blockchain" },
  { icon: LineChart, title: "Trading", description: "Tài nguyên và cơ hội Trading.", href: "/portal/digital-assets/category/trading" },
];

export default function OpportunitiesHubPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dự án & Cơ hội"
        description="Những cơ hội đồng hành để bạn xây tài sản và di sản số dài hạn."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <GemCard className="h-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 text-[#A78BFA]">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-white/60">{item.description}</p>
            </GemCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
