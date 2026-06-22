import { siteConfig } from "@/lib/site";

export const metadata = { title: "Contact" };

const channels = [
  { label: "Facebook", href: siteConfig.links.facebook },
  { label: "YouTube", href: siteConfig.links.youtube },
  { label: "TikTok", href: siteConfig.links.tiktok },
  { label: "Zalo", href: siteConfig.links.zalo },
  { label: "Telegram", href: siteConfig.links.telegram },
];

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="text-3xl font-extrabold text-brand-navy">Liên hệ</h1>
      <p className="mt-4 text-brand-gray-500">
        Kết nối với tôi qua các kênh dưới đây — tôi phản hồi nhanh nhất qua
        Zalo và Telegram.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
    </section>
  );
}
