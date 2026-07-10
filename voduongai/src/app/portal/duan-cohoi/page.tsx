import Link from "next/link";
import { Layers, Building2, Bitcoin, Link2, LineChart, ShieldCheck, Users, Quote } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { PillarHero } from "@/components/portal/ui/PillarHero";

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
    href: "/portal/duan-cohoi/blockchain-crypto",
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
    href: "/portal/duan-cohoi/lam-affilate",
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
    href: "/portal/duan-cohoi/sangiaodich",
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

/**
 * Illustrative placeholder "photo" tiles for the "Những người bạn đồng hành
 * theo năm tháng" marquee — NOT real photos (none exist yet). Reuses the
 * same blues/violets/ambers/emeralds tint vocabulary as `ECOSYSTEM_SURFACE`
 * above, no new hues invented.
 */
const COMPANION_PLACEHOLDERS = [
  { surface: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600" },
  { surface: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700" },
  { surface: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700" },
  { surface: "border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 text-violet-700" },
  { surface: "border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600" },
  { surface: "border-blue-200 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600" },
  { surface: "border-amber-200 bg-gradient-to-br from-orange-50 to-amber-50 text-orange-700" },
  { surface: "border-emerald-200 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700" },
] as const;

/**
 * 5 lời nhắn của Companion khép lại trang — chủ đề Đầu tư thông minh &
 * Thành công. Nội dung tĩnh do Companion "viết", không phải trích dẫn của
 * người nổi tiếng (không gán tên ai) và không phải dữ liệu người dùng.
 * Bảng màu dùng lại đúng tint vocabulary của `ECOSYSTEM_SURFACE` ở trên.
 */
const COMPANION_QUOTES = [
  {
    topic: "Đầu tư thông minh",
    quote: "Khoản đầu tư khôn ngoan nhất không phải là khoản sinh lời nhanh nhất — mà là khoản bạn hiểu rõ nhất.",
    card: "border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white text-blue-600",
    strip: "bg-gradient-to-r from-blue-600 to-indigo-600",
    chip: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    topic: "Kỷ luật",
    quote: "Đừng trả học phí đắt cho một bài học rẻ: hiểu trước, tham gia sau — và chỉ với số tiền bạn chấp nhận mất.",
    card: "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white text-amber-600",
    strip: "bg-gradient-to-r from-amber-500 to-orange-500",
    chip: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
    badge: "bg-amber-100 text-amber-800",
  },
  {
    topic: "Kiên nhẫn",
    quote: "Thành công không đến từ việc nắm bắt mọi cơ hội, mà từ việc đủ kiên nhẫn chờ cơ hội thuộc về mình.",
    card: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50/50 to-white text-emerald-600",
    strip: "bg-gradient-to-r from-emerald-600 to-green-600",
    chip: "bg-gradient-to-br from-emerald-600 to-green-600 text-white",
    badge: "bg-emerald-100 text-emerald-800",
  },
  {
    topic: "Thành công",
    quote: "Người thành công không phải người chưa từng sai — họ là người biết dừng đúng lúc và bắt đầu lại đủ nhanh.",
    card: "border-violet-200 bg-gradient-to-br from-violet-50 via-blue-50/50 to-white text-violet-600",
    strip: "bg-gradient-to-r from-violet-600 to-blue-500",
    chip: "bg-gradient-to-br from-violet-600 to-blue-500 text-white",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    topic: "Tri thức",
    quote: "Tài sản lớn nhất của bạn không nằm trong ví — nó nằm ở kiến thức bạn tích luỹ mỗi ngày.",
    card: "border-slate-300 bg-gradient-to-br from-slate-100 via-slate-50 to-white text-slate-600",
    strip: "bg-gradient-to-r from-slate-800 to-emerald-600",
    chip: "bg-gradient-to-br from-slate-800 to-emerald-600 text-white",
    badge: "bg-slate-200 text-slate-700",
  },
] as const;

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
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      {/* Khí quyển riêng của Projects & Opportunities ("Opportunity
       * center") kéo full-bleed hết chiều rộng cột nội dung — cùng khuôn
       * với Premium, không còn khung rounded-3xl thu hẹp. */}
      <div className="projects-atmosphere-bg" aria-hidden />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — giữ nguyên đúng khoảng cách trước đây (rounded-3xl
       * p-6 md:p-8), chỉ khí quyển nền phía sau mới full-bleed. */}
      <div className="rounded-3xl p-6 md:p-8 space-y-12">
      {/* Hero */}
      <PillarHero
        icon={LineChart}
        tone="opportunity"
        eyebrow="Projects & Opportunities — Trước khi quyết định"
        title="Bạn không cần biết hết. Bạn chỉ cần chọn đúng điểm bắt đầu"
        subtitle="Trang này không xếp hạng cơ hội nào tốt hơn cơ hội nào. Nó giúp bạn trả lời một câu hỏi trước khi đọc bất kỳ dự án nào: với tình huống của bạn hôm nay, nên bắt đầu tìm hiểu từ đâu — và cần biết trước điều gì để không mất tiền vì thiếu hiểu biết."
        quickActions={[
          { label: "Xem Tiêu chí đánh giá", href: "#tieu-chi" },
          { label: "Cơ hội đầu tư cùng Nhà sáng lập", href: "#he-sinh-thai" },
        ]}
      />

      {/* Ecosystem cards — đưa lên đầu trang theo yêu cầu Product Owner:
       * người dùng thấy ngay các hệ sinh thái thật trước khi đọc phần
       * quyết định/tiêu chí, nhưng mỗi thẻ vẫn giữ nguyên khung "ai phù hợp
       * / ai chưa nên tham gia / kỳ vọng thực tế" — không biến thành một
       * catalogue quảng cáo. */}
      <section id="he-sinh-thai">
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
      </section>

      {/* Những người bạn đồng hành theo năm tháng — Product Owner explicitly
       * asked for placeholder/illustrative photo tiles here BECAUSE no real
       * photos exist yet. These are NOT real user photos — honestly labeled
       * as illustrative placeholders per the project's no-fake-data rule,
       * to be swapped for real photos later. Infinite right-to-left marquee
       * built the same way as `.notice-ticker-track` (see globals.css):
       * the list is duplicated once and animated via CSS keyframes
       * (`.opportunities-companions-marquee` / `opportunities-companions-scroll`),
       * respecting prefers-reduced-motion (animation disabled). */}
      <section>
        <SectionHeader
          eyebrow="Đồng hành"
          title="Những người bạn đồng hành theo năm tháng"
          description="Hình minh hoạ — ảnh thật sẽ được cập nhật sau."
        />
        {/* Product Owner: dải ảnh thiết kế RỘNG, ô ảnh tăng 100% (gấp đôi).
         * Card phá lề trái/phải của cột nội dung (bù đúng p-6 md:p-8 của
         * Content Gutter rounded-3xl bằng -mx-6 md:-mx-8) thành một dải
         * full-bleed viền trên/dưới; ô ảnh h-32 -> h-64, icon và nhãn phóng
         * to tương ứng. */}
        <div className="-mx-6 overflow-hidden border-y border-gray-100 bg-white py-8 shadow-token-sm md:-mx-8">
          <div className="flex w-max opportunities-companions-marquee">
            {[...COMPANION_PLACEHOLDERS, ...COMPANION_PLACEHOLDERS].map((c, i) => (
              <div
                key={i}
                className={`mx-3 flex h-64 w-64 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border ${c.surface}`}
                aria-hidden={i >= COMPANION_PLACEHOLDERS.length}
              >
                <Users className="h-16 w-16 opacity-70" />
                <span className="text-xs font-medium text-gray-500">Ảnh minh hoạ</span>
              </div>
            ))}
          </div>
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

      {/* Companion gửi bạn — 5 lời nhắn tĩnh của Companion về Đầu tư thông
       * minh & Thành công, khép lại trang thay cho các khối điều hướng cũ
       * ("Companion dẫn đường" / "Tiếp theo bạn nên..."). Đây là lời nhắn
       * do Companion viết sẵn, không phải dữ liệu người dùng — dùng lại đúng
       * bảng tint blue/amber/emerald/violet đã có của trang, không bịa hue mới. */}
      <section>
        <SectionHeader
          eyebrow="Companion gửi bạn"
          title="5 điều Companion muốn bạn mang theo"
          description="Không phải lời khuyên đầu tư — là những nguyên tắc để bạn tự tin hơn trước mọi quyết định."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {COMPANION_QUOTES.map((item, i) => (
            <figure
              key={i}
              className={`relative overflow-hidden rounded-2xl border p-6 shadow-token-sm transition duration-200 hover:-translate-y-1 hover:shadow-token-lg ${item.card} ${
                i === 0 ? "sm:col-span-2" : ""
              }`}
            >
              <div className={`-mx-6 -mt-6 mb-5 h-1.5 ${item.strip}`} aria-hidden />
              <Quote
                aria-hidden
                className="pointer-events-none absolute -right-3 -bottom-3 h-24 w-24 rotate-12 opacity-[0.07]"
              />
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${item.chip}`}>
                  <Quote className="h-5 w-5" />
                </div>
                <span className={`gemos-badge ${item.badge}`}>{item.topic}</span>
              </div>
              <blockquote
                className={`font-semibold leading-relaxed text-gray-900 ${i === 0 ? "text-base sm:text-lg" : "text-sm"}`}
              >
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className={`inline-block h-1.5 w-6 rounded-full ${item.strip}`} aria-hidden />
                Companion của bạn
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      </div>
      </div>
    </div>
  );
}
