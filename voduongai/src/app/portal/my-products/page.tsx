import { getSupabaseServer } from "@/lib/supabase-server";

export const metadata = { title: "Sản phẩm của tôi", description: "Danh sách sản phẩm và khoá học bạn đã mua tại VO DUONG AI.", robots: { index: false } };

type Order = {
  id: number;
  product_name: string | null;
  amount: number;
  status: string;
  created_at: string;
  course_id: string | null;
  products: { title: string; icon: string | null; video_url: string | null; pdf_url: string | null } | null;
  lessons: { title: string; video_url: string | null; pdf_url: string | null } | null;
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
    .select("id, product_name, amount, status, created_at, course_id, products(title, icon, video_url, pdf_url), lessons(title, video_url, pdf_url)")
    .eq("member_email", email)
    .order("created_at", { ascending: false });

  return { email, orders: (data as unknown as Order[]) ?? [] };
}

export default async function MyProductsPage() {
  const { email, orders } = await getUserOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Sản phẩm của tôi</h1>
        <p className="mt-2 text-gray-900">
          Sản phẩm và tài nguyên bạn đã mở khoá sẽ hiển thị tại đây.
        </p>
      </div>

      {!email && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-gray-50 p-10 text-center text-sm text-gray-900">
          Đăng nhập để xem lịch sử mua hàng của bạn.
        </div>
      )}

      {email && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-gray-50 p-10 text-center text-sm text-gray-900">
          Bạn chưa có sản phẩm nào. Khám phá{" "}
          <a href="/portal/premium" className="font-semibold text-brand-blue hover:underline">
            Tài nguyên Premium
          </a>{" "}
          để bắt đầu.
        </div>
      )}

      {email && orders.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((o) => {
            const title = o.products?.title ?? o.lessons?.title ?? o.product_name ?? "Sản phẩm";
            const icon = o.products?.icon ?? (o.lessons ? "📚" : "💡");
            const video = o.products?.video_url ?? o.lessons?.video_url;
            const pdf = o.products?.pdf_url ?? o.lessons?.pdf_url;
            return (
              <div key={o.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    <span className="mr-1">{icon}</span>
                    {title}
                  </h3>
                  <span className="shrink-0 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-900">
                    {statusLabel[o.status] ?? o.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {o.amount.toLocaleString("vi-VN")}đ · {new Date(o.created_at).toLocaleDateString("vi-VN")}
                </p>
                {o.status === "confirmed" && (video || pdf) && (
                  <div className="mt-3 flex gap-2">
                    {video && (
                      <a href={video} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-brand-violet hover:text-brand-violet">
                        ▶ Video
                      </a>
                    )}
                    {pdf && (
                      <a href={pdf} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-brand-violet hover:text-brand-violet">
                        📄 PDF
                      </a>
                    )}
                  </div>
                )}
                {o.status === "confirmed" && o.course_id && !video && !pdf && (
                  <a
                    href={`/portal/premium/hoc/${o.course_id}`}
                    className="mt-3 block rounded-lg bg-brand-blue/10 px-3 py-2 text-xs font-semibold text-brand-blue hover:bg-brand-blue/20"
                  >
                    Vào học →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
