import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { loadAdminReferrals } from "@/lib/affiliate/admin-data";
import { Users2 } from "lucide-react";

export const metadata = { title: "Affiliate — Referral · Admin" };

const STATUS_LABEL: Record<string, string> = {
  pending: "Vừa đăng ký",
  confirmed: "Đã có đơn hàng — chờ thanh toán",
  paid: "Đã trả hoa hồng",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  paid: "bg-green-50 text-green-700 border-green-200",
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * Danh sách toàn bộ dòng `referrals` — thay thế hẳn
 * `/admin/van-hanh/tiep-thi-lien-ket` cũ (route đó giờ redirect sang đây,
 * tránh 2 nơi cùng sở hữu 1 nguồn dữ liệu). CHỈ ĐỌC — trạng thái
 * pending→confirmed tự động qua trigger `handle_order_confirmed_commission`
 * (đã có sẵn), confirmed→paid qua "Yêu cầu thanh toán" (hành động thủ công
 * của Admin, không sửa tay ở đây).
 */
export default async function AffiliateReferralsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { rows, configured, error } = await loadAdminReferrals();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Affiliate", href: "/admin/affiliate" }, { label: "Referral" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Referral</h1>
        <p className="mt-1 text-sm text-gray-500">
          Toàn bộ lượt giới thiệu (bảng <code className="text-gray-700">referrals</code>). Trạng thái tự động chuyển
          pending → confirmed khi đơn hàng được xác nhận thanh toán; confirmed → paid qua mục &quot;Yêu cầu thanh
          toán&quot;.
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
      {configured && !error && rows.length === 0 && (
        <AdminEmptyState
          icon={Users2}
          title="Chưa có lượt giới thiệu nào"
          description="Danh sách này sẽ tự hiện đúng ngay khi có thành viên giới thiệu người khác đăng ký/mua sản phẩm."
        />
      )}
      {configured && !error && rows.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Người giới thiệu</th>
                <th className="px-4 py-3">Người được giới thiệu</th>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Hoa hồng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-gray-900">{r.referrerEmail ?? r.referrerId}</td>
                  <td className="px-4 py-3 text-gray-700">{r.referredEmail}</td>
                  <td className="px-4 py-3 text-gray-700">{r.orderProductName ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                    {formatMoney(r.commissionAmount)} <span className="text-xs font-normal text-gray-400">({Math.round(r.commissionRate * 100)}%)</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[r.status] ?? "border-gray-200 bg-gray-50 text-gray-600"}`}>
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  </td>
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
