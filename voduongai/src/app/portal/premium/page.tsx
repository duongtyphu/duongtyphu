import { premiumProducts } from "@/data/premium";

export const metadata = { title: "Tài nguyên Premium" };

export default function PremiumPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Tài nguyên Premium</h1>
        <p className="mt-2 text-white">
          Sản phẩm và dịch vụ chuyên sâu dành cho người muốn đi nhanh hơn.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {premiumProducts.map((p) => (
          <div key={p.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <span className="inline-flex rounded-full bg-brand-violet/10 px-2.5 py-0.5 text-xs font-semibold text-brand-violet">
              {p.type}
            </span>
            <h3 className="mt-3 text-sm font-bold text-white">{p.title}</h3>
            <p className="mt-2 text-sm text-white">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
