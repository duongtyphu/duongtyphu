import { FolderKanban, LayoutGrid, Users, Workflow } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { listWorkspaceTools } from "@/lib/v2/data/catalog";

export const metadata = { title: "AI Workspace — Admin" };

const TOOL_STATUS = {
  active: { label: "Đang bật", background: "#e6f7ed", color: "#189a52" },
  beta: { label: "Thử nghiệm", background: "#fdf1e0", color: "#a9822c" },
  off: { label: "Đã tắt", background: "var(--v2-bg)", color: "var(--v2-muted)" },
} as const;

export default async function AdminAiWorkspacePage() {
  const tools = await listWorkspaceTools();

  const rows: TableRow[] = tools.map((tool) => ({
    id: tool.id,
    tags: [tool.status, tool.visible ? "visible" : "hidden"],
    cells: [
      { t: "strong", v: tool.name },
      { t: "muted", v: tool.kind },
      {
        t: "tag",
        label: tool.group,
        background: "var(--v2-violet-light)",
        color: "var(--v2-violet)",
      },
      {
        t: "status",
        label: tool.visible ? "Hiển thị" : "Ẩn",
        color: tool.visible ? "var(--v2-green)" : "var(--v2-muted)",
      },
      {
        t: "tag",
        label: TOOL_STATUS[tool.status].label,
        background: TOOL_STATUS[tool.status].background,
        color: TOOL_STATUS[tool.status].color,
      },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Nội dung Portal › AI Workspace"
        title="Quản lý AI Workspace"
        description="Quản lý công cụ AI theo nhóm và workflow mẫu hiển thị trên AI Workspace."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "tools", value: "63", label: "Tổng công cụ AI", icon: LayoutGrid, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "7,1%", trend: "up" },
          { id: "workflows", value: "14", label: "Workflow mẫu", icon: Workflow, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)" },
          { id: "active", value: "3.940", label: "Người dùng hoạt động", icon: Users, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "5,6%", trend: "up" },
          { id: "projects", value: "28.410", label: "Dự án đã tạo", icon: FolderKanban, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)", delta: "12,3%", trend: "up" },
        ]}
      />

      <DataTable
        title="Công cụ AI"
        headers={["Tên", "Loại", "Nhóm", "Hiển thị", "Trạng thái"]}
        rows={rows}
        totalLabel="công cụ"
        totalOverride={63}
        searchPlaceholder="Tìm công cụ..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "active", label: "Đang bật", tag: "active" },
          { id: "beta", label: "Thử nghiệm", tag: "beta" },
          { id: "off", label: "Đã tắt", tag: "off" },
        ]}
      />
    </div>
  );
}
