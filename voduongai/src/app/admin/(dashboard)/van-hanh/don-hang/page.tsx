import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Đơn hàng · Admin" };

type OrderRow = {
  id: number;
  member_email: string;
  product_name: string | null;
  amount: number;
  status: string;
  order_code: string | null;
  customer_name: string | null;
  course_id: string | null;
  created_at: string;
  confirmed_at: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  rejected: "Đã từ chối",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-orange-50 text-orange-700 border-orange-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * Vận hành — "Đơn hàng" (Admin v2.0). Bảng `orders` đã có dữ liệu thật
 * (checkout + webhook SePay tự động xác nhận) nhưng trước đây KHÔNG có
 * trang Admin nào đọc — đây là gap thật, ưu tiên lấp theo yêu cầu Admin
 * v2.0. CHỈ ĐỌC: không tạo/sửa/xoá/hoàn tiền/đổi trạng thái/cấp quyền thủ
 * công — đúng nguyên tắc bắt buộc "Đơn hàng trong giai đoạn này phải chỉ
 * đọc". Không đụng logic checkout/webhook SePay hiện có.
 */
export default async function DonHangPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const { data, error } = supabase
    ? await supabase
        .from("orders")
        .select("id, member_email, product_name, amount, status, order_code, customer_name, course_id, created_at, confirmed_at")
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: null, error: null };

  const orders = (data ?? []) as OrderRow[];

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Vận hành", href: "/admin/van-hanh/don-hang" }, { label: "Đơn hàng" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Đơn hàng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Danh sách đơn hàng thật từ luồng thanh toán (checkout + webhook SePay tự động xác nhận). Trang
          này CHỈ ĐỌC — không có thao tác tạo/sửa/xoá/hoàn tiền/đổi trạng thái nào ở đây.
        </p>
      </div>

      {!supabase && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc
          danh sách đơn hàng.
        </div>
      )}

      {supabase && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-gray-700">
          Không đọc được bảng đơn hàng: {error.message}
        </div>
      )}

      {supabase && !error && orders.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Chưa có đơn hàng nào.
        </div>
      )}

      {supabase && !error && orders.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Số tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                    {o.order_code ?? `#${o.id}`}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{o.customer_name ?? "—"}</div>
                    <div className="text-xs text-gray-500">{o.member_email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{o.product_name ?? o.course_id ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{formatMoney(o.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        STATUS_STYLE[o.status] ?? "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
