import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Khách hàng tiềm năng · Admin" };

type LeadRow = { id: number; email: string; source: string | null; status: string; created_at: string };

const STATUS_LABEL: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  converted: "Đã chuyển đổi",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * Vận hành — "Khách hàng tiềm năng" (Admin v2.0). Bảng `leads` đã có dữ
 * liệu thật (`/api/leads`, form thu email trên Landing Page) nhưng trước
 * đây KHÔNG có trang Admin nào đọc. CHỈ ĐỌC — không có thao tác đổi trạng
 * thái/xoá ở đây (tránh action nguy hiểm ngoài phạm vi đợt này).
 */
export default async function KhachHangTiemNangPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const { data, error } = supabase
    ? await supabase.from("leads").select("id, email, source, status, created_at").order("created_at", { ascending: false }).limit(200)
    : { data: null, error: null };

  const leads = (data ?? []) as LeadRow[];

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Vận hành", href: "/admin/van-hanh/don-hang" }, { label: "Khách hàng tiềm năng" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Khách hàng tiềm năng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Email đăng ký quan tâm (opt-in) từ các form trên Landing Page. Trang này CHỈ ĐỌC.
        </p>
      </div>

      {!supabase && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc
          danh sách khách hàng tiềm năng.
        </div>
      )}

      {supabase && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-gray-700">
          Không đọc được bảng leads: {error.message}
        </div>
      )}

      {supabase && !error && leads.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Chưa có khách hàng tiềm năng nào.
        </div>
      )}

      {supabase && !error && leads.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Nguồn</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{l.email}</td>
                  <td className="px-4 py-3 text-gray-600">{l.source ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">
                      {STATUS_LABEL[l.status] ?? l.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
