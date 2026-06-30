import Link from "next/link";

const CARDS = [
  {
    icon: "🤖",
    title: "Học AI",
    description: "Bắt đầu với các bài học AI cơ bản và Prompt thực chiến.",
    href: "/portal/ai-academy",
    gradient: "from-brand-blue/20 to-brand-blue/0",
  },
  {
    icon: "🤝",
    title: "Làm Affiliate",
    description: "Tìm lộ trình, công cụ và sản phẩm phù hợp để bắt đầu tiếp thị liên kết.",
    href: "/portal/affiliate-hub",
    gradient: "from-brand-violet/20 to-brand-violet/0",
  },
  {
    icon: "👤",
    title: "Xây thương hiệu cá nhân",
    description: "Lên kế hoạch nội dung, xây hình ảnh cá nhân và phát triển cộng đồng.",
    href: "/portal/personal-brand",
    gradient: "from-brand-orange/20 to-brand-orange/0",
  },
  {
    icon: "💎",
    title: "Đầu tư tài sản số",
    description: "Khám phá DigiU, Blockchain, Crypto, Trading và tư duy tài sản số.",
    href: "/portal/digital-assets",
    gradient: "from-emerald-400/20 to-emerald-400/0",
  },
];

export function TodayGoals() {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">Hôm nay bạn muốn làm gì?</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className={`card-shine group rounded-[20px] border border-gray-200 bg-gradient-to-br ${c.gradient} bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30`}
          >
            <span className="text-2xl">{c.icon}</span>
            <h3 className="mt-3 text-sm font-bold text-gray-900">{c.title}</h3>
            <p className="mt-1.5 text-xs text-gray-600">{c.description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue group-hover:underline">
              Khám phá ngay →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
