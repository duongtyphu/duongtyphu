import Link from "next/link";
import { Layers, Building2, Bitcoin, Link2, LineChart, ShieldCheck } from "lucide-react";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { OpportunityAgentActions } from "@/components/portal/opportunities/OpportunityAgentActions";
import { CompanionTaskEntry } from "@/components/portal/companion/CompanionTaskEntry";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { Button } from "@/components/portal/ui/Button";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { getHumanFlowState } from "@/lib/portal/human-flow";

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
  const flow = getHumanFlowState("build");

  return (
    <div className="space-y-12">
      {/* Hero */}
      <PillarHero
        icon={LineChart}
        tone="opportunity"
        eyebrow="Projects & Opportunities · Opportunity-first"
        title="Những gì tôi đang thật sự theo dõi"
        subtitle="Không phải nơi khuyến nghị đầu tư. Đây là góc nhìn minh bạch về các hệ sinh thái tôi đang tham gia, nghiên cứu hoặc đã rút ra bài học — kể cả những sai lầm."
        quickActions={[
          { label: "Xem Tiêu chí đánh giá", href: "#tieu-chi" },
          { label: "Đọc bài học từ trải nghiệm", href: "/portal/nhatkyhoctap" },
        ]}
      />

      {/* Next Best Action */}
      <GemCard variant="action" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-brand-blue">
            Bước tiếp theo
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-900">{flow.nextBestAction}</p>
          <p className="mt-1 text-sm text-gray-600">{flow.reason}</p>
        </div>
        <Button href={flow.recommendedRoute} variant="primary" className="shrink-0">
          {flow.recommendedCTA}
        </Button>
      </GemCard>

      {/* Companion Guide */}
      <CompanionGuide
        message="Hãy đọc phần Giới thiệu và Tiêu chí đánh giá trước khi xem bất kỳ dự án nào. Tất cả chia sẻ ở đây là góc nhìn cá nhân — không phải lời khuyên tài chính."
        action={{ label: "Xem bài học từ trải nghiệm", href: "/portal/nhatkyhoctap" }}
      />

      {/* Companion Task Entry */}
      <CompanionTaskEntry
        module="opportunities"
        heading="Phân tích cùng Companion"
        placeholder="VD: Mình đang cân nhắc tham gia SolarGroup, giúp mình nhìn rõ hơn..."
      />

      {/* Introduction */}
      <GemCard>
        <h2 className="gemos-card-title mb-3 text-base font-bold text-gray-900">Giới thiệu</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          VO DUONG AI không phải là nền tảng tư vấn đầu tư. Trang này tồn tại vì tôi tin vào sự minh bạch — thay vì chỉ chia sẻ thành công, tôi muốn chia sẻ đầy đủ: những gì tôi đang theo dõi, tại sao, những điều tôi chưa chắc chắn, và những bài học từ sai lầm.
        </p>
        <p className="text-sm leading-relaxed text-gray-600">
          Mọi quyết định tài chính là quyết định của bạn. Nghiên cứu kỹ trước khi tham gia bất kỳ dự án nào.
        </p>
      </GemCard>

      {/* Criteria */}
      <section id="tieu-chi">
        <SectionHeader eyebrow="Nguyên tắc" title="Tiêu chí chia sẻ của tôi" />
        <div className="space-y-2">
          {CRITERIA.map((c, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-token-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-sm text-gray-600">{c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem cards */}
      <section>
        <SectionHeader eyebrow="Đang theo dõi" title="Các hệ sinh thái" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEMS.map((item) => (
            <GemCard key={item.title}>
              <Link href={item.href} className="block">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <GemBadge tone="locked">{item.status}</GemBadge>
                </div>
                <h3 className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{item.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
              </Link>
              <OpportunityAgentActions
                projectName={item.title}
                opportunityType={item.status}
                riskContext={item.description}
              />
            </GemCard>
          ))}
        </div>
      </section>

      {/* Learning / Progress — honest: no engagement-tracking exists for this page yet */}
      <section>
        <SectionHeader eyebrow="Của bạn" title="Mức độ quan tâm của bạn" />
        <GemCard>
          <p className="text-sm text-gray-500">
            Portal chưa theo dõi bạn đã xem/quan tâm hệ sinh thái nào — tính năng này chưa tồn tại, nên
            không hiển thị số liệu giả ở đây. Hiện tại, cách tốt nhất để &ldquo;lưu vết&rdquo; quan tâm
            của bạn là ghi lại vào Nhật ký học tập.
          </p>
          <Button href="/portal/nhatkyhoctap" variant="secondary" className="mt-3">
            Mở nhật ký học tập
          </Button>
        </GemCard>
      </section>

      {/* FAQ */}
      <section>
        <SectionHeader title="Câu hỏi thường gặp" />
        <div className="space-y-3">
          {FAQ.map((item) => (
            <GemCard key={item.q}>
              <p className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{item.q}</p>
              <p className="text-sm leading-relaxed text-gray-500">{item.a}</p>
            </GemCard>
          ))}
        </div>
      </section>

      {/* Next step */}
      <GemCard className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Tiếp theo bạn nên...</p>
          <p className="text-sm text-gray-600">Đọc bài viết về các chủ đề liên quan trước khi quyết định bất cứ điều gì.</p>
        </div>
        <Button href="/portal/nhatkyhoctap" variant="secondary" className="shrink-0">
          Đọc bài viết →
        </Button>
      </GemCard>
    </div>
  );
}
