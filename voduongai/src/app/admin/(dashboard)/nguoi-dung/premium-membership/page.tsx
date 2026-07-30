import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Gem } from "lucide-react";

export const metadata = { title: "Premium Membership · Admin" };

type PurchaseRow = {
  id: number;
  member_email: string;
  customer_name: string | null;
  course_id: string | null;
  amount: number;
  confirmed_at: string | null;
  created_at: string;
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * ADM-V2-01 — "Premium Membership" (Người dùng). Góc nhìn THEO TỪNG LẦN
 * MUA khoá Premium (`orders.course_id` khác null + `status='confirmed'`) —
 * KHÁC "Thành viên" (góc nhìn gộp theo thành viên, mọi sản phẩm). Mỗi dòng
 * ở đây là 1 giao dịch mua khoá Premium cụ thể, khớp đúng bảng `courses`
 * (`/admin/course-pricing`). CHỈ ĐỌC.
 */
export default async function PremiumMembershipPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const [ordersRes, coursesRes] = supabase
    ? await Promise.all([
        supabase
          .from("orders")
          .select("id, member_email, customer_name, course_id, amount, confirmed_at, created_at")
          .eq("status", "confirmed")
          .not("course_id", "is", null)
          .order("confirmed_at", { ascending: false }),
        supabase.from("courses").select("id, name"),
      ])
    : [{ data: null, error: null }, { data: null, error: null }];

  const courseNameById = new Map((coursesRes.data ?? []).map((c) => [c.id, c.name]));
  const purchases = (ordersRes.data ?? []) as PurchaseRow[];
  const error = ordersRes.error;

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Người dùng", href: "/admin/users" }, { label: "Premium Membership" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Premium Membership</h1>
        <p className="mt-1 text-sm text-gray-500">
          Danh sách từng lần mua khoá Premium đã xác nhận (
          <code className="text-gray-700">orders.course_id</code> khác rỗng +{" "}
          <code className="text-gray-700">status = &quot;confirmed&quot;</code>), khớp đúng bảng khoá học
          quản lý ở &quot;Giá khoá học Premium&quot;.
        </p>
      </div>

      {!supabase && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc
          dữ liệu Premium Membership.
        </div>
      )}

      {supabase && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-gray-700">
          Không đọc được dữ liệu: {error.message}
        </div>
      )}

      {supabase && !error && purchases.length === 0 && (
        <AdminEmptyState
          icon={Gem}
          title="Chưa có giao dịch mua khoá Premium nào được xác nhận"
          description="Danh sách này sẽ tự hiện đúng ngay khi có đơn hàng mua khoá học (course_id khác rỗng) được xác nhận."
          action={{ label: "Xem Đơn hàng", href: "/admin/van-hanh/don-hang" }}
        />
      )}

      {supabase && !error && purchases.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Người mua</th>
                <th className="px-4 py-3">Khoá học</th>
                <th className="px-4 py-3">Số tiền</th>
                <th className="px-4 py-3">Ngày xác nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchases.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{p.customer_name ?? "—"}</div>
                    <div className="text-xs text-gray-500">{p.member_email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {(p.course_id && courseNameById.get(p.course_id)) ?? p.course_id ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{formatMoney(p.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {formatDate(p.confirmed_at ?? p.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
