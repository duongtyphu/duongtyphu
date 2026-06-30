import Link from "next/link";
import { GraduationCap, Rocket, UserCircle, ArrowRight, HelpCircle } from "lucide-react";
import { CompanionGuide } from "@/components/portal/CompanionGuide";

export const metadata = {
  title: "Học viện",
  description: "Học viện AI, Affiliate và Thương hiệu cá nhân — lộ trình học bài bản từ nền tảng đến ứng dụng thực chiến.",
};

const TRACKS = [
  {
    icon: GraduationCap,
    title: "Học viện AI",
    description: "Lộ trình học AI từ nền tảng đến ứng dụng thực chiến trong công việc và kinh doanh.",
    href: "/portal/ai-academy",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Phổ biến nhất",
    outcomes: ["Hiểu AI hoạt động như thế nào", "Viết prompt hiệu quả", "Ứng dụng AI vào công việc hàng ngày"],
  },
  {
    icon: Rocket,
    title: "Học viện Affiliate",
    description: "Xây hệ thống Affiliate Marketing bài bản từ chọn ngách, tạo nội dung đến vận hành thu nhập thụ động.",
    href: "/portal/vdai-academy",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    tag: null,
    outcomes: ["Chọn đúng ngách Affiliate", "Xây kênh nội dung", "Tạo thu nhập thụ động"],
  },
  {
    icon: UserCircle,
    title: "Thương hiệu cá nhân",
    description: "Định vị bản thân, xây dựng nội dung nhất quán và phát triển hình ảnh cá nhân trong lĩnh vực AI.",
    href: "/portal/personal-brand",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    tag: null,
    outcomes: ["Xác định định vị cá nhân", "Xây kế hoạch nội dung", "Phát triển cộng đồng"],
  },
];

const LEARNING_PATH = [
  { step: "01", label: "Học viện AI", description: "Nền tảng bắt buộc — AI là công cụ nền của mọi hệ thống.", href: "/portal/ai-academy" },
  { step: "02", label: "Thư viện tri thức", description: "Tải Prompt, SOP và Template để áp dụng ngay.", href: "/portal/library" },
  { step: "03", label: "Học viện Affiliate", description: "Biến kiến thức thành thu nhập qua hệ thống Affiliate.", href: "/portal/vdai-academy" },
  { step: "04", label: "Dự án & Cơ hội", description: "Tham gia các dự án đang đồng hành để học qua thực chiến.", href: "/portal/opportunities" },
];

const FAQ = [
  {
    q: "Tôi nên bắt đầu từ đâu nếu chưa biết gì về AI?",
    a: "Bắt đầu từ Học viện AI — đặc biệt là module ChatGPT cơ bản. Bạn sẽ nắm được nền tảng trong vòng 2-3 giờ.",
  },
  {
    q: "Tôi có thể học Affiliate mà không cần biết AI không?",
    a: "Được, nhưng việc kết hợp AI sẽ giúp bạn tạo nội dung nhanh hơn 5-10 lần. Chúng tôi khuyến nghị học song song.",
  },
  {
    q: "Các khóa học có cập nhật không?",
    a: "Có. Chúng tôi cập nhật nội dung mỗi khi có thay đổi đáng kể từ các nền tảng AI hoặc Affiliate.",
  },
];

export default function AcademyHubPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <GraduationCap className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Học viện</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Học theo lộ trình</h1>
        <p className="max-w-2xl text-gray-500">
          Mỗi viên ngọc cần thời gian để mài giũa. Học viện giúp bạn đi đúng hướng — không đốt thời gian vào những thứ không cần thiết.
        </p>
      </div>

      {/* Companion Guide */}
      <CompanionGuide
        message="Nếu bạn mới bắt đầu, hãy chọn Học viện AI trước. Nền tảng AI tốt sẽ giúp bạn học mọi thứ khác nhanh hơn gấp đôi."
        action={{ label: "Xem lộ trình đề xuất", href: "/portal/journey" }}
      />

      {/* Learning Path */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Lộ trình học đề xuất</p>
        <div className="space-y-2">
          {LEARNING_PATH.map((item) => (
            <Link
              key={item.step}
              href={item.href}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white/[0.02] p-4 transition hover:border-gray-200 hover:bg-white/[0.05]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-xs font-bold text-gray-400">
                {item.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-gray-500" />
            </Link>
          ))}
        </div>
      </div>

      {/* Tracks */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Chương trình học</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((t) => (
            <Link key={t.href} href={t.href} className="group block">
              <div className="h-full rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-gray-200 hover:bg-white/[0.06]">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.bg} ${t.color}`}>
                    <t.icon className="h-5 w-5" />
                  </div>
                  {t.tag && (
                    <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold text-brand-orange">
                      {t.tag}
                    </span>
                  )}
                </div>
                <h3 className={`mb-2 text-sm font-bold text-gray-900 group-hover:${t.color}`}>{t.title}</h3>
                <p className="mb-4 text-xs leading-relaxed text-gray-500">{t.description}</p>
                <ul className="space-y-1">
                  {t.outcomes.map((o) => (
                    <li key={o} className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-white/20" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mentoring CTA */}
      <div className="rounded-xl border border-brand-violet/20 bg-brand-violet/5 p-6">
        <h3 className="mb-2 text-base font-bold text-gray-900">Cần hỗ trợ riêng?</h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          Nếu bạn muốn được hỗ trợ cá nhân hoá — chọn đúng lộ trình, giải quyết vướng mắc cụ thể — hãy liên hệ để được mentoring 1-1.
        </p>
        <Link
          href="/portal/community"
          className="inline-block rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-200 hover:text-gray-900"
        >
          Kết nối cộng đồng →
        </Link>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-gray-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Câu hỏi thường gặp</p>
        </div>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-xl border border-gray-200 bg-white/[0.02] p-4">
              <p className="mb-2 text-sm font-bold text-gray-900">{item.q}</p>
              <p className="text-sm leading-relaxed text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
