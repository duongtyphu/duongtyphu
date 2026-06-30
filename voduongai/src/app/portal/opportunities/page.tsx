import Link from "next/link";
import { Layers, Building2, Bitcoin, Link2, LineChart, ShieldCheck, HelpCircle } from "lucide-react";
import { CompanionGuide } from "@/components/portal/CompanionGuide";

export const metadata = {
  title: "Dự án & Cơ hội",
  description: "VO DUONG AI chia sẻ các hệ sinh thái đang nghiên cứu, góc nhìn, bài học và cơ hội đồng hành — không phải nơi khuyến nghị đầu tư.",
};

const ECOSYSTEMS = [
  {
    icon: Layers,
    title: "Hệ sinh thái DigiU",
    description: "Nền tảng học và kiếm thu nhập số — mình đang đồng hành và chia sẻ trải nghiệm thực tế.",
    href: "/portal/digital-assets/category/digiu",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    status: "Đang theo dõi",
  },
  {
    icon: Building2,
    title: "SolarGroup",
    description: "Cơ hội đầu tư cổ phần dài hạn — mình đang nghiên cứu và chia sẻ góc nhìn cá nhân.",
    href: "/portal/digital-assets/category/equity",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    status: "Đang nghiên cứu",
  },
  {
    icon: Bitcoin,
    title: "Blockchain & Crypto",
    description: "Kiến thức nền tảng và các sàn giao dịch mình đã thử — bao gồm cả bài học từ sai lầm.",
    href: "/portal/digital-assets/category/crypto",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    status: "Chia sẻ trải nghiệm",
  },
  {
    icon: Link2,
    title: "Blockchain Projects",
    description: "Các dự án Blockchain mình đang theo dõi — tài liệu, whitepaper và đánh giá cá nhân.",
    href: "/portal/digital-assets/category/blockchain",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    status: "Đang theo dõi",
  },
  {
    icon: LineChart,
    title: "Trading",
    description: "Kiến thức và tài nguyên Trading — từ nền tảng đến chiến lược mình đã thử và rút ra bài học.",
    href: "/portal/digital-assets/category/trading",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    status: "Chia sẻ kiến thức",
  },
];

const CRITERIA = [
  "Mình đã thực sự tham gia và có trải nghiệm trực tiếp",
  "Góc nhìn trung thực — bao gồm cả điểm yếu và rủi ro",
  "Không cam kết lợi nhuận dưới bất kỳ hình thức nào",
  "Mọi quyết định tài chính là của bạn — mình chỉ chia sẻ góc nhìn",
];

const FAQ = [
  {
    q: "Đây có phải là lời khuyến nghị đầu tư không?",
    a: "Không. Tất cả nội dung ở đây là chia sẻ góc nhìn và trải nghiệm cá nhân của tôi. Bạn phải tự nghiên cứu và chịu trách nhiệm với quyết định tài chính của mình.",
  },
  {
    q: "Tại sao VO DUONG AI chia sẻ về các dự án này?",
    a: "Vì tôi tin rằng minh bạch về những gì mình đang theo dõi và tham gia sẽ giúp cộng đồng có nhiều góc nhìn hơn — không phải để ai đó làm theo tôi.",
  },
  {
    q: "Làm thế nào để tôi đánh giá một dự án?",
    a: "Đọc phần 'Tiêu chí đánh giá' của chúng tôi, đọc tài liệu gốc của dự án, tham gia cộng đồng để hỏi thêm, và chỉ tham gia với số tiền bạn sẵn sàng mất hoàn toàn.",
  },
];

export default function OpportunitiesHubPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
            <LineChart className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Dự án & Cơ hội</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Những gì tôi đang theo dõi</h1>
        <p className="max-w-2xl text-white/60">
          Đây là nơi VO DUONG AI chia sẻ các hệ sinh thái đang nghiên cứu, các dự án đang đồng hành, góc nhìn cá nhân, bài học — và cơ hội nếu phù hợp.
        </p>
      </div>

      {/* Companion Guide */}
      <CompanionGuide
        message="Hãy đọc phần Giới thiệu và Tiêu chí đánh giá trước khi xem bất kỳ dự án nào. Tất cả chia sẻ ở đây là góc nhìn cá nhân — không phải lời khuyên tài chính."
        action={{ label: "Xem bài học từ trải nghiệm", href: "/portal/news" }}
      />

      {/* Introduction */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-3 text-base font-bold text-white">Giới thiệu</h2>
        <p className="mb-4 text-sm leading-relaxed text-white/70">
          VO DUONG AI không phải là nền tảng tư vấn đầu tư. Trang này tồn tại vì tôi tin vào sự minh bạch — thay vì chỉ chia sẻ thành công, tôi muốn chia sẻ đầy đủ: những gì tôi đang theo dõi, tại sao, những điều tôi chưa chắc chắn, và những bài học từ sai lầm.
        </p>
        <p className="text-sm leading-relaxed text-white/70">
          Mọi quyết định tài chính là quyết định của bạn. Nghiên cứu kỹ trước khi tham gia bất kỳ dự án nào.
        </p>
      </div>

      {/* Criteria */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">Tiêu chí chia sẻ của tôi</p>
        </div>
        <div className="space-y-2">
          {CRITERIA.map((c, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/60" />
              <p className="text-sm text-white/70">{c}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem cards */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">Các hệ sinh thái đang theo dõi</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEMS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/40">
                  {item.status}
                </span>
              </div>
              <h3 className={`mb-2 text-sm font-bold text-white group-hover:${item.color}`}>{item.title}</h3>
              <p className="text-xs leading-relaxed text-white/55">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-white/30" />
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">Câu hỏi thường gặp</p>
        </div>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-2 text-sm font-bold text-white">{item.q}</p>
              <p className="text-sm leading-relaxed text-white/60">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next step */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/30">Tiếp theo bạn nên...</p>
          <p className="text-sm text-white/70">Đọc bài viết về các chủ đề liên quan trước khi quyết định bất cứ điều gì.</p>
        </div>
        <Link
          href="/portal/news"
          className="ml-4 shrink-0 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
        >
          Đọc bài viết →
        </Link>
      </div>
    </div>
  );
}
