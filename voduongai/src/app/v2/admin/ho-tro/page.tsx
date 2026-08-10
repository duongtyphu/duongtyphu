import { AlarmClock, LifeBuoy, Smile, Timer } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { formatDateTime } from "@/lib/v2/data/client";
import {
  PRIORITY_COLOR,
  PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
  TICKET_STATUS_STYLE,
  listTickets,
} from "@/lib/v2/data/ops";

export const metadata = { title: "Hỗ trợ & Ticket — Admin" };

export default async function AdminHoTroPage() {
  const tickets = await listTickets();

  const rows: TableRow[] = tickets.map((ticket) => ({
    id: ticket.id,
    tags: [ticket.status, ticket.priority],
    cells: [
      { t: "strong", v: ticket.subject },
      {
        t: "user",
        initials: ticket.requesterName.slice(0, 2).toUpperCase(),
        name: ticket.requesterName,
        sub: ticket.requesterEmail,
      },
      {
        t: "tag",
        label: ticket.category,
        background: "var(--v2-violet-light)",
        color: "var(--v2-violet)",
      },
      { t: "status", label: PRIORITY_LABEL[ticket.priority], color: PRIORITY_COLOR[ticket.priority] },
      {
        t: "tag",
        label: TICKET_STATUS_LABEL[ticket.status],
        background: TICKET_STATUS_STYLE[ticket.status].background,
        color: TICKET_STATUS_STYLE[ticket.status].color,
      },
      { t: "muted", v: formatDateTime(ticket.updatedAt) },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Quản trị hệ thống › Hỗ trợ & Ticket"
        title="Hỗ trợ & Ticket khách hàng"
        description="Quản lý yêu cầu hỗ trợ, phản hồi khách hàng và theo dõi SLA."
      />

      <KpiGrid
        items={[
          { id: "open", value: "86", label: "Ticket đang mở", icon: LifeBuoy, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "4,2%", trend: "down" },
          { id: "response", value: "1h 42m", label: "Thời gian phản hồi TB", icon: Timer, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "12,0%", trend: "up" },
          { id: "csat", value: "4,7/5", label: "Điểm hài lòng (CSAT)", icon: Smile, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "0,2", trend: "up" },
          { id: "sla", value: "7", label: "Ticket quá SLA", icon: AlarmClock, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)", delta: "2,0%", trend: "down" },
        ]}
      />

      <DataTable
        title="Danh sách ticket"
        headers={["Ticket", "Khách hàng", "Danh mục", "Ưu tiên", "Trạng thái", "Cập nhật"]}
        rows={rows}
        totalLabel="ticket"
        searchPlaceholder="Tìm ticket hoặc khách hàng..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "open", label: "Đang mở", tag: "open" },
          { id: "in-progress", label: "Đang xử lý", tag: "in-progress" },
          { id: "urgent", label: "Khẩn cấp", tag: "urgent" },
          { id: "resolved", label: "Đã giải quyết", tag: "resolved" },
        ]}
      />
    </div>
  );
}
