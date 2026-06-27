import Link from "next/link";
import { Sparkles, Wrench, FileText, Gift, ListChecks, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";

export const metadata = { title: "Thư viện AI", description: "Prompt, công cụ, template, ebook, checklist và SOP — toàn bộ tài nguyên AI trong một nơi." };

const ITEMS = [
  { icon: Sparkles, title: "Prompt AI", description: "Thư viện prompt thực chiến, copy và dùng ngay.", href: "/portal/prompts" },
  { icon: Wrench, title: "Công cụ AI", description: "Các công cụ AI & phần mềm được tuyển chọn.", href: "/portal/tools" },
  { icon: FileText, title: "Template", description: "Mẫu nội dung, kế hoạch dùng lại nhanh.", href: "/portal/templates" },
  { icon: Gift, title: "Ebook", description: "Tài nguyên miễn phí giúp bạn học sâu hơn.", href: "/portal/resources" },
  { icon: ListChecks, title: "Checklist", description: "Danh sách việc cần làm cho từng mục tiêu.", href: "/portal/checklists" },
  { icon: ClipboardList, title: "SOP", description: "Quy trình chuẩn để vận hành nhất quán.", href: "/portal/sop" },
];

export default function LibraryHubPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Thư viện AI"
        description="Tất cả tài nguyên để bạn ứng dụng AI vào công việc — chọn đúng thứ bạn cần."
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
