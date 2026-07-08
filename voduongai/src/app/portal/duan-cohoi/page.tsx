import Link from "next/link";
import { Layers, Building2, Bitcoin, Link2, LineChart, ShieldCheck } from "lucide-react";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { CompanionTaskEntry } from "@/components/portal/companion/CompanionTaskEntry";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { Button } from "@/components/portal/ui/Button";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";

export const metadata = {
  title: "Dự án & Cơ hội",
  description: "VO DUONG AI chia sẻ các hệ sinh thái đang nghiên cứu, góc nhìn, bài học và cơ hội đồng hành — không phải nơi khuyến nghị đầu tư.",
};

/**
 * Portal 4.0 Phase 7 — Projects & Opportunities Experience. Mỗi hệ sinh
 * thái giờ trả lời "ai phù hợp / ai chưa nên tham gia / nên học gì trước /
 * kỳ vọng thực tế là gì" — theo hợp đồng CKOS đã đóng băng, Case Study là
 * consumer chính của pillar này nhưng bảng `case_studies` hiện có 0 dòng,
 * nên mỗi thẻ trỏ về trang Case Study chung với trạng thái trung thực thay
 * vì bịa "câu chuyện thành công" hay ROI cho riêng hệ sinh thái này.
 */
const ECOSYSTEMS = [
  {
    key: "digiu",
    icon: Layers,
    title: "Hệ sinh thái DigiU",
    description: "Nền tảng học và kiếm thu nhập số — mình đang đồng hành và chia sẻ trải nghiệm thực tế.",
    href: "/portal/duan-cohoi/digiu",
    status: "Đang theo dõi",
    whoFor: "Người mới muốn bắt đầu kiếm thu nhập số, chấp nhận vài tháng đầu chưa có kết quả rõ ràng.",
    whoNotReady: "Người cần thu nhập ngay lập tức, hoặc chưa từng dùng công cụ AI cơ bản nào.",
    expectedOutcome: "Kỹ năng vận hành một kênh nội dung số bằng AI — không phải cam kết thu nhập cụ thể.",
  },
  {
    key: "solargroup",
    icon: Building2,
    title: "SolarGroup",
    description: "Cơ hội đầu tư cổ phần dài hạn — mình đang nghiên cứu và chia sẻ góc nhìn cá nhân.",
    href: "/portal/duan-cohoi/solargroup",
    status: "Đang nghiên cứu",
    whoFor: "Người có vốn nhàn rỗi thật sự sẵn sàng để lâu dài, chấp nhận không rút được ngay khi cần.",
    whoNotReady: "Người cần thanh khoản ngắn hạn, hoặc chưa từng đọc một bản cáo bạch/whitepaper đầu tư nào.",
    expectedOutcome: "Hiểu rõ hơn cách một mô hình cổ phần dài hạn vận hành — không phải cam kết lợi nhuận.",
  },
  {
    key: "crypto",
    icon: Bitcoin,
    title: "Blockchain & Crypto",
    description: "Kiến thức nền tảng về hai mảng Blockchain và Crypto — bao gồm cả bài học từ sai lầm.",
    href: "/portal/duan-cohoi/crypto",
    status: "Chia sẻ trải nghiệm",
    whoFor: "Người tò mò về công nghệ mới, chấp nhận rủi ro cao và biến động giá lớn.",
    whoNotReady: "Người chưa từng tự quản lý một ví số, hoặc coi đây là cách làm giàu nhanh.",
    expectedOutcome: "Kiến thức nền về blockchain/crypto và cách tự bảo vệ tài sản số — không phải lợi nhuận giao dịch.",
  },
  {
    key: "blockchain",
    icon: Link2,
    title: "Làm tiếp thị liên kết (Affiliate)",
    description: "Các chương trình/khoá học tiếp thị liên kết mình đang tìm hiểu hoặc quảng bá.",
    href: "/portal/duan-cohoi/blockchain",
    status: "Đang theo dõi",
    whoFor: "Người muốn tìm hiểu các chương trình tiếp thị liên kết cụ thể mình đang theo dõi.",
    whoNotReady: "Người tìm kiếm một danh sách link tiếp thị đã có sẵn và hoạt động ngay hôm nay.",
    expectedOutcome: "Biết rõ những chương trình affiliate mình đang tìm hiểu — không phải cam kết thu nhập.",
  },
  {
    key: "trading",
    icon: LineChart,
    title: "Các sàn giao dịch Crypto",
    description: "Danh sách các sàn giao dịch crypto mình đang theo dõi hoặc đã dùng thử.",
    href: "/portal/duan-cohoi/trading",
    status: "Chia sẻ kiến thức",
    whoFor: "Người đã hiểu kiến thức nền về crypto, muốn biết các sàn giao dịch cụ thể mình đang theo dõi.",
    whoNotReady: "Người chưa hiểu kiến thức nền về crypto/ví số — nên đọc Blockchain & Crypto trước.",
    expectedOutcome: "Biết rõ các sàn giao dịch mình đang theo dõi/đã dùng — không phải khuyến nghị nên chọn sàn nào.",
  },
] as const;

/**
 * Portal 4.0 Final Audit — visual reconstruction. Cùng khuôn 5 mẫu như
 * `PillarEntranceCard`'s SURFACE (Home) và CKOS's CATEGORY_SURFACE: mỗi
 * hệ sinh thái có một "bộ da" riêng (dải gradient đầu thẻ, chip icon, viền,
 * badge) dùng lại đúng bảng màu Portal đã có (blue/indigo, amber/orange,
 * slate/emerald, violet/blue, emerald/green) — không phải bịa hue mới.
 * Nền vẫn là tint sáng (không phải nền tối) để giữ nguyên chữ
 * text-gray-900/600/500 sẵn có, tránh lỗi tương phản khi đổi theme.
 */
const ECOSYSTEM_SURFACE: Record<
  (typeof ECOSYSTEMS)[number]["key"],
  { card: string; strip: string; chip: string; badge: string }
> = {
  digiu: {
    card: "border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white hover:border-blue-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-blue-600 to-indigo-600",
    chip: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
    badge: "bg-blue-100 text-blue-700",
  },
  solargroup: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white hover:border-amber-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-amber-500 to-orange-500",
    chip: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
    badge: "bg-amber-100 text-amber-800",
  },
  crypto: {
    card: "border-slate-300 bg-gradient-to-br from-slate-100 via-slate-50 to-white hover:border-emerald-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-slate-800 to-emerald-600",
    chip: "bg-gradient-to-br from-slate-800 to-emerald-600 text-white",
    badge: "bg-slate-200 text-slate-700",
  },
  blockchain: {
    card: "border-violet-200 bg-gradient-to-br from-violet-50 via-blue-50/50 to-white hover:border-violet-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-violet-600 to-blue-500",
    chip: "bg-gradient-to-br from-violet-600 to-blue-500 text-white",
    badge: "bg-violet-100 text-violet-700",
  },
  trading: {
    card: "border-emerald-300 bg-gradient-to-br from-emerald-50 via-green-50/50 to-white hover:border-emerald-500 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-emerald-700 to-green-600",
    chip: "bg-gradient-to-br from-emerald-700 to-green-600 text-white",
    badge: "bg-emerald-100 text-emerald-800",
  },
};

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
      <PillarHero
        icon={LineChart}
        tone="opportunity"
        eyebrow="Projects & Opportunities — Trước khi quyết định"
        title="Bạn không cần biết hết. Bạn chỉ cần chọn đúng điểm bắt đầu"
        subtitle="Trang này không xếp hạng cơ hội nào tốt hơn cơ hội nào. Nó giúp bạn trả lời một câu hỏi trước khi đọc bất kỳ dự án nào: với tình huống của bạn hôm nay, nên bắt đầu tìm hiểu từ đâu — và cần biết trước điều gì để không mất tiền vì thiếu hiểu biết."
        quickActions={[
          { label: "Xem Tiêu chí đánh giá", href: "#tieu-chi" },
          { label: "Đọc bài học từ trải nghiệm", href: "/portal/nhatkyhoctap" },
        ]}
      />

      {/* Ecosystem cards — đưa lên đầu trang theo yêu cầu Product Owner:
       * người dùng thấy ngay các hệ sinh thái thật trước khi đọc phần
       * quyết định/tiêu chí, nhưng mỗi thẻ vẫn giữ nguyên khung "ai phù hợp
       * / ai chưa nên tham gia / kỳ vọng thực tế" — không biến thành một
       * catalogue quảng cáo. */}
      <section>
        <SectionHeader
          eyebrow="Đang theo dõi"
          title="Các hệ sinh thái"
          description="Mỗi hệ sinh thái trả lời rõ: ai phù hợp, ai chưa nên tham gia, và kỳ vọng thực tế là gì — không phải một bảng xếp hạng."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEMS.map((item) => {
            const surface = ECOSYSTEM_SURFACE[item.key];
            return (
              <div
                key={item.title}
                className={`overflow-hidden rounded-2xl border p-5 shadow-token-sm transition duration-200 sm:p-6 ${surface.card}`}
              >
                <div className={`-mx-5 -mt-5 mb-4 h-1.5 sm:-mx-6 sm:-mt-6 ${surface.strip}`} aria-hidden />
                <Link href={item.href} className="block">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${surface.chip}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className={`gemos-badge ${surface.badge}`}>{item.status}</span>
                  </div>
                  <h3 className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
                </Link>

                <div className="mt-3 space-y-2 border-t border-gray-900/10 pt-3">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold text-emerald-700">Phù hợp: </span>{item.whoFor}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold text-amber-700">Chưa nên tham gia nếu: </span>{item.whoNotReady}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-900">Kỳ vọng thực tế: </span>{item.expectedOutcome}
                  </p>
                </div>

                {/* Rule #2 restructure: 2 real anchor-scroll links staying
                 * entirely within this ecosystem's own page — no more
                 * Companion-intent buttons. */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`${item.href}#phan-tich-tiem-nang`}
                    className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    Phân tích dự án
                  </Link>
                  <Link
                    href={`${item.href}#lien-ket-tiep-thi`}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
                  >
                    Đường link liên kết dự án
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Chưa có Case Study thật nào cho các hệ sinh thái này — xem{" "}
          <Link href="/portal/case-studies" className="font-semibold text-blue-600 hover:underline">
            trang Case Study
          </Link>{" "}
          để biết vì sao, thay vì tự tạo câu chuyện thành công ở đây.
        </p>
      </section>

      {/* Companion Guide */}
      <CompanionGuide
        message="Trước khi bấm vào bất kỳ hệ sinh thái nào ở trên, hãy đọc Tiêu chí chia sẻ trước — nó giải thích vì sao một hệ sinh thái xuất hiện ở đây và điều gì KHÔNG được đảm bảo."
        action={{ label: "Xem bài học từ trải nghiệm", href: "/portal/nhatkyhoctap" }}
      />

      {/* Companion Task Entry */}
      <CompanionTaskEntry
        module="opportunities"
        heading="Phân tích cùng Companion"
        placeholder="VD: Mình đang cân nhắc tham gia SolarGroup, giúp mình nhìn rõ hơn..."
      />

      {/* Decision Experience — không phải danh sách, mà giúp trả lời "tôi nên bắt đầu ở đâu?" */}
      <section>
        <SectionHeader eyebrow="Quyết định" title="Tôi nên bắt đầu ở đâu?" />
        <div className="grid gap-3 sm:grid-cols-2">
          <GemCard>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Muốn học và kiếm thu nhập online ngay?</span>
              {" "}→ Bắt đầu với <span className="font-semibold text-blue-600">Hệ sinh thái DigiU</span>.
            </p>
          </GemCard>
          <GemCard>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Muốn đầu tư dài hạn, chấp nhận rủi ro thấp hơn?</span>
              {" "}→ Xem <span className="font-semibold text-blue-600">SolarGroup</span>.
            </p>
          </GemCard>
          <GemCard>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Tò mò về công nghệ mới, chấp nhận rủi ro cao hơn?</span>
              {" "}→ Đọc <span className="font-semibold text-blue-600">Blockchain &amp; Crypto</span>.
            </p>
          </GemCard>
          <GemCard>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Chưa chắc chắn điều gì cả?</span>
              {" "}→ Bắt đầu bằng cách đọc <span className="font-semibold text-blue-600">Tiêu chí chia sẻ</span> bên dưới trước.
            </p>
          </GemCard>
        </div>
      </section>

      {/* Introduction */}
      <GemCard>
        <h2 className="gemos-card-title mb-3 text-base font-bold text-gray-900">Vì sao trang này tồn tại</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          Hầu hết nội dung &ldquo;cơ hội đầu tư&rdquo; trên mạng chỉ kể phần thắng. Trang này làm ngược
          lại: mỗi hệ sinh thái ở đây đều có phần &ldquo;tại sao mình chưa chắc chắn&rdquo; và bài học từ
          chính những lần mình đã sai — vì một quyết định tốt cần cả hai phía của câu chuyện, không chỉ
          phía đẹp.
        </p>
        <p className="text-sm leading-relaxed text-gray-600">
          VO DUONG AI không phải nền tảng tư vấn đầu tư, và thứ tự hiển thị ở đây không phải một bảng xếp
          hạng &ldquo;tốt nhất&rdquo;. Quyết định tài chính cuối cùng luôn là của bạn.
        </p>
      </GemCard>

      {/* Portal 4.0 Content Creation — trước đây trang chỉ có tiêu chí chia
       * sẻ (vì sao ecosystem xuất hiện ở đây), chưa có checklist giúp
       * người đọc tự đánh giá sự sẵn sàng CỦA HỌ trước khi tham gia. */}
      <section>
        <SectionHeader eyebrow="Tự đánh giá" title="Bạn đã sẵn sàng tham gia một dự án chưa?" />
        <div className="space-y-2">
          {[
            "Tôi đã đọc tài liệu gốc (whitepaper/trang chính thức) của dự án, không chỉ đọc bài chia sẻ ở đây.",
            "Tôi biết rõ số tiền mình bỏ vào là số tiền tôi chấp nhận mất hoàn toàn.",
            "Tôi hiểu ít nhất một rủi ro cụ thể của dự án này, không chỉ biết lợi ích.",
            "Tôi không tham gia vì thấy người khác tham gia — tôi có lý do riêng của mình.",
            "Tôi biết mình sẽ dừng lại ở đâu nếu mọi việc không như kỳ vọng.",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-token-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                {i + 1}
              </span>
              <p className="text-sm text-gray-600">{item}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Nếu bạn trả lời &ldquo;chưa&rdquo; cho bất kỳ câu nào ở trên, đó không phải là dấu hiệu xấu — đó là
          dấu hiệu nên đọc thêm trước khi quyết định.
        </p>

        {/* Phase 4 — Guided Learning: chưa sẵn sàng → chỉ đúng nơi cần học,
         * không phải một lời khuyên chung chung "hãy tìm hiểu thêm". */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <GemCard>
            <p className="text-xs font-semibold text-gray-900">Chưa đọc tài liệu gốc lần nào?</p>
            <p className="mt-1 text-xs text-gray-500">Học cách đọc whitepaper/tài liệu dự án trước khi đọc bất kỳ ecosystem nào ở đây.</p>
            <Button href="/portal/hocvienai" variant="secondary" className="mt-2">Học viện AI</Button>
          </GemCard>
          <GemCard>
            <p className="text-xs font-semibold text-gray-900">Chưa hình dung được rủi ro cụ thể?</p>
            <p className="mt-1 text-xs text-gray-500">Đọc các bài học từ trải nghiệm thật — bao gồm cả những lần đã sai.</p>
            <Button href="/portal/nhatkyhoctap" variant="secondary" className="mt-2">Nhật ký học tập</Button>
          </GemCard>
          <GemCard>
            <p className="text-xs font-semibold text-gray-900">Không chắc nên bắt đầu từ đâu?</p>
            <p className="mt-1 text-xs text-gray-500">Nhờ Companion phân tích cùng bạn trước khi đọc bất kỳ dự án nào.</p>
            <Button href="/portal/companion" variant="secondary" className="mt-2">Hỏi Companion</Button>
          </GemCard>
        </div>
      </section>

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

      {/* Kiến thức cần học trước khi tham gia bất kỳ dự án nào */}
      <KnowledgeJourneyStrip
        title="Trước khi tham gia, nên học gì?"
        steps={[
          { label: "Học nền tảng", description: "Hiểu đúng về AI/Affiliate/Blockchain trước khi tham gia dự án nào.", href: "/portal/hocvienai" },
          { label: "Công cụ hỗ trợ", description: "Các công cụ AI giúp bạn nghiên cứu dự án nhanh và kỹ hơn.", href: "/portal/tools" },
          { label: "Hỏi Companion", description: "Nhờ Companion phân tích cùng bạn trước khi quyết định.", href: "/portal/companion" },
        ]}
      />

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
