"use client";

import Link from "next/link";
import { LineChart, ShieldCheck, Users, Quote, Layers } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { useCollection } from "@/lib/admin/store";
import { ecosystemsSeed, ECOSYSTEMS_COLLECTION_KEY, type Ecosystem } from "@/data/portal/ecosystems";
import { ECOSYSTEM_ICONS, getEcosystemSurface } from "@/components/portal/opportunities/ecosystemVisuals";

/**
 * PROJECTS-SPR-602 — Hub page giờ đọc `useCollection("ecosystems", ...)`
 * làm NGUỒN DUY NHẤT cho 5 thẻ hệ sinh thái, thay vì mảng ECOSYSTEMS tĩnh
 * cứng riêng của trang này (trước đây trùng lặp gần như y hệt dữ liệu
 * trong ecosystems.ts nhưng khác tên field và không đồng bộ khi Founder
 * sửa 1 trong 2 nơi). Icon/màu cũng đọc từ palette chung
 * (ecosystemVisuals.ts) — không còn bảng ECOSYSTEM_SURFACE riêng của trang
 * này.
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

function EcosystemCard({ eco }: { eco: Ecosystem }) {
  const Icon = ECOSYSTEM_ICONS[eco.icon] ?? Layers;
  const surface = getEcosystemSurface(eco.colorKey);
  const href = `/portal/duan-cohoi/${eco.slug}`;

  return (
    <div className={`overflow-hidden rounded-2xl border p-5 shadow-token-sm transition duration-200 sm:p-6 ${surface.card}`}>
      <div className={`-mx-5 -mt-5 mb-4 h-1.5 sm:-mx-6 sm:-mt-6 ${surface.strip}`} aria-hidden />
      <Link href={href} className="block">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${surface.chip}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className={`gemos-badge ${surface.badge}`}>{eco.statusBadge}</span>
        </div>
        <h3 className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{eco.name}</h3>
        <p className="text-xs leading-relaxed text-gray-500">{eco.shortDescription}</p>
      </Link>

      <div className="mt-3 space-y-2 border-t border-gray-900/10 pt-3">
        <p className="text-xs text-gray-600">
          <span className="font-semibold text-emerald-700">Phù hợp: </span>{eco.whoFor}
        </p>
        <p className="text-xs text-gray-600">
          <span className="font-semibold text-amber-700">Chưa nên tham gia nếu: </span>{eco.whoNotReady}
        </p>
        <p className="text-xs text-gray-600">
          <span className="font-semibold text-gray-900">Kỳ vọng thực tế: </span>{eco.expectedOutcome}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`${href}#phan-tich-tiem-nang`}
          className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
        >
          Phân tích dự án
        </Link>
        <Link
          href={`${href}#lien-ket-tiep-thi`}
          className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
        >
          Đường link liên kết dự án
        </Link>
      </div>
    </div>
  );
}

export function OpportunitiesHubView() {
  const { items, ready } = useCollection<Ecosystem>(ECOSYSTEMS_COLLECTION_KEY, ecosystemsSeed);
  const ecosystems = [...items]
    .filter((e) => e.status === "Published")
    .sort((a, b) => a.order - b.order);

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      <div className="projects-atmosphere-bg" aria-hidden />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      <div className="rounded-3xl p-6 md:p-8 space-y-12">
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

      <section id="he-sinh-thai">
        <SectionHeader
          eyebrow="Đang theo dõi"
          title="Các hệ sinh thái"
          description="Mỗi hệ sinh thái trả lời rõ: ai phù hợp, ai chưa nên tham gia, và kỳ vọng thực tế là gì — không phải một bảng xếp hạng."
        />
        {!ready ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystems.map((eco) => (
              <EcosystemCard key={eco.id} eco={eco} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          eyebrow="Đồng hành"
          title="Những người bạn đồng hành theo năm tháng"
          description="Hình minh hoạ — ảnh thật sẽ được cập nhật sau."
        />
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
