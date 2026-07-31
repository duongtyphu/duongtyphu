import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { listIdentityUsers } from "@/lib/admin/identity-users";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Vai trò & Phân quyền · Admin" };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN");
}

/**
 * ADM-V2-01 — "Vai trò & Phân quyền" (Người dùng). Hệ thống hiện tại chỉ có
 * ĐÚNG 1 cột phân quyền — `members.is_admin` (boolean, có/không) — KHÔNG có
 * bảng vai trò (role) hay quyền theo Workspace nào. Trang này hiển thị
 * TRUNG THỰC mô hình nhị phân đang chạy thật (không phải dữ liệu giả), thay
 * vì bịa ra danh sách vai trò không tồn tại. Xây hệ vai trò chi tiết hơn
 * (Editor nội dung, Hỗ trợ khách hàng...) cần thiết kế schema + migration
 * mới, đúng nguyên tắc "không tự thay đổi schema Supabase nếu chưa thật sự
 * cần thiết" — CHƯA làm ở sprint này.
 */
export default async function VaiTroPhanQuyenPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const users = await listIdentityUsers();
  const admins = users.filter((u) => u.isAdmin);
  const regularCount = users.length - admins.length;

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Người dùng", href: "/admin/users" }, { label: "Vai trò & Phân quyền" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Vai trò & Phân quyền</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hệ thống hiện dùng đúng 1 cột phân quyền nhị phân (<code className="text-gray-700">members.is_admin</code>)
          — chưa có hệ vai trò chi tiết (Editor, Hỗ trợ khách hàng...). Trang này hiển thị đúng mô hình
          thật đang chạy, không phải bản rút gọn của một hệ vai trò lớn hơn.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Admin (toàn quyền)</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">{admins.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">User (thành viên thường)</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">{regularCount}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Danh sách Admin</h2>
        <div className="mt-2 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Họ tên</th>
                <th className="px-4 py-3">Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${u.id}`} className="font-semibold text-brand-blue hover:underline">
                      {u.email ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.fullName ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(u.registeredAt)}</td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-400">
                    Chưa có tài khoản Admin nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Link href="/admin/users" className="text-sm font-semibold text-brand-blue hover:underline">
        Xem toàn bộ Danh sách người dùng →
      </Link>
    </div>
  );
}
