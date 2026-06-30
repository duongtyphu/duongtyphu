import Link from "next/link";
import { Search, Sparkles, Wrench, FileText, Gift, ListChecks, ClipboardList, BookOpen, LayoutTemplate } from "lucide-react";
import { CompanionGuide } from "@/components/portal/CompanionGuide";

export const metadata = {
  title: "Thư viện tri thức",
  description: "Kho tri thức AI thực chiến — Prompt, Checklist, SOP, Template, PDF, Ebook và tài nguyên miễn phí.",
};

const CATEGORIES = [
  {
    icon: Sparkles,
    title: "Prompt AI",
    description: "Thư viện prompt thực chiến, copy và dùng ngay cho công việc hàng ngày.",
    href: "/portal/prompts",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: ListChecks,
    title: "Checklist",
    description: "Danh sách kiểm tra cho từng mục tiêu — không bỏ sót bước nào.",
    href: "/portal/checklists",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: ClipboardList,
    title: "Framework",
    description: "Khung tư duy và phương pháp hệ thống để giải quyết vấn đề hiệu quả.",
    href: "/portal/sop",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Wrench,
    title: "SOP",
    description: "Quy trình chuẩn vận hành — chạy một lần, dùng mãi mãi.",
    href: "/portal/sop",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: LayoutTemplate,
    title: "Template",
    description: "Mẫu nội dung, kế hoạch và tài liệu dùng lại nhanh trong 5 phút.",
    href: "/portal/templates",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: FileText,
    title: "PDF",
    description: "Tài liệu PDF chuyên sâu, sẵn sàng tải về và đọc offline.",
    href: "/portal/resources",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: BookOpen,
    title: "Ebook",
    description: "Sách điện tử tổng hợp kiến thức — học sâu hơn từ nền tảng đến nâng cao.",
    href: "/portal/resources",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Gift,
    title: "Tài nguyên miễn phí",
    description: "Tổng hợp tài nguyên không cần trả phí — bắt đầu ngay từ hôm nay.",
    href: "/portal/resources",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function KnowledgeLibraryPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
            <BookOpen className="h-4 w-4 text-violet-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Thư viện tri thức</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Knowledge Library</h1>
        <p className="max-w-2xl text-gray-500">
          Không phải Blog. Đây là kho tri thức thực chiến — Prompt, Checklist, SOP, Template, PDF, Ebook — được tổ chức để bạn tìm đúng thứ cần, dùng ngay.
        </p>
      </div>

      {/* Companion Guide */}
      <CompanionGuide
        message="Nếu chưa biết nên đọc gì trước, mình gợi ý bắt đầu từ Prompt AI — vì prompt là cách bạn giao tiếp với AI. Sau đó hãy thử các Checklist để xây thói quen hệ thống."
        action={{ label: "Xem Prompt nổi bật", href: "/portal/prompts" }}
      />

      {/* Search hint */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/[0.02] px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <p className="text-sm text-gray-400">
          Tìm kiếm tài nguyên cụ thể qua{" "}
          <Link href="/portal" className="text-gray-600 underline underline-offset-2 hover:text-gray-900">
            thanh tìm kiếm Portal
          </Link>
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Danh mục tài nguyên</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-gray-200 hover:bg-white/[0.06]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} ${item.color} mb-4`}>
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className={`mb-2 text-sm font-bold text-gray-900 group-hover:${item.color}`}>{item.title}</h3>
              <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured resources link */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white/[0.02] p-5">
        <div>
          <p className="text-sm font-bold text-gray-900">Mới cập nhật</p>
          <p className="mt-1 text-xs text-gray-500">Tài nguyên được thêm gần đây nhất</p>
        </div>
        <Link
          href="/portal/resources"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-200 hover:text-gray-900"
        >
          Xem tất cả →
        </Link>
      </div>
    </div>
  );
}
