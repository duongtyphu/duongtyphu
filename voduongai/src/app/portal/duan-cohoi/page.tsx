import Image from "next/image";
import { LineChart, ShieldCheck, Quote } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { ProjectCards } from "@/components/portal/opportunities/ProjectCards";
import { getLiveProjects } from "@/lib/portal/live-projects";

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
// Việc 5 (Nhóm B) — trước đây là mảng hardcode tại đây, không đọc từ đâu
// cả (bản sao thứ 3, song song với ecosystems.ts VÀ bảng Supabase `projects`
// mồ côi chưa ai đọc). Giờ đọc thật từ getLiveProjects() (bảng `projects`,
// quản lý qua /admin/duan-cohoi — Live-edit, Nhóm 3) — xem CLAUDE.md mục
// "Dự án & Cơ hội". ICON_MAP/ECOSYSTEM_SURFACE/DEFAULT_SURFACE đã chuyển
// vào `ProjectCards.tsx` (Client Component, cần useCollection) cùng phần
// render lưới card.

/**
 * Ảnh thật cộng đồng/sự kiện digiU cho marquee "Những người bạn đồng hành
 * theo năm tháng" — Founder gửi 5 ảnh gốc (~2-5MB, 7952x5304), đã nén qua
 * sharp còn ~55-86KB/ảnh, cắt 640x640 (fit "cover", giữ vùng chính giữa
 * ảnh) tại `public/images/duan-cohoi/dong-hanh/`. Thay hẳn bộ tile icon
 * placeholder trước đây (Product Owner xác nhận đây là ảnh thật, không còn
 * cần honest-placeholder nữa).
 */
const COMPANION_PHOTOS = [
  { src: "/images/duan-cohoi/dong-hanh/digiu-doi-ngu-01.jpg", alt: "Đội ngũ digiU" },
  { src: "/images/duan-cohoi/dong-hanh/digiu-hoi-thao-ai-blockchain.jpg", alt: "Hội thảo Trí tuệ nhân tạo & Blockchain cùng cộng đồng digiU" },
  { src: "/images/duan-cohoi/dong-hanh/digiu-dai-dien-hoi-thao.jpg", alt: "Đại diện digiU tại hội thảo" },
  { src: "/images/duan-cohoi/dong-hanh/digiu-5-nam-thanh-lap.jpg", alt: "Sự kiện kỷ niệm 5 năm thành lập digiU" },
  { src: "/images/duan-cohoi/dong-hanh/digiu-doi-ngu-02.jpg", alt: "Đội ngũ digiU tại sự kiện cộng đồng" },
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

export default async function OpportunitiesHubPage() {
  const projects = await getLiveProjects();
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
          { label: "Xem các hệ sinh thái cùng Nhà sáng lập", href: "#he-sinh-thai" },
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
        <ProjectCards seed={projects} />
      </section>

      {/* Những người bạn đồng hành theo năm tháng — ảnh thật cộng đồng/sự
       * kiện digiU (xem COMPANION_PHOTOS ở trên), thay cho bộ tile icon
       * placeholder trước đây. Infinite right-to-left marquee built the
       * same way as `.notice-ticker-track` (see globals.css): the list is
       * duplicated once and animated via CSS keyframes
       * (`.opportunities-companions-marquee` / `opportunities-companions-scroll`),
       * respecting prefers-reduced-motion (animation disabled). */}
      <section>
        <SectionHeader
          eyebrow="Đồng hành"
          title="Những người bạn đồng hành theo năm tháng"
          description="Khoảnh khắc cùng cộng đồng digiU qua các sự kiện."
        />
        {/* Product Owner: dải ảnh thiết kế RỘNG, ô ảnh tăng 100% (gấp đôi).
         * Card phá lề trái/phải của cột nội dung (bù đúng p-6 md:p-8 của
         * Content Gutter rounded-3xl bằng -mx-6 md:-mx-8) thành một dải
         * full-bleed viền trên/dưới; ô ảnh h-32 -> h-64, icon và nhãn phóng
         * to tương ứng. */}
        <div className="-mx-6 overflow-hidden border-y border-gray-100 bg-white py-8 shadow-token-sm md:-mx-8">
          <div className="flex w-max opportunities-companions-marquee">
            {[...COMPANION_PHOTOS, ...COMPANION_PHOTOS].map((p, i) => (
              <div
                key={i}
                className="mx-3 h-64 w-64 shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-token-sm"
                aria-hidden={i >= COMPANION_PHOTOS.length}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={640}
                  height={640}
                  className="h-full w-full object-cover"
                />
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
