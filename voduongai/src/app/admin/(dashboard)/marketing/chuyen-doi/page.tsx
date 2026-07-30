import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { TrendingUp } from "lucide-react";

export const metadata = { title: "Chuyển đổi · Admin" };

type FunnelRow = { source: string; leads: number; converted: number };

/**
 * ADM-V2-06 — "Chuyển đổi" (Marketing). ĐÍNH CHÍNH phạm vi so với ghi chú
 * gốc ("phễu Landing Page → đăng ký → onboarding → mua khoá học" — cần
 * page-view analytics từ Google Analytics, ứng dụng không có quyền đọc
 * lại GA, đúng như ghi chú gốc). Audit phát hiện 1 phễu NỘI BỘ khác vẫn
 * tính được từ dữ liệu thật đã có, KHÔNG cần GA: khách hàng tiềm năng
 * (`leads`, theo `source`) → có trở thành khách mua hàng không (khớp
 * email với `orders.status='confirmed'`). Đây là góc nhìn TỔNG HỢP theo
 * nguồn (khác "Khách hàng tiềm năng"/"Đơn hàng" ở Vận hành — 2 trang đó
 * là danh sách RAW từng dòng, trang này là tỷ lệ chuyển đổi TỔNG HỢP theo
 * nguồn), không tạo 2 nơi cùng quản 1 danh sách.
 */
export default async function ChuyenDoiPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const [leadsRes, ordersRes] = supabase
    ? await Promise.all([
        supabase.from("leads").select("email, source"),
        supabase.from("orders").select("member_email").eq("status", "confirmed"),
      ])
    : [{ data: null, error: null }, { data: null, error: null }];

  const confirmedEmails = new Set((ordersRes.data ?? []).map((o) => o.member_email.toLowerCase()));
  const bySource = new Map<string, FunnelRow>();
  for (const lead of leadsRes.data ?? []) {
    const source = lead.source ?? "Không rõ nguồn";
    const row = bySource.get(source) ?? { source, leads: 0, converted: 0 };
    row.leads += 1;
    if (confirmedEmails.has(lead.email.toLowerCase())) row.converted += 1;
    bySource.set(source, row);
  }
  const funnel = Array.from(bySource.values()).sort((a, b) => b.leads - a.leads);
  const totalLeads = funnel.reduce((sum, r) => sum + r.leads, 0);
  const totalConverted = funnel.reduce((sum, r) => sum + r.converted, 0);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Marketing", href: "/admin/marketing/chuyen-doi" }, { label: "Chuyển đổi" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Chuyển đổi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tỷ lệ chuyển đổi khách hàng tiềm năng → khách mua hàng, theo từng nguồn (khớp email với đơn hàng
          đã xác nhận). Phễu đầy đủ từ lượt xem Landing Page cần Google Analytics — xem{" "}
          <code className="text-gray-700">/admin/he-thong/api-tich-hop</code> để biết trạng thái GA.
        </p>
      </div>

      {!supabase && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể
          tính chuyển đổi.
        </div>
      )}

      {supabase && funnel.length === 0 && (
        <AdminEmptyState
          icon={TrendingUp}
          title="Chưa có khách hàng tiềm năng nào"
          description="Cần có dữ liệu leads trước khi tính được tỷ lệ chuyển đổi theo nguồn."
        />
      )}

      {supabase && funnel.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Tổng khách hàng tiềm năng</p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">{totalLeads}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Tỷ lệ chuyển đổi tổng</p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">
                {totalLeads > 0 ? Math.round((totalConverted / totalLeads) * 100) : 0}%
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nguồn</th>
                  <th className="px-4 py-3">Khách hàng tiềm năng</th>
                  <th className="px-4 py-3">Đã mua hàng</th>
                  <th className="px-4 py-3">Tỷ lệ chuyển đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {funnel.map((row) => (
                  <tr key={row.source}>
                    <td className="px-4 py-3 font-semibold text-gray-900">{row.source}</td>
                    <td className="px-4 py-3 text-gray-700">{row.leads}</td>
                    <td className="px-4 py-3 text-gray-700">{row.converted}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {Math.round((row.converted / row.leads) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
