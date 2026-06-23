import { siteConfig } from "@/lib/site";

export const metadata = { title: "Cộng đồng" };

const channels = [
  { label: "Nhóm Facebook", href: siteConfig.links.facebook },
  { label: "Cộng đồng Zalo", href: siteConfig.links.zalo },
  { label: "Kênh Telegram", href: siteConfig.links.telegram },
];

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Cộng đồng</h1>
        <p className="mt-2 text-white/60">
          Tham gia cộng đồng để học hỏi, chia sẻ và cập nhật cùng những người
          đang xây hệ thống AI & Affiliate.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center text-sm font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
          >
            {c.label}
          </a>
        ))}
      </div>
    </div>
  );
}
