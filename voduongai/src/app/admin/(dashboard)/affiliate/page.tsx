import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { loadAdminReferrals, summarizeByReferrer } from "@/lib/affiliate/admin-data";
import { Users2, ShoppingCart, Wallet, TrendingUp } from "lucide-react";

export const metadata = { title: "Affiliate — Tổng quan · Admin" };

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/**
 * Chương trình Affiliate — Tổng quan Workspace. Tái sử dụng
 * `loadAdminReferrals()`/`summarizeByReferrer()` (cùng dữ liệu với mọi
 * trang khác trong Workspace) để đảm bảo con số nhất quán ở mọi nơi.
 */
export default async function AffiliateOverviewPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { rows, configured, error } = await loadAdminReferrals();
  const referrers = summarizeByReferrer(rows);

  const signups = rows.length;
  const customers = rows.filter((r) => r.orderId != null).length;
  const revenue = rows.reduce((s, r) => s + (r.orderAmount ?? 0), 0);
  const commissionConfirmed = rows.filter((r) => r.status === "confirmed").reduce((s, r) => s + r.commissionAmount, 0);
  const commissionPaid = rows.filter((r) => r.status === "paid").reduce((s, r) => s + r.commissionAmount, 0);
  const topReferrers = referrers.slice(0, 5);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Affiliate" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Chương trình Affiliate — Tổng quan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý chương trình giới thiệu chính thức VO DUONG AI — tái sử dụng{" "}
          <code className="text-gray-700">members.referral_code</code>/<code className="text-gray-700">referrals</code>{" "}
          (đã tự động tạo referral + tính hoa hồng qua trigger có sẵn).
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc dữ liệu.
        </div>
      )}
      {configured && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-gray-700">
          Không đọc được dữ liệu: {error}
        </div>
      )}

      {configured && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Users2 className="h-4 w-4" />
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Lượt đăng ký</p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">{signups.toLocaleString("vi-VN")}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <ShoppingCart className="h-4 w-4" />
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Khách hàng / Đơn hàng</p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">{customers.toLocaleString("vi-VN")}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                <TrendingUp className="h-4 w-4" />
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Doanh thu qua giới thiệu</p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">{formatMoney(revenue)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <Wallet className="h-4 w-4" />
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Hoa hồng chờ / đã trả</p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">
                {formatMoney(commissionConfirmed)} <span className="text-sm font-medium text-gray-400">/ {formatMoney(commissionPaid)}</span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">Top người giới thiệu</h2>
            {topReferrers.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">Chưa có ai giới thiệu thành công — xem mục Referral để theo dõi.</p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Người giới thiệu</th>
                      <th className="px-4 py-3">Lượt đăng ký</th>
                      <th className="px-4 py-3">Khách hàng</th>
                      <th className="px-4 py-3">Hoa hồng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topReferrers.map((r) => (
                      <tr key={r.referrerId}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{r.referrerEmail ?? r.referrerId}</td>
                        <td className="px-4 py-3 text-gray-700">{r.signups}</td>
                        <td className="px-4 py-3 text-gray-700">{r.customers}</td>
                        <td className="px-4 py-3 font-bold text-gray-900">{formatMoney(r.commissionTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-semibold text-brand-blue">
            <Link href="/admin/affiliate/referral" className="hover:underline">Xem toàn bộ Referral →</Link>
            <Link href="/admin/affiliate/cau-hinh-hoa-hong" className="hover:underline">Cấu hình hoa hồng theo sản phẩm →</Link>
            <Link href="/admin/affiliate/yeu-cau-thanh-toan" className="hover:underline">Yêu cầu thanh toán →</Link>
            <Link href="/admin/affiliate/bao-cao" className="hover:underline">Báo cáo →</Link>
          </div>
        </>
      )}
    </div>
  );
}
