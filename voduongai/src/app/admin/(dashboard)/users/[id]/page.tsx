import { redirect, notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getIdentityUserById } from "@/lib/admin/identity-users";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Chi tiết người dùng · Admin" };

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Đã xác thực",
  unconfirmed: "Chưa xác thực",
  banned: "Bị khoá",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/**
 * ADM-V2-01 — trang chi tiết drill-down cho 1 người dùng, mở từ cột Email
 * ở "Danh sách người dùng". CHỈ ĐỌC: hồ sơ (auth + members) + lịch sử đơn
 * hàng của đúng email đó (bảng orders, mọi trạng thái). Không có thao tác
 * ghi (khoá tài khoản/đổi vai trò...) — ngoài phạm vi sprint đọc-dữ-liệu.
 */
export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const user = await getIdentityUserById(id);
  if (!user) notFound();

  const supabase = getSupabaseAdmin();
  const { data: orders } = user.email && supabase
    ? await supabase
        .from("orders")
        .select("id, product_name, course_id, amount, status, created_at")
        .eq("member_email", user.email)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        trail={[
          { label: "Người dùng", href: "/admin/users" },
          { label: "Danh sách người dùng", href: "/admin/users" },
          { label: user.email ?? id },
        ]}
      />

      <div>
        <h1 className="text-xl font-extrabold text-gray-900">{user.email ?? "—"}</h1>
        <p className="mt-1 text-sm text-gray-500">Chi tiết tài khoản — chỉ đọc, không có thao tác ghi.</p>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Họ tên</dt>
          <dd className="mt-0.5 text-sm text-gray-900">{user.fullName ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Vai trò</dt>
          <dd className="mt-0.5 text-sm text-gray-900">{user.isAdmin ? "Admin" : "User"}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Trạng thái xác thực</dt>
          <dd className="mt-0.5 text-sm text-gray-900">{STATUS_LABEL[user.status] ?? user.status}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Provider</dt>
          <dd className="mt-0.5 text-sm text-gray-900">{user.provider}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Onboarding</dt>
          <dd className="mt-0.5 text-sm text-gray-900">{user.onboardingCompleted ? "Đã xong" : "Chưa xong"}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Ngày đăng ký</dt>
          <dd className="mt-0.5 text-sm text-gray-900">{formatDate(user.registeredAt)}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Lần đăng nhập gần nhất</dt>
          <dd className="mt-0.5 text-sm text-gray-900">{formatDate(user.lastSignInAt)}</dd>
        </div>
      </dl>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Lịch sử đơn hàng</h2>
        <div className="mt-2 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Số tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(orders ?? []).map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 text-gray-700">{o.product_name ?? o.course_id ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{formatMoney(o.amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{o.status}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatDate(o.created_at)}</td>
                </tr>
              ))}
              {(orders ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
