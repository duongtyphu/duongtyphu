import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { listIdentityUsers } from "@/lib/admin/identity-users";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Activity, LogIn, UserPlus } from "lucide-react";

export const metadata = { title: "Hoạt động người dùng · Admin" };

type UserEvent = { key: string; kind: "Đăng ký mới" | "Đăng nhập"; email: string; userId: string; at: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * ADM-V2-01 — "Hoạt động người dùng" (Người dùng). Gộp 2 sự kiện thật đọc
 * được từ Supabase Auth (`auth.users.created_at`/`last_sign_in_at`, qua
 * `listIdentityUsers()` có sẵn) — KHÔNG phải audit log chi tiết mọi hành vi
 * (chưa có hạ tầng đó). CHỈ ĐỌC, tối đa 100 sự kiện gần nhất.
 */
export default async function HoatDongNguoiDungPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const users = await listIdentityUsers();

  const events: UserEvent[] = [
    ...users
      .filter((u) => u.registeredAt)
      .map((u) => ({
        key: `register-${u.id}`,
        kind: "Đăng ký mới" as const,
        email: u.email ?? "—",
        userId: u.id,
        at: u.registeredAt as string,
      })),
    ...users
      .filter((u) => u.lastSignInAt)
      .map((u) => ({
        key: `signin-${u.id}`,
        kind: "Đăng nhập" as const,
        email: u.email ?? "—",
        userId: u.id,
        at: u.lastSignInAt as string,
      })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 100);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Người dùng", href: "/admin/users" }, { label: "Hoạt động người dùng" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Hoạt động người dùng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Đăng ký mới và lần đăng nhập gần nhất, gộp theo thời gian giảm dần. Chưa phải audit log chi tiết
          hành vi (cần hạ tầng riêng, chưa có sẵn).
        </p>
      </div>

      {events.length === 0 ? (
        <AdminEmptyState icon={Activity} title="Chưa có hoạt động nào" description="Chưa có tài khoản nào đăng ký hoặc đăng nhập, hoặc Supabase chưa được cấu hình." />
      ) : (
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {events.map((e) => (
            <Link
              key={e.key}
              href={`/admin/users/${e.userId}`}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-gray-50"
            >
              <div className="flex min-w-0 items-center gap-2">
                {e.kind === "Đăng ký mới" ? (
                  <UserPlus className="h-4 w-4 shrink-0 text-purple-600" />
                ) : (
                  <LogIn className="h-4 w-4 shrink-0 text-blue-600" />
                )}
                <span className="truncate text-sm font-semibold text-gray-900">{e.email}</span>
                <span className="shrink-0 text-xs text-gray-400">· {e.kind}</span>
              </div>
              <span className="shrink-0 text-xs text-gray-400">{formatDate(e.at)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
