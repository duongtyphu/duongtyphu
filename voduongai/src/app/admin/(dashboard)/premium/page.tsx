import { listProducts } from "./actions";
import { NewProductForm, ProductCard } from "./ProductForm";

export default async function PremiumAdminPage() {
  const { products, configured } = await listProducts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Sản phẩm số (Premium)</h1>
        <p className="mt-1 text-sm text-white/50">
          Quản lý catalog sản phẩm bán thật hiển thị tại Portal → Sản phẩm số (dữ liệu thật từ Supabase).
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code> — cần quyền service role để quản lý sản phẩm.
        </div>
      )}

      {configured && (
        <>
          <NewProductForm />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {products.length === 0 && <p className="text-sm text-white/40">Chưa có sản phẩm nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
