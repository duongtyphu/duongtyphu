import { premiumProducts } from "@/data/premium";

export default function PremiumPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">Premium Resources</h1>
        <p className="mt-2 text-brand-gray-500">
          Sản phẩm và dịch vụ chuyên sâu dành cho người muốn đi nhanh hơn.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {premiumProducts.map((p) => (
          <div key={p.id} className="rounded-2xl border border-brand-gray-200 bg-white p-5">
            <span className="inline-flex rounded-full bg-brand-violet/10 px-2.5 py-0.5 text-xs font-semibold text-brand-violet">
              {p.type}
            </span>
            <h3 className="mt-3 text-sm font-bold text-brand-navy">{p.title}</h3>
            <p className="mt-2 text-sm text-brand-gray-500">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
