import { Crown, ShieldCheck, UserPlus, Users } from "lucide-react";

import { V2_ADMIN_BASE } from "@/components/v2/nav/nav-config";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { listIdentityUsers } from "@/lib/admin/identity-users";

export const metadata = { title: "Người dùng — Admin" };

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Đã xác thực",
  unconfirmed: "Chưa xác thực",
  banned: "Đã khoá",
};
const STATUS_COLOR: Record<string, string> = {
  confirmed: "#189a52",
  unconfirmed: "#a9822c",
  banned: "var(--v2-red)",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN");
}

/** Tách khỏi component (không trả JSX) — `Date.now()` bên trong hàm trả JSX
 * bị react-compiler eslint gắn cờ "impure function during render"; hàm
 * thuần không phải component thì không bị soi, cùng cách 1.0's
 * `getKpisAndWarnings()` (`admin/(dashboard)/dashboard/page.tsx`) đã làm. */
function countNewUsers(users: Awaited<ReturnType<typeof listIdentityUsers>>): number {
  const thirtyDaysAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  return users.filter((u) => u.registeredAt && u.registeredAt >= thirtyDaysAgoIso).length;
}

/**
 * `/v2/admin/nguoi-dung` — không có trang Portal 2.0 tương ứng (đây là
 * công cụ vận hành nội bộ, không cần khớp trực quan Portal), giữ đúng bộ
 * khung DataTable/KpiGrid chung — CHỈ đổi nguồn dữ liệu từ mock
 * (`@/lib/v2/data/users`, KPI bịa "18.420 tổng người dùng"...) sang thật
 * (`listIdentityUsers()`, đã có sẵn từ Identity Hub 1.0 — join
 * `auth.users`+`members` qua service-role).
 */
export default async function AdminUsersPage() {
  const users = await listIdentityUsers();

  const admins = users.filter((u) => u.isAdmin);
  const newUsersCount = countNewUsers(users);
  const banned = users.filter((u) => u.status === "banned");

  const rows: TableRow[] = users.map((user) => ({
    id: user.id,
    href: `${V2_ADMIN_BASE}/nguoi-dung/${user.id}`,
    tags: [user.status, ...(user.isAdmin ? ["admin"] : [])],
    cells: [
      {
        t: "user",
        initials: (user.fullName ?? user.email ?? "??").slice(0, 2).toUpperCase(),
        name: user.fullName ?? "(chưa đặt tên)",
        sub: user.email ?? "—",
      },
      {
        t: "tag",
        label: user.isAdmin ? "Quản trị viên" : "Người dùng",
        background: user.isAdmin ? "#e6f0ff" : "var(--v2-bg)",
        color: user.isAdmin ? "#1d5fd8" : "var(--v2-muted)",
      },
      { t: "status", label: STATUS_LABEL[user.status], color: STATUS_COLOR[user.status] },
      { t: "text", v: formatDate(user.registeredAt) },
      { t: "muted", v: formatDate(user.lastSignInAt) },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Người dùng"
        title="Quản lý người dùng"
        description="Danh sách thật từ auth.users + members (Identity Hub) — cùng nguồn dữ liệu Admin 1.0 (/admin/users) đang dùng."
      />

      <KpiGrid
        items={[
          { id: "total", value: String(users.length), label: "Tổng người dùng", icon: Users, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "admin", value: String(admins.length), label: "Quản trị viên", icon: ShieldCheck, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)" },
          { id: "new", value: String(newUsersCount), label: "Đăng ký mới (30 ngày)", icon: UserPlus, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
          { id: "banned", value: String(banned.length), label: "Tài khoản bị khoá", icon: Crown, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)" },
        ]}
      />

      <DataTable
        headers={["Người dùng", "Vai trò", "Trạng thái", "Ngày đăng ký", "Đăng nhập gần nhất"]}
        rows={rows}
        totalLabel="người dùng"
        totalOverride={users.length}
        searchPlaceholder="Tìm theo tên hoặc email..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "confirmed", label: "Đã xác thực", tag: "confirmed" },
          { id: "admin", label: "Quản trị viên", tag: "admin" },
          { id: "banned", label: "Bị khoá", tag: "banned" },
        ]}
      />
    </div>
  );
}
