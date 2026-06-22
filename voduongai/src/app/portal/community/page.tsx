import { siteConfig } from "@/lib/site";

export const metadata = { title: "Community" };

const channels = [
  { label: "Facebook Group", href: siteConfig.links.facebook },
  { label: "Zalo Community", href: siteConfig.links.zalo },
  { label: "Telegram Channel", href: siteConfig.links.telegram },
];

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">Community</h1>
        <p className="mt-2 text-brand-gray-500">
          Tham gia cộng đồng để học hỏi, chia sẻ và cập nhật cùng những người
          đang xây hệ thống AI & Affiliate.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-brand-gray-200 bg-white p-5 text-center text-sm font-semibold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue"
          >
            {c.label}
          </a>
        ))}
      </div>
    </div>
  );
}
