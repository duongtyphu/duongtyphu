import { premiumProducts } from "@/data/premium";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { CheckoutButton } from "@/components/portal/CheckoutModal";

export const metadata = { title: "Tài nguyên Premium" };

type LiveProduct = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  icon: string;
  price: number;
  video_url: string | null;
  pdf_url: string | null;
};

async function getLiveProducts(): Promise<LiveProduct[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("products")
    .select("id, title, description, type, icon, price, video_url, pdf_url")
    .eq("active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function PremiumPage() {
  const [liveProducts, purchasedProductIds] = await Promise.all([
    getLiveProducts(),
    getPurchasedIds("product_id"),
  ]);

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
            {liveProducts.map((p) => {
              const owned = purchasedProductIds.has(String(p.id));
              return (
                <div key={p.id} className="card-shine rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <span className="shrink-0 rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-semibold text-brand-orange">
                      {owned ? "Đã sở hữu" : `${p.price.toLocaleString("vi-VN")}đ`}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-white">{p.title}</h3>
                  {p.description && <p className="mt-2 text-sm text-white/70">{p.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {owned ? (
                      <>
                        {p.video_url && (
                          <a
                            href={p.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                          >
                            Xem video →
                          </a>
                        )}
                        {p.pdf_url && (
                          <a
                            href={p.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
                          >
                            Tải tài liệu →
                          </a>
                        )}
                      </>
                    ) : (
                      <CheckoutButton
                        target={{ itemType: "product", itemId: p.id, title: p.title, price: p.price }}
                        label="Mua ngay"
                      />
                    )}
                  </div>
                </div>
              );
            })}
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
