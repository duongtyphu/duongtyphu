import { premiumProducts } from "@/data/premium";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { CheckoutButton } from "@/components/portal/CheckoutModal";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemLockedOverlay } from "@/components/portal/ui/GemLockedOverlay";
import { GemBadge } from "@/components/portal/ui/GemBadge";

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
      <PageHeader
        title="Tài nguyên Premium"
        description="Sản phẩm và dịch vụ chuyên sâu dành cho người muốn đi nhanh hơn — nơi viên ngọc của bạn được mài giũa ở cấp độ cao hơn."
      />

      {liveProducts.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900">Sản phẩm đang mở bán</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {liveProducts.map((p) => {
              const owned = purchasedProductIds.has(String(p.id));
              return (
                <GemCard key={p.id} variant={owned ? "success" : "locked"}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    {owned ? (
                      <GemBadge tone="free">Đã sở hữu</GemBadge>
                    ) : (
                      <GemBadge tone="premium">{`${p.price.toLocaleString("vi-VN")}đ`}</GemBadge>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-gray-900">{p.title}</h3>
                  {p.description && <p className="mt-2 text-sm text-gray-600">{p.description}</p>}
                  {owned ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {p.video_url && (
                        <a
                          href={p.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gemos-btn-primary rounded-full px-5 py-2 text-sm font-semibold text-white"
                        >
                          Xem video →
                        </a>
                      )}
                      {p.pdf_url && (
                        <a
                          href={p.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gemos-btn-secondary rounded-full px-5 py-2 text-sm font-semibold text-gray-900"
                        >
                          Tải tài liệu →
                        </a>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mt-4">
                        <CheckoutButton
                          target={{ itemType: "product", itemId: p.id, title: p.title, price: p.price }}
                          label="Mua ngay"
                        />
                      </div>
                      <GemLockedOverlay />
                    </>
                  )}
                </GemCard>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-gray-900">Danh mục Premium</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {premiumProducts.map((p) => (
            <GemCard key={p.id} variant="locked">
              <GemBadge tone="locked">{p.type}</GemBadge>
              <h3 className="mt-3 text-sm font-bold text-gray-900">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{p.description}</p>
              <GemLockedOverlay />
            </GemCard>
          ))}
        </div>
      </section>
    </div>
  );
}
