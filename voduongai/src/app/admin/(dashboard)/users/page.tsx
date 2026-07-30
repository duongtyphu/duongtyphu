import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { listIdentityUsers } from "@/lib/admin/identity-users";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { UsersTable } from "./UsersTable";

export const metadata = { title: "Người dùng · Admin" };

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const users = await listIdentityUsers();
  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <div className="space-y-8">
      <AdminBreadcrumb trail={[{ label: "Người dùng" }, { label: "Danh sách người dùng" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Người dùng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Toàn bộ tài khoản của hệ sinh thái VO DUONG AI (Website, Học viện, Companion, Premium, AI
          Workspace, Dự án &amp; Cơ hội). Không thể xem hoặc đặt mật khẩu người dùng tại đây — Supabase
          Auth không bao giờ trả về mật khẩu/hash qua bất kỳ API nào.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — cần quyền
          service role để đọc danh sách người dùng.
        </div>
      )}

      {configured && <UsersTable users={users} />}
    </div>
  );
}
