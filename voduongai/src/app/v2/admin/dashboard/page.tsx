import Link from "next/link";
import { BookOpen, CreditCard, LifeBuoy, ShieldCheck, Users } from "lucide-react";

import { V2_ADMIN_BASE } from "@/components/v2/nav/nav-config";
import { Card, CardHead } from "@/components/v2/ui/Card";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { PageHead } from "@/components/v2/ui/PageHead";
import { getSupabaseAdmin } from "@/lib/supabase";
import { listIdentityUsers } from "@/lib/admin/identity-users";
import { checkAllProvidersHealth } from "@/ai/providers/provider-health-check";
import { getCkosStats } from "@/lib/portal/live-ckos";
import { getAcademyPaths } from "@/lib/portal/live-academy";

export const metadata = { title: "Dashboard — Admin" };

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/**
 * `/v2/admin/dashboard` — không có trang Portal 2.0 tương ứng (đây là
 * trang tổng quan nội bộ Admin). Đổi từ 5 KPI/biểu đồ tăng trưởng 12
 * tháng/trạng thái hệ thống/"phân bổ người dùng theo mục"/hoạt động gần
 * đây — TẤT CẢ bịa — sang dữ liệu thật, tái dùng đúng các hàm đã nối cho
 * Người dùng/Thanh toán/Hỗ trợ/Tích hợp API/Hệ tri thức/Học viện AI (các
 * trang Admin khác đã sửa trong đợt này), không viết truy vấn mới. Bỏ
 * hẳn biểu đồ tăng trưởng theo thời gian (cần time-series analytics chưa
 * có hạ tầng) — thay bằng "Nội dung theo module" (số đếm thật, không
 * phải % lượt xem bịa).
 */
export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin();

  const [users, providers, ckosStats, academyPaths, ordersRes, ticketsRes] = await Promise.all([
    listIdentityUsers(),
    checkAllProvidersHealth(),
    getCkosStats(),
    getAcademyPaths(),
    supabase
      ? supabase.from("orders").select("id, member_email, product_name, amount, status, created_at").order("created_at", { ascending: false }).limit(5)
      : Promise.resolve({ data: [] as { id: number; member_email: string; product_name: string | null; amount: number; status: string; created_at: string }[] }),
    supabase
      ? supabase.from("support_tickets").select("id, member_email, subject, status, created_at").order("created_at", { ascending: false }).limit(5)
      : Promise.resolve({ data: [] as { id: number; member_email: string; subject: string; status: string; created_at: string }[] }),
  ]);

  const orders = ordersRes.data ?? [];
  const tickets = ticketsRes.data ?? [];
  const admins = users.filter((u) => u.isAdmin);
  const confirmedOrders = orders.filter((o) => o.status === "confirmed");
  const revenue = confirmedOrders.reduce((sum, o) => sum + (o.amount ?? 0), 0);
  const totalLessons = academyPaths.reduce((sum, p) => sum + p.lessonCount, 0);
  const availableProviders = providers.filter((p) => p.available);

  const kpis = [
    { id: "users", value: String(users.length), label: "Tổng người dùng", icon: Users, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
    { id: "admins", value: String(admins.length), label: "Quản trị viên", icon: ShieldCheck, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)" },
    { id: "lessons", value: String(totalLessons), label: "Bài học đã Published", icon: BookOpen, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
    { id: "revenue", value: formatVnd(revenue), label: "Doanh thu đã xác nhận", icon: CreditCard, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
    { id: "tickets", value: String(tickets.filter((t) => t.status === "open").length), label: "Ticket đang mở", icon: LifeBuoy, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)" },
  ];

  const contentModules = [
    { label: "Tài liệu CKOS", value: ckosStats.documents },
    { label: "Danh mục CKOS", value: ckosStats.categories },
    { label: "Công cụ & Prompt", value: ckosStats.toolsAndPrompts },
    { label: "Giai đoạn lộ trình Học viện", value: academyPaths.length },
    { label: "Bài học Published", value: totalLessons },
  ];
  const maxModule = Math.max(1, ...contentModules.map((m) => m.value));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Dashboard"
        title="Tổng quan hệ thống"
        description="Số liệu thật, đọc trực tiếp từ Supabase — không phải dữ liệu mẫu."
      />

      <div className="grid grid-cols-2 gap-[14px] min-[1180px]:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[18px]">
            <div className="mb-3 flex items-start justify-between">
              <IcoBox icon={kpi.icon} size="md" background={kpi.gradient} color="#fff" />
            </div>
            <div className="text-[22px] font-extrabold">{kpi.value}</div>
            <div className="mt-1 text-[12px] text-[var(--v2-muted)]">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-2">
        <Card padding="admin">
          <CardHead title="Nội dung theo module" />
          {contentModules.map((row) => (
            <div key={row.label} className="mb-[14px] flex items-center gap-3 last:mb-0">
              <span className="w-[190px] shrink-0 text-[12.5px] font-semibold">{row.label}</span>
              <span className="h-[10px] flex-1 overflow-hidden rounded-md bg-[var(--v2-bg)]">
                <span
                  className="block h-full rounded-md bg-[var(--v2-violet)]"
                  style={{ width: `${(row.value / maxModule) * 100}%` }}
                />
              </span>
              <span className="w-10 shrink-0 text-right text-[12.5px] font-extrabold">{row.value}</span>
            </div>
          ))}
        </Card>

        <Card padding="admin">
          <CardHead title={`AI Provider (${availableProviders.length}/${providers.length} đã cấu hình)`} />
          {providers.map((p) => (
            <div key={p.providerId} className="flex items-center justify-between border-b border-[var(--v2-line)] py-[9px] text-[12.8px] last:border-b-0">
              <span className="flex items-center gap-[9px] font-semibold">
                <i aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: p.available ? "var(--v2-green)" : "var(--v2-muted)" }} />
                {p.providerId}
              </span>
              <span
                className="rounded-md px-[9px] py-[2px] text-[11px] font-extrabold"
                style={{ background: p.available ? "#e6f7ed" : "var(--v2-bg)", color: p.available ? "#189a52" : "var(--v2-muted)" }}
              >
                {p.available ? "Đã cấu hình" : "Chưa cấu hình"}
              </span>
            </div>
          ))}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-2">
        <Card padding="admin">
          <CardHead title="Đơn hàng gần đây" action={<Link href={`${V2_ADMIN_BASE}/thanh-toan`} className="text-[12.5px] font-bold">Xem tất cả →</Link>} />
          {orders.length === 0 ? (
            <p className="text-[12.5px] text-[var(--v2-muted)]">Chưa có đơn hàng nào.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 border-b border-[var(--v2-line)] py-[10px] text-[12.5px] last:border-b-0">
                <span className="min-w-0 flex-1 truncate">{o.product_name ?? o.member_email}</span>
                <span className="shrink-0 font-bold">{formatVnd(o.amount ?? 0)}</span>
              </div>
            ))
          )}
        </Card>

        <Card padding="admin">
          <CardHead title="Ticket gần đây" action={<Link href={`${V2_ADMIN_BASE}/ho-tro`} className="text-[12.5px] font-bold">Xem tất cả →</Link>} />
          {tickets.length === 0 ? (
            <p className="text-[12.5px] text-[var(--v2-muted)]">Chưa có ticket nào.</p>
          ) : (
            tickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 border-b border-[var(--v2-line)] py-[10px] text-[12.5px] last:border-b-0">
                <span className="min-w-0 flex-1 truncate">{t.subject}</span>
                <span className="shrink-0 text-[var(--v2-muted)]">{t.status}</span>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
