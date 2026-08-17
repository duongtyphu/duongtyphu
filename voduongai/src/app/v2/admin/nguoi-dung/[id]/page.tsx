import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { V2_ADMIN_BASE } from "@/components/v2/nav/nav-config";
import { Card, CardHead } from "@/components/v2/ui/Card";
import { getIdentityUserById } from "@/lib/admin/identity-users";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Chi tiết người dùng — Admin" };

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Đã xác thực",
  unconfirmed: "Chưa xác thực",
  banned: "Đã khoá",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/**
 * `/v2/admin/nguoi-dung/[id]` — không có trang Portal 2.0 tương ứng. Đổi
 * từ hồ sơ mock (số liệu bịa "342 cuộc trò chuyện Companion", "142 giới
 * thiệu Affiliate", toggle/select KHÔNG có action lưu thật) sang CHỈ ĐỌC
 * dữ liệu thật (`getIdentityUserById()` + lịch sử đơn hàng bảng `orders`)
 * — cùng cách 1.0's `/admin/users/[id]` (ADM-V2-01) đã làm. Không tự thêm
 * nút khoá/mở khoá tài khoản (hành động nhạy cảm, chưa có cơ chế thật) —
 * trỏ sang trang 1.0 cho các thao tác đó.
 */
export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getIdentityUserById(id);
  if (!user) notFound();

  const supabase = getSupabaseAdmin();
  const { data: orders } =
    user.email && supabase
      ? await supabase
          .from("orders")
          .select("id, product_name, course_id, amount, status, created_at")
          .eq("member_email", user.email)
          .order("created_at", { ascending: false })
      : { data: null };

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <div className="flex items-center justify-between gap-6 text-[12px] text-[var(--v2-muted)]">
        <Link href={`${V2_ADMIN_BASE}/nguoi-dung`}>Admin › Người dùng</Link>
        <Link
          href={`/admin/users/${id}`}
          className="rounded-[10px] border border-[var(--v2-line)] bg-[var(--v2-surface)] px-4 py-[9px] text-[12.5px] font-bold text-[var(--v2-violet)]"
        >
          Xem tại Admin 1.0 →
        </Link>
      </div>

      <div className="flex items-center gap-4 rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[22px]">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b7bde,#5f4bc9)] text-[22px] font-bold text-white">
          {(user.fullName ?? user.email ?? "??").slice(0, 2).toUpperCase()}
        </span>
        <div>
          <h2 className="flex flex-wrap items-center gap-[10px] text-[20px] font-extrabold">
            {user.fullName ?? "(chưa đặt tên)"}
            <span
              className="rounded-md px-[9px] py-[3px] text-[11px] font-extrabold"
              style={{ background: user.status === "confirmed" ? "#e6f7ed" : "#fdf1e0", color: "var(--v2-muted)" }}
            >
              {STATUS_LABEL[user.status]}
            </span>
            {user.isAdmin ? (
              <span className="flex items-center gap-1 rounded-md bg-[#e6f0ff] px-[9px] py-[3px] text-[11px] font-extrabold text-[#1d5fd8]">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Quản trị viên
              </span>
            ) : null}
          </h2>
          <p className="mt-1 text-[13px] text-[var(--v2-muted)]">
            {user.email ?? "—"} · Đăng ký {formatDate(user.registeredAt)} · Đăng nhập gần nhất{" "}
            {formatDate(user.lastSignInAt)} · Nhà cung cấp {user.provider}
          </p>
        </div>
      </div>

      <Card padding="admin">
        <CardHead title={`Lịch sử đơn hàng (${orders?.length ?? 0})`} />
        {!orders || orders.length === 0 ? (
          <p className="text-[12.5px] text-[var(--v2-muted)]">Chưa có đơn hàng nào.</p>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between gap-4 border-b border-[var(--v2-line)] py-3 text-[12.8px] last:border-b-0"
            >
              <div className="min-w-0">
                <div className="truncate font-bold">{o.product_name ?? o.course_id ?? "—"}</div>
                <div className="text-[11px] text-[var(--v2-muted)]">{formatDate(o.created_at)}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-extrabold">{formatMoney(o.amount)}</div>
                <div className="text-[11px] text-[var(--v2-muted)]">{o.status}</div>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
