import { Crown, ShieldAlert, UserPlus, Users } from "lucide-react";

import { V2_ADMIN_BASE } from "@/components/v2/nav/nav-config";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { formatDate } from "@/lib/v2/data/client";
import {
  PLAN_LABEL,
  PLAN_STYLE,
  STATUS_COLOR,
  STATUS_LABEL,
  countUsers,
  listUsers,
} from "@/lib/v2/data/users";

export const metadata = { title: "Người dùng — Admin" };

export default async function AdminUsersPage() {
  const [users, total] = await Promise.all([listUsers(), countUsers()]);

  const rows: TableRow[] = users.map((user) => ({
    id: user.id,
    href: `${V2_ADMIN_BASE}/nguoi-dung/${user.id}`,
    tags: [user.plan === "free" ? "free" : "premium", user.status],
    cells: [
      { t: "user", initials: user.initials, name: user.fullName, sub: user.email },
      {
        t: "tag",
        label: PLAN_LABEL[user.plan],
        background: PLAN_STYLE[user.plan].background,
        color: PLAN_STYLE[user.plan].color,
      },
      { t: "status", label: STATUS_LABEL[user.status], color: STATUS_COLOR[user.status] },
      { t: "text", v: formatDate(user.joinedAt) },
      { t: "muted", v: user.lastActiveLabel },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Người dùng"
        title="Quản lý người dùng"
        description="Xem, tìm kiếm và quản lý toàn bộ tài khoản trên hệ thống VO DUONG AI."
      />

      <KpiGrid
        items={[
          { id: "total", value: "18.420", label: "Tổng người dùng", icon: Users, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "12,4%", trend: "up" },
          { id: "premium", value: "2.384", label: "Đang dùng Premium", icon: Crown, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)", delta: "8,1%", trend: "up" },
          { id: "new", value: "486", label: "Đăng ký mới (30 ngày)", icon: UserPlus, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "5,2%", trend: "up" },
          { id: "suspended", value: "27", label: "Tài khoản bị khoá", icon: ShieldAlert, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)", delta: "1,4%", trend: "down" },
        ]}
      />

      <DataTable
        headers={["Người dùng", "Gói", "Trạng thái", "Ngày tham gia", "Hoạt động cuối"]}
        rows={rows}
        totalLabel="người dùng"
        totalOverride={total}
        searchPlaceholder="Tìm theo tên hoặc email..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "premium", label: "Premium", tag: "premium" },
          { id: "free", label: "Miễn phí", tag: "free" },
          { id: "suspended", label: "Bị khoá", tag: "suspended" },
        ]}
      />
    </div>
  );
}
