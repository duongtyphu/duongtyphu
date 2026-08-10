import { BookOpen, Database, FolderTree, Loader } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { formatDate } from "@/lib/v2/data/client";
import { listKnowledge } from "@/lib/v2/data/catalog";

export const metadata = { title: "Hệ tri thức — Admin" };

export default async function AdminHeTriThucPage() {
  const entries = await listKnowledge();

  const rows: TableRow[] = entries.map((entry) => ({
    id: entry.id,
    tags: [entry.isPremium ? "premium" : "free"],
    cells: [
      { t: "strong", v: entry.title },
      {
        t: "tag",
        label: entry.category,
        background: "var(--v2-violet-light)",
        color: "var(--v2-violet)",
      },
      {
        t: "tag",
        label: entry.isPremium ? "Premium" : "Miễn phí",
        background: entry.isPremium ? "#fdf1e0" : "var(--v2-bg)",
        color: entry.isPremium ? "#a9822c" : "var(--v2-muted)",
      },
      { t: "status", label: "Đã xử lý embedding", color: "var(--v2-green)" },
      { t: "muted", v: formatDate(entry.updatedAt) },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Nội dung Portal › Hệ tri thức (CKOS)"
        title="Quản lý Hệ tri thức"
        description="Quản lý tài liệu, chủ đề và kho tri thức chuẩn hoá cung cấp cho Companion & Portal."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "docs", value: "1.842", label: "Tổng tài liệu", icon: BookOpen, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "6,2%", trend: "up" },
          { id: "topics", value: "36", label: "Chủ đề / Danh mục", icon: FolderTree, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)" },
          { id: "embedded", value: "1.790", label: "Đã xử lý embedding", icon: Database, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "8,4%", trend: "up" },
          { id: "queue", value: "52", label: "Đang xử lý / hàng chờ", icon: Loader, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
        ]}
      />

      <DataTable
        title="Tài liệu trong kho tri thức"
        headers={["Tài liệu", "Danh mục", "Quyền truy cập", "Trạng thái", "Cập nhật"]}
        rows={rows}
        totalLabel="tài liệu"
        totalOverride={1842}
        searchPlaceholder="Tìm tài liệu..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "premium", label: "Premium", tag: "premium" },
          { id: "free", label: "Miễn phí", tag: "free" },
        ]}
      />
    </div>
  );
}
