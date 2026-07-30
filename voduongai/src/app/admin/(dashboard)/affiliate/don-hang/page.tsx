import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { loadAdminReferrals } from "@/lib/affiliate/admin-data";
import { ShoppingCart } from "lucide-react";

export const metadata = { title: "Affiliate — Đơn hàng · Admin" };

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * Đơn hàng phát sinh QUA GIỚI THIỆU — góc nhìn lọc từ `referrals` (chỉ
 * dòng có `order_id`), KHÁC "Đơn hàng" ở Workspace Vận hành
 * (`/admin/van-hanh/don-hang`, danh sách RAW toàn bộ đơn hàng, không phân
 * biệt có qua giới thiệu hay không) — 2 trang phục vụ 2 câu hỏi khác nhau,
 * không trùng CRUD (cả 2 đều CHỈ ĐỌC, không sửa `orders` ở đây).
 */
export default async function AffiliateOrdersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { rows, configured, error } = await loadAdminReferrals();
  const orders = rows.filter((r) => r.orderId != null);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Affiliate", href: "/admin/affiliate" }, { label: "Đơn hàng" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Đơn hàng qua giới thiệu</h1>
        <p className="mt-1 text-sm text-gray-500">
          Đơn hàng phát sinh từ 1 lượt giới thiệu (đã xác nhận thanh toán). Xem toàn bộ đơn hàng (không phân biệt
          nguồn) tại{" "}
          <Link href="/admin/van-hanh/don-hang" className="font-semibold text-brand-blue hover:underline">
            Vận hành → Đơn hàng
          </Link>
          .
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc dữ liệu.
        </div>
      )}
      {configured && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-gray-700">Không đọc được dữ liệu: {error}</div>
      )}
      {configured && !error && orders.length === 0 && (
        <AdminEmptyState
          icon={ShoppingCart}
          title="Chưa có đơn hàng nào qua giới thiệu"
          description="Danh sách này sẽ tự hiện đúng ngay khi có đơn hàng đầu tiên được xác nhận từ 1 lượt giới thiệu."
        />
      )}
      {configured && !error && orders.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Mã đơn hàng</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Giá trị đơn hàng</th>
                <th className="px-4 py-3">Người giới thiệu</th>
                <th className="px-4 py-3">Hoa hồng</th>
                <th className="px-4 py-3">Ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">VDAI{r.orderId}</td>
                  <td className="px-4 py-3 text-gray-700">{r.referredEmail}</td>
                  <td className="px-4 py-3 text-gray-700">{r.orderProductName ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-900">{r.orderAmount != null ? formatMoney(r.orderAmount) : "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{r.referrerEmail ?? r.referrerId}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{formatMoney(r.commissionAmount)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
