import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { loadAdminReferrals, summarizeByReferrer } from "@/lib/affiliate/admin-data";
import { IdCard } from "lucide-react";

export const metadata = { title: "Affiliate — Thành viên · Admin" };

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/**
 * "Thành viên" của Chương trình Affiliate = thành viên ĐÃ giới thiệu thành
 * công ít nhất 1 người (xuất hiện trong `referrals` với vai trò referrer)
 * — KHÔNG liệt kê toàn bộ `members` (mọi tài khoản đều tự động có
 * `referral_code` qua trigger, nhưng phần lớn chưa từng dùng tới). Khác
 * "Danh sách người dùng"/"Thành viên" ở Workspace Người dùng (góc nhìn
 * theo TÀI KHOẢN/GIAO DỊCH MUA HÀNG) — đây là góc nhìn theo VAI TRÒ NGƯỜI
 * GIỚI THIỆU, không trùng lặp.
 */
export default async function AffiliateMembersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { rows, configured, error } = await loadAdminReferrals();
  const referrers = summarizeByReferrer(rows);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Affiliate", href: "/admin/affiliate" }, { label: "Thành viên" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Thành viên Affiliate</h1>
        <p className="mt-1 text-sm text-gray-500">
          Thành viên đã giới thiệu ít nhất 1 người đăng ký qua link của mình. Mọi tài khoản đều tự động có mã giới
          thiệu — trang này chỉ hiện người ĐÃ DÙNG mã đó thành công.
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
      {configured && !error && referrers.length === 0 && (
        <AdminEmptyState
          icon={IdCard}
          title="Chưa có thành viên nào giới thiệu thành công"
          description="Ngay khi có người đăng ký qua link giới thiệu của 1 thành viên, người đó sẽ xuất hiện ở đây."
        />
      )}
      {configured && !error && referrers.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Thành viên</th>
                <th className="px-4 py-3">Mã giới thiệu</th>
                <th className="px-4 py-3">Lượt đăng ký</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Doanh thu</th>
                <th className="px-4 py-3">Hoa hồng chờ</th>
                <th className="px-4 py-3">Hoa hồng đã trả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {referrers.map((r) => (
                <tr key={r.referrerId}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{r.referrerEmail ?? r.referrerId}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.referralCode ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{r.signups}</td>
                  <td className="px-4 py-3 text-gray-700">{r.customers}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{formatMoney(r.revenue)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-amber-700">{formatMoney(r.commissionConfirmed)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-green-700">{formatMoney(r.commissionPaid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
