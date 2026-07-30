import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { loadAdminReferrals, summarizeByReferrer } from "@/lib/affiliate/admin-data";
import { BarChart3 } from "lucide-react";

export const metadata = { title: "Affiliate — Báo cáo · Admin" };

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Báo cáo Chương trình Affiliate — 2 lát cắt tính trực tiếp từ cùng dữ liệu
 * `loadAdminReferrals()`/`summarizeByReferrer()` dùng ở mọi trang khác
 * trong Workspace (không RPC/view SQL riêng): (1) xu hướng theo tháng
 * (lượt đăng ký/hoa hồng phát sinh), (2) toàn bộ bảng xếp hạng người giới
 * thiệu (khác "Tổng quan" chỉ hiện top 5).
 */
export default async function AffiliateReportsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { rows, configured, error } = await loadAdminReferrals();
  const referrers = summarizeByReferrer(rows);

  const byMonth = new Map<string, { signups: number; commission: number }>();
  for (const r of rows) {
    const key = monthKey(r.createdAt);
    const entry = byMonth.get(key) ?? { signups: 0, commission: 0 };
    entry.signups += 1;
    if (r.status === "confirmed" || r.status === "paid") entry.commission += r.commissionAmount;
    byMonth.set(key, entry);
  }
  const months = Array.from(byMonth.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Affiliate", href: "/admin/affiliate" }, { label: "Báo cáo" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Báo cáo Chương trình Affiliate</h1>
        <p className="mt-1 text-sm text-gray-500">Xu hướng theo tháng và bảng xếp hạng đầy đủ người giới thiệu.</p>
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
        <AdminEmptyState icon={BarChart3} title="Chưa có dữ liệu để báo cáo" description="Báo cáo sẽ tự hiện đúng ngay khi có lượt giới thiệu đầu tiên." />
      )}

      {configured && !error && rows.length > 0 && (
        <>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Xu hướng theo tháng</h2>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Tháng</th>
                    <th className="px-4 py-3">Lượt đăng ký</th>
                    <th className="px-4 py-3">Hoa hồng phát sinh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {months.map(([key, v]) => (
                    <tr key={key}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{key}</td>
                      <td className="px-4 py-3 text-gray-700">{v.signups}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatMoney(v.commission)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">Bảng xếp hạng người giới thiệu</h2>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Người giới thiệu</th>
                    <th className="px-4 py-3">Lượt đăng ký</th>
                    <th className="px-4 py-3">Khách hàng</th>
                    <th className="px-4 py-3">Doanh thu</th>
                    <th className="px-4 py-3">Hoa hồng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {referrers.map((r, i) => (
                    <tr key={r.referrerId}>
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{r.referrerEmail ?? r.referrerId}</td>
                      <td className="px-4 py-3 text-gray-700">{r.signups}</td>
                      <td className="px-4 py-3 text-gray-700">{r.customers}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">{formatMoney(r.revenue)}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-gray-900">{formatMoney(r.commissionTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
