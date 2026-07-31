import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { listIdentityUsers } from "@/lib/admin/identity-users";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { KeyRound } from "lucide-react";

export const metadata = { title: "Phiên đăng nhập · Admin" };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * ADM-V2-01 — "Phiên đăng nhập" (Người dùng). Supabase Auth KHÔNG có API
 * liệt kê "phiên đang hoạt động" theo thiết bị/vị trí (chỉ có
 * `last_sign_in_at` mỗi user) — trang này hiển thị TRUNG THỰC đúng dữ liệu
 * đó, sắp theo lần đăng nhập gần nhất, thay vì bịa ra danh sách phiên/thiết
 * bị không tồn tại. KHÔNG có thao tác thu hồi (revoke) phiên — hành động
 * nhạy cảm ảnh hưởng phiên đăng nhập thật, chủ động loại khỏi phạm vi
 * sprint đọc-dữ-liệu này (đúng nguyên tắc không đụng Identity Hub ngoài
 * phạm vi đã duyệt).
 */
export default async function PhienDangNhapPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const users = await listIdentityUsers();
  const withSignIn = users
    .filter((u) => u.lastSignInAt)
    .sort((a, b) => (b.lastSignInAt ?? "").localeCompare(a.lastSignInAt ?? ""));

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Người dùng", href: "/admin/users" }, { label: "Phiên đăng nhập" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Phiên đăng nhập</h1>
        <p className="mt-1 text-sm text-gray-500">
          Lần đăng nhập gần nhất của từng tài khoản, sắp theo thời gian gần nhất trước. Supabase Auth
          không cung cấp API liệt kê phiên đang hoạt động theo thiết bị/vị trí, và không có thao tác thu
          hồi phiên ở đây (hành động nhạy cảm, ngoài phạm vi đợt này).
        </p>
      </div>

      {withSignIn.length === 0 ? (
        <AdminEmptyState
          icon={KeyRound}
          title="Chưa có lượt đăng nhập nào được ghi nhận"
          description="Chưa có tài khoản nào từng đăng nhập, hoặc Supabase chưa được cấu hình."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Lần đăng nhập gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {withSignIn.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{u.email ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{u.provider}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatDate(u.lastSignInAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
