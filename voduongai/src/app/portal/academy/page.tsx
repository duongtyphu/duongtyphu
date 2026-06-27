import Link from "next/link";
import { GraduationCap, Rocket, UserCircle } from "lucide-react";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";

export const metadata = { title: "Học viện", description: "Học viện AI, Affiliate và Thương hiệu cá nhân — mài giũa tri thức để tỏa sáng." };

const TRACKS = [
  {
    icon: GraduationCap,
    title: "Học viện AI",
    description: "Lộ trình học AI từ nền tảng đến ứng dụng thực chiến trong công việc.",
    href: "/portal/ai-academy",
  },
  {
    icon: Rocket,
    title: "Học viện Affiliate",
    description: "Xây hệ thống Affiliate Marketing bài bản, từ chọn ngách đến vận hành.",
    href: "/portal/vdai-academy",
  },
  {
    icon: UserCircle,
    title: "Thương hiệu cá nhân",
    description: "Định vị, lên kế hoạch nội dung và xây hình ảnh cá nhân nhất quán.",
    href: "/portal/personal-brand",
  },
];

export default function AcademyHubPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Học viện"
        description="Mỗi viên ngọc cần thời gian để mài giũa — chọn lộ trình phù hợp với bạn."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((t) => (
          <Link key={t.href} href={t.href} className="block">
            <GemCard className="h-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 text-[#A78BFA]">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">{t.title}</h3>
              <p className="mt-1 text-sm text-white/60">{t.description}</p>
            </GemCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
