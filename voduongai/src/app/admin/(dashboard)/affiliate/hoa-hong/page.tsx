import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { loadAdminReferrals } from "@/lib/affiliate/admin-data";
import { Wallet } from "lucide-react";

export const metadata = { title: "Affiliate — Hoa hồng · Admin" };

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Chờ thanh toán",
  paid: "Đã thanh toán",
};

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-green-50 text-green-700 border-green-200",
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

/**
 * Sổ hoa hồng — KHÁC "Referral" (liệt kê MỌI trạng thái, kể cả lượt đăng
 * ký chưa mua hàng nào) và "Thành viên" (gộp theo NGƯỜI) — đây là sổ giao
 * dịch tiền, chỉ liệt kê dòng ĐÃ CÓ hoa hồng (status confirmed/paid), theo
 * đúng thứ tự thời gian, để đối chiếu khi cần.
 */
export default async function AffiliateCommissionsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { rows, configured, error } = await loadAdminReferrals();
  const ledger = rows.filter((r) => r.status === "confirmed" || r.status === "paid");
  const totalConfirmed = ledger.filter((r) => r.status === "confirmed").reduce((s, r) => s + r.commissionAmount, 0);
  const totalPaid = ledger.filter((r) => r.status === "paid").reduce((s, r) => s + r.commissionAmount, 0);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Affiliate", href: "/admin/affiliate" }, { label: "Hoa hồng" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Sổ hoa hồng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chỉ liệt kê giao dịch đã phát sinh hoa hồng thật (đơn hàng đã xác nhận). Chờ thanh toán:{" "}
          <span className="font-semibold text-amber-700">{formatMoney(totalConfirmed)}</span> — Đã thanh toán:{" "}
          <span className="font-semibold text-green-700">{formatMoney(totalPaid)}</span>.
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
      {configured && !error && ledger.length === 0 && (
        <AdminEmptyState
          icon={Wallet}
          title="Chưa có hoa hồng nào phát sinh"
          description="Danh sách này sẽ tự hiện đúng ngay khi có đơn hàng đầu tiên được xác nhận từ 1 lượt giới thiệu."
        />
      )}
      {configured && !error && ledger.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Người giới thiệu</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Giá trị đơn hàng</th>
                <th className="px-4 py-3">Mức hoa hồng</th>
                <th className="px-4 py-3">Số tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày phát sinh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ledger.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-gray-900">{r.referrerEmail ?? r.referrerId}</td>
                  <td className="px-4 py-3 text-gray-700">{r.referredEmail}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{r.orderAmount != null ? formatMoney(r.orderAmount) : "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{Math.round(r.commissionRate * 100)}%</td>
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-gray-900">{formatMoney(r.commissionAmount)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
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
