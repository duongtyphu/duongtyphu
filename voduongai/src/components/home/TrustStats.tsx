import { siteConfig } from "@/lib/site";

const stats = [
  { value: "10,000+", label: "Người theo dõi & cộng đồng" },
  { value: "50+", label: "Tài liệu & công cụ đã chia sẻ" },
  { value: "12+", label: "Công cụ AI sử dụng thực tế" },
  { value: "3+", label: "Năm kinh nghiệm AI & Affiliate" },
];

const channels = [
  { label: "Nhóm Facebook", href: siteConfig.links.facebook },
  { label: "Cộng đồng Zalo", href: siteConfig.links.zalo },
  { label: "YouTube", href: siteConfig.links.youtube },
  { label: "TikTok", href: siteConfig.links.tiktok },
  { label: "Bản tin Email", href: siteConfig.links.telegram },
];

export function TrustStats() {
  return (
    <section className="py-9 md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center md:max-w-none">
          <h2 className="text-2xl font-extrabold text-white md:text-3xl">
            Bạn không học một mình
          </h2>
          <p className="mt-3 text-white md:whitespace-nowrap">
            Tham gia cộng đồng để học hỏi, chia sẻ và cập nhật cùng những
            người đang xây hệ thống AI & Affiliate.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-shine rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
            >
              {c.label}
            </a>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-white md:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-white">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
