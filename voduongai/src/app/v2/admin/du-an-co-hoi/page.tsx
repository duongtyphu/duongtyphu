import { Briefcase, FileText, Layers, Users } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { formatDate } from "@/lib/v2/data/client";
import { OPP_STATUS_LABEL, listOpportunities } from "@/lib/v2/data/catalog";

export const metadata = { title: "Dự án & Cơ hội — Admin" };

const OPP_STATUS_STYLE = {
  open: { background: "#e6f7ed", color: "#189a52" },
  reviewing: { background: "#fdf1e0", color: "#a9822c" },
  closed: { background: "var(--v2-bg)", color: "var(--v2-muted)" },
} as const;

export default async function AdminDuAnPage() {
  const opportunities = await listOpportunities();

  const rows: TableRow[] = opportunities.map((opportunity) => ({
    id: opportunity.id,
    tags: [opportunity.status],
    cells: [
      { t: "strong", v: opportunity.title },
      {
        t: "tag",
        label: opportunity.partner,
        background: "var(--v2-violet-light)",
        color: "var(--v2-violet)",
      },
      { t: "muted", v: opportunity.budget },
      {
        t: "tag",
        label: OPP_STATUS_LABEL[opportunity.status],
        background: OPP_STATUS_STYLE[opportunity.status].background,
        color: OPP_STATUS_STYLE[opportunity.status].color,
      },
      { t: "muted", v: formatDate(opportunity.deadline) },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Nội dung Portal › Dự án & Cơ hội"
        title="Quản lý Dự án & Cơ hội"
        description="Quản lý các dự án con, cơ hội đầu tư và tin tức hiển thị trên Portal."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "projects", value: "5", label: "Dự án con", icon: Layers, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "interested", value: "2.610", label: "Người dùng quan tâm", icon: Users, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "6,4%", trend: "up" },
          { id: "open", value: "12", label: "Cơ hội đang mở", icon: Briefcase, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
          { id: "news", value: "28", label: "Bài tin tức đã đăng", icon: FileText, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
        ]}
      />

      <DataTable
        title="Cơ hội đang quản lý"
        headers={["Cơ hội", "Đối tác", "Ngân sách", "Trạng thái", "Hạn chót"]}
        rows={rows}
        totalLabel="cơ hội"
        searchPlaceholder="Tìm cơ hội hoặc đối tác..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "open", label: "Đang mở", tag: "open" },
          { id: "reviewing", label: "Đang xét duyệt", tag: "reviewing" },
          { id: "closed", label: "Đã đóng", tag: "closed" },
        ]}
      />
    </div>
  );
}
