import { siteConfig } from "@/lib/site";

const services = [
  {
    title: "Tư vấn 1:1 với Võ Đương AI",
    description: "Tư vấn riêng để xây lộ trình AI và Affiliate phù hợp với hoàn cảnh, nguồn lực của bạn.",
  },
];

export const metadata = { title: "Dịch vụ" };

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dịch vụ</h1>
        <p className="mt-2 text-white">
          Khi bạn cần đồng hành sát hơn ngoài tài liệu tự học.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <div key={s.title} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-white">{s.description}</p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:underline"
            >
              Liên hệ tư vấn →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
