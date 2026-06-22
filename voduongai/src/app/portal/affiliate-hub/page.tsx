import { affiliateResources } from "@/data/affiliate";

export const metadata = { title: "Affiliate Hub" };

export default function AffiliateHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">Affiliate Hub</h1>
        <p className="mt-2 text-brand-gray-500">
          Tài liệu và công cụ giúp bạn xây hệ thống Affiliate Marketing bằng AI.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {affiliateResources.map((a) => (
          <div key={a.id} className="rounded-2xl border border-brand-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-brand-navy">{a.title}</h3>
            <p className="mt-2 text-sm text-brand-gray-500">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
