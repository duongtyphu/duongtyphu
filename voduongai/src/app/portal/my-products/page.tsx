import { getSupabaseServer } from "@/lib/supabase-server";

export const metadata = { title: "Sản phẩm của tôi" };

type Order = {
  id: number;
  product_name: string | null;
  amount: number;
  status: string;
  created_at: string;
};

const statusLabel: Record<string, string> = {
  pending: "Đang chờ xác nhận",
  confirmed: "Đã xác nhận",
  rejected: "Bị từ chối",
};

async function getUserOrders(): Promise<{ email: string | null; orders: Order[] }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { email: null, orders: [] };
  }
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email ?? null;
  if (!email) return { email: null, orders: [] };

  const { data } = await supabase
    .from("orders")
    .select("id, product_name, amount, status, created_at")
    .eq("member_email", email)
    .order("created_at", { ascending: false });

  return { email, orders: data ?? [] };
}

export default async function MyProductsPage() {
  const { email, orders } = await getUserOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Sản phẩm của tôi</h1>
        <p className="mt-2 text-white">
          Sản phẩm và tài nguyên bạn đã mở khoá sẽ hiển thị tại đây.
        </p>
      </div>

      {!email && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white">
          Đăng nhập để xem lịch sử mua hàng của bạn.
        </div>
      )}

      {email && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white">
          Bạn chưa có sản phẩm nào. Khám phá{" "}
          <a href="/portal/premium" className="font-semibold text-brand-blue hover:underline">
            Tài nguyên Premium
          </a>{" "}
          để bắt đầu.
        </div>
      )}

      {email && orders.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((o) => (
            <div key={o.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-white">{o.product_name ?? "Sản phẩm"}</h3>
                <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {statusLabel[o.status] ?? o.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/70">
                {o.amount.toLocaleString("vi-VN")}đ · {new Date(o.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
