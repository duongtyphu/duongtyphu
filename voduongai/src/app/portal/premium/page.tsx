import { premiumProducts } from "@/data/premium";
import { getSupabaseServer } from "@/lib/supabase-server";

export const metadata = { title: "Tài nguyên Premium" };

type LiveProduct = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  icon: string;
  price: number;
};

async function getLiveProducts(): Promise<LiveProduct[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("products")
    .select("id, title, description, type, icon, price")
    .eq("active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function PremiumPage() {
  const liveProducts = await getLiveProducts();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Tài nguyên Premium</h1>
        <p className="mt-2 text-white">
          Sản phẩm và dịch vụ chuyên sâu dành cho người muốn đi nhanh hơn.
        </p>
      </div>

      {liveProducts.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white">Sản phẩm đang mở bán</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {liveProducts.map((p) => (
              <div key={p.id} className="card-shine rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="shrink-0 rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-semibold text-brand-orange">
                    {p.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">{p.title}</h3>
                {p.description && <p className="mt-2 text-sm text-white/70">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-white">Danh mục Premium</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
      </section>
    </div>
  );
}
