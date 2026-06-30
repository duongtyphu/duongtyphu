import Link from "next/link";
import { Users, MessageCircle, PlayCircle, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { CompanionGuide } from "@/components/portal/CompanionGuide";

export const metadata = {
  title: "Cộng đồng",
  description: "Kết nối với những người cùng hành trình AI & Affiliate — học hỏi, chia sẻ và phát triển cùng nhau.",
};

const COMMUNITIES = [
  {
    icon: Users,
    platform: "Facebook Group",
    title: "Nhóm Facebook VO DUONG AI",
    description: "Cộng đồng học viên AI & Affiliate lớn nhất — hỏi đáp, chia sẻ kết quả, cập nhật nội dung mới mỗi ngày.",
    audience: "Dành cho tất cả học viên và người quan tâm đến AI, Affiliate, Marketing.",
    activity: "Hoạt động mỗi ngày — bài đăng mới, hỏi đáp, case study thực tế.",
    href: siteConfig.community.facebookGroup,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    cta: "Tham gia nhóm",
  },
  {
    icon: MessageCircle,
    platform: "Zalo Group",
    title: "Cộng đồng Zalo",
    description: "Kênh cập nhật nhanh — tin tức AI, cơ hội mới, tài nguyên miễn phí được chia sẻ trực tiếp.",
    audience: "Dành cho người muốn cập nhật thông tin nhanh và kết nối trực tiếp.",
    activity: "Cập nhật hàng ngày — nội dung mới, cơ hội, tài nguyên miễn phí.",
    href: siteConfig.community.zaloGroup,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    cta: "Tham gia Zalo",
  },
  {
    icon: PlayCircle,
    platform: "YouTube",
    title: "Kênh YouTube VO DUONG",
    description: "Video hướng dẫn AI thực chiến, review công cụ, case study Affiliate và chia sẻ hành trình thực tế.",
    audience: "Dành cho người muốn học qua video — nội dung từ cơ bản đến nâng cao.",
    activity: "Video mới mỗi tuần — tutorial, review, vlog hành trình.",
    href: siteConfig.links.youtube,
    color: "text-red-400",
    bg: "bg-red-500/10",
    cta: "Xem kênh YouTube",
  },
];

const RULES = [
  "Tôn trọng mọi người — không phân biệt cấp độ, kinh nghiệm hay quan điểm.",
  "Chia sẻ thực tế — kết quả thật, câu hỏi thật, bài học thật.",
  "Không spam, không quảng cáo chéo mà không được phép.",
  "Đặt câu hỏi cụ thể — giúp người khác dễ hỗ trợ bạn hơn.",
  "Ghi nhận khi bạn học được điều gì từ người khác.",
];

const FAQ = [
  {
    q: "Tôi mới bắt đầu — nên tham gia nhóm nào trước?",
    a: "Bắt đầu với nhóm Facebook — đây là nơi hoạt động nhất với nội dung đa dạng nhất. Sau đó thêm Zalo để nhận cập nhật nhanh.",
  },
  {
    q: "Có sự kiện offline không?",
    a: "Có, thỉnh thoảng. Thông báo sự kiện được đăng trong nhóm Facebook và Zalo — hãy tham gia để không bỏ lỡ.",
  },
  {
    q: "Tôi có thể chia sẻ kết quả của mình không?",
    a: "Rất hoan nghênh! Chia sẻ kết quả thật — dù nhỏ — giúp cả cộng đồng có thêm động lực và bài học.",
  },
];

export default function CommunityPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Cộng đồng</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Không ai tiến hóa một mình</h1>
        <p className="max-w-2xl text-gray-500">
          Kết nối với những người cùng hành trình — học hỏi, chia sẻ kinh nghiệm thực tế, cập nhật kiến thức mới và phát triển cùng nhau.
        </p>
      </div>

      {/* Companion Guide */}
      <CompanionGuide
        message="Nếu bạn mới tham gia, hãy giới thiệu bản thân trong nhóm Facebook — đó là cách nhanh nhất để kết nối với những người cùng mục tiêu và nhận được hỗ trợ phù hợp."
        action={{ label: "Tham gia nhóm Facebook", href: siteConfig.community.facebookGroup }}
      />

      {/* New member guide */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <p className="text-sm font-bold text-gray-900">Bạn mới? Nên bắt đầu từ đây</p>
        </div>
        <div className="space-y-2">
          {[
            { step: "1", text: "Tham gia nhóm Facebook — giới thiệu bản thân và mục tiêu của bạn" },
            { step: "2", text: "Đọc bài ghim ở đầu nhóm — có tóm tắt tài nguyên và lộ trình học" },
            { step: "3", text: "Thêm Zalo để nhận cập nhật nhanh mỗi ngày" },
            { step: "4", text: "Đặt câu hỏi đầu tiên — đừng ngại, cộng đồng sẵn sàng hỗ trợ" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400">
                {item.step}
              </span>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Communities */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Các kênh cộng đồng</p>
        <div className="space-y-4">
          {COMMUNITIES.map((c) => (
            <div key={c.title} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="mb-4 flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.bg} ${c.color}`}>
                  <c.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{c.platform}</p>
                  <h3 className="mt-0.5 text-sm font-bold text-gray-900">{c.title}</h3>
                </div>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-gray-600">{c.description}</p>
              <div className="mb-4 space-y-1.5">
                <p className="text-xs text-gray-400">
                  <span className="font-semibold text-gray-500">Dành cho:</span> {c.audience}
                </p>
                <p className="text-xs text-gray-400">
                  <span className="font-semibold text-gray-500">Hoạt động:</span> {c.activity}
                </p>
              </div>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${c.color} border border-current/20 hover:bg-gray-50`}
              >
                {c.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Nội quy cộng đồng</p>
        <div className="space-y-2">
          {RULES.map((rule, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <span className="mt-0.5 text-xs font-bold text-gray-300">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-sm text-gray-600">{rule}</p>
            </div>
          ))}
        </div>
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

      {/* CTA */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
        <h3 className="mb-2 text-base font-bold text-gray-900">Sẵn sàng tham gia?</h3>
        <p className="mb-5 text-sm text-gray-500">Hàng trăm người đang học và chia sẻ mỗi ngày — đừng đi một mình.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={siteConfig.community.facebookGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            <Users className="h-4 w-4" />
            Tham gia Facebook
          </a>
          <a
            href={siteConfig.community.zaloGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-200 hover:text-gray-900"
          >
            <MessageCircle className="h-4 w-4" />
            Tham gia Zalo
          </a>
        </div>
      </div>
    </div>
  );
}
