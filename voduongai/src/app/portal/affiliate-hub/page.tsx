import { affiliateResources } from "@/data/affiliate";

export const metadata = { title: "Trung tâm Affiliate" };

export default function AffiliateHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Affiliate Hub</h1>
        <p className="mt-2 text-white">
          Tài liệu và công cụ giúp bạn xây hệ thống Affiliate Marketing bằng AI.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {affiliateResources.map((a) => (
          <div key={a.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">{a.title}</h3>
            <p className="mt-2 text-sm text-white">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
