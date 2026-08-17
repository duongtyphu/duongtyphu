import { CheckCircle2, LifeBuoy, MessageCircleReply } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Hỗ trợ & Ticket — Admin" };

const STATUS_LABEL: Record<string, string> = { open: "Đang mở", replied: "Đã trả lời", closed: "Đã đóng" };
const STATUS_STYLE: Record<string, { background: string; color: string }> = {
  open: { background: "#fdf1e0", color: "#a9822c" },
  replied: { background: "#e6f0ff", color: "#1d5fd8" },
  closed: { background: "var(--v2-bg)", color: "var(--v2-muted)" },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * `/v2/admin/ho-tro` — không có trang Portal 2.0 tương ứng. Đổi từ mock
 * (`@/lib/v2/data/ops` — ưu tiên/danh mục/CSAT/SLA hoàn toàn bịa, schema
 * thật không có các field này) sang bảng `support_tickets` thật (cùng
 * nguồn Admin 1.0's `/admin/van-hanh/ho-tro-khach-hang`) — đúng 6 field
 * thật: member_email/subject/message/reply/status/created_at.
 */
export default async function AdminHoTroPage() {
  const supabase = getSupabaseAdmin();
  const { data } = supabase
    ? await supabase
        .from("support_tickets")
        .select("id, member_email, subject, message, reply, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100)
    : { data: [] };

  const tickets = data ?? [];
  const open = tickets.filter((t) => t.status === "open");
  const replied = tickets.filter((t) => t.status === "replied");
  const closed = tickets.filter((t) => t.status === "closed");

  const rows: TableRow[] = tickets.map((ticket) => ({
    id: String(ticket.id),
    tags: [ticket.status],
    cells: [
      { t: "strong", v: ticket.subject },
      { t: "user", initials: (ticket.member_email ?? "??").slice(0, 2).toUpperCase(), name: ticket.member_email ?? "—", sub: ticket.message.slice(0, 60) },
      {
        t: "tag",
        label: STATUS_LABEL[ticket.status] ?? ticket.status,
        background: STATUS_STYLE[ticket.status]?.background ?? "var(--v2-bg)",
        color: STATUS_STYLE[ticket.status]?.color ?? "var(--v2-muted)",
      },
      { t: "muted", v: ticket.reply ? "Đã có phản hồi" : "Chưa phản hồi" },
      { t: "muted", v: formatDateTime(ticket.created_at) },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Quản trị hệ thống › Hỗ trợ & Ticket"
        title="Hỗ trợ & Ticket khách hàng"
        description="Ticket thật từ bảng support_tickets — cùng nguồn Admin 1.0 (/admin/van-hanh/ho-tro-khach-hang) đang đọc."
      />

      <KpiGrid
        items={[
          { id: "total", value: String(tickets.length), label: "Tổng ticket", icon: LifeBuoy, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "open", value: String(open.length), label: "Đang mở", icon: LifeBuoy, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)" },
          { id: "replied", value: String(replied.length), label: "Đã trả lời", icon: MessageCircleReply, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)" },
          { id: "closed", value: String(closed.length), label: "Đã đóng", icon: CheckCircle2, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
        ]}
      />

      <DataTable
        title="Danh sách ticket"
        headers={["Chủ đề", "Người gửi", "Trạng thái", "Phản hồi", "Thời gian"]}
        rows={rows}
        totalLabel="ticket"
        totalOverride={tickets.length}
        searchPlaceholder="Tìm ticket hoặc email..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "open", label: "Đang mở", tag: "open" },
          { id: "replied", label: "Đã trả lời", tag: "replied" },
          { id: "closed", label: "Đã đóng", tag: "closed" },
        ]}
      />
    </div>
  );
}
