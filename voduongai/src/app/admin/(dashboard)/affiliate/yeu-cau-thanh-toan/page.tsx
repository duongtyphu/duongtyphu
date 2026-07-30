import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { listPayoutRequests } from "./actions";
import { PayoutRequestActions } from "./PayoutRequestActions";
import { Wallet } from "lucide-react";

export const metadata = { title: "Affiliate — Yêu cầu thanh toán · Admin" };

const STATUS_LABEL: Record<string, string> = {
  pending: "Đang chờ xử lý",
  approved: "Đã duyệt",
  paid: "Đã thanh toán",
  rejected: "Đã từ chối",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-gray-100 text-gray-500 border-gray-200",
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * Yêu cầu thanh toán hoa hồng — bảng `affiliate_payout_requests` (đề xuất,
 * xem `supabase-phase27-affiliate-program.sql`, CHƯA apply). Thành viên tự
 * tạo yêu cầu ở `/portal/affiliate`; Admin xác nhận ĐÃ CHUYỂN KHOẢN THẬT
 * (ngoài hệ thống) rồi bấm "Xác nhận đã thanh toán" — hành động này đồng
 * thời chuyển các dòng `referrals.status='confirmed'` của thành viên đó
 * sang `'paid'` (xem `markPayoutPaid()`).
 */
export default async function AffiliatePayoutRequestsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { requests, configured, error } = await listPayoutRequests();
  const pending = requests.filter((r) => r.status === "pending");
  const processed = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Affiliate", href: "/admin/affiliate" }, { label: "Yêu cầu thanh toán" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Yêu cầu thanh toán hoa hồng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Danh sách yêu cầu rút hoa hồng do thành viên tự tạo. Xác nhận SAU KHI đã thực sự chuyển khoản ngoài hệ
          thống — hành động không thể hoàn tác tự động.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc dữ liệu.
        </div>
      )}
      {configured && error && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">{error}</div>
      )}
      {configured && !error && requests.length === 0 && (
        <AdminEmptyState
          icon={Wallet}
          title="Chưa có yêu cầu thanh toán nào"
          description="Danh sách này sẽ tự hiện đúng ngay khi có thành viên yêu cầu rút hoa hồng ở /portal/affiliate."
        />
      )}

      {configured && !error && pending.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900">Đang chờ xử lý ({pending.length})</h2>
          <div className="mt-3 space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
                <div>
                  <p className="font-semibold text-gray-900">{p.member_email ?? p.member_id}</p>
                  <p className="text-sm text-gray-700">{formatMoney(p.amount_requested)} — {p.bank_info ?? "Chưa có thông tin nhận tiền"}</p>
                  <p className="text-xs text-gray-500">{formatDate(p.requested_at)}</p>
                </div>
                <PayoutRequestActions id={p.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {configured && !error && processed.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900">Lịch sử xử lý ({processed.length})</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Thành viên</th>
                  <th className="px-4 py-3">Số tiền</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Xử lý lúc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processed.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-gray-900">{p.member_email ?? p.member_id}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{formatMoney(p.amount_requested)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[p.status]}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{p.processed_at ? formatDate(p.processed_at) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
