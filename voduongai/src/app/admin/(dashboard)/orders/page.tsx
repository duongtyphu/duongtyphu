import { listOrders } from "./actions";
import { OrderRow } from "./OrderRow";

export default async function OrdersAdminPage() {
  const { orders, configured } = await listOrders();
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.filter((o) => o.status === "confirmed").reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Đơn hàng</h1>
        <p className="mt-1 text-sm text-white/50">
          Toàn bộ đơn hàng học viên (dữ liệu thật từ Supabase) — xác nhận để mở khoá sản phẩm tại &quot;Sản phẩm của tôi&quot;.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code> — cần quyền service role để đọc/cập nhật đơn hàng.
        </div>
      )}

      {configured && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Tổng đơn hàng</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{orders.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Đang chờ xác nhận</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Doanh thu đã xác nhận</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{totalRevenue.toLocaleString("vi-VN")}đ</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wide text-white/40">
                  <th className="px-3 py-3">Mã đơn</th>
                  <th className="px-3 py-3">Học viên</th>
                  <th className="px-3 py-3">Sản phẩm</th>
                  <th className="px-3 py-3">Số tiền</th>
                  <th className="px-3 py-3">Ngày</th>
                  <th className="px-3 py-3">Trạng thái</th>
                  <th className="px-3 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <OrderRow key={o.id} order={o} />
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p className="p-5 text-sm text-white/40">Chưa có đơn hàng nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
