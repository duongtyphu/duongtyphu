import Link from "next/link";
import { Users, Percent, Package, Handshake } from "lucide-react";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";

export const metadata = { title: "Kiếm thu nhập", description: "Affiliate Hub, hoa hồng giới thiệu, sản phẩm và dịch vụ — các cách tạo thu nhập cùng AI." };

const ITEMS = [
  { icon: Users, title: "Affiliate Hub", description: "Chọn ngách, chọn sản phẩm và xây hệ thống Affiliate đầu tiên.", href: "/portal/affiliate-hub" },
  { icon: Percent, title: "Hoa hồng giới thiệu", description: "Theo dõi hoa hồng từ việc giới thiệu khóa học, sản phẩm.", href: "/portal/referral" },
  { icon: Package, title: "Sản phẩm của tôi", description: "Quản lý các sản phẩm số bạn đã sở hữu.", href: "/portal/my-products" },
  { icon: Handshake, title: "Dịch vụ", description: "Các dịch vụ đồng hành cùng VO DUONG AI.", href: "/portal/services" },
];

export default function EarnHubPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Kiếm thu nhập"
        description="Biến tri thức AI thành thu nhập thực tế — từng bước, bền vững."
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
