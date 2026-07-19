import { DataTable } from "@/components/admin/DataTable";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";
import type { AdminTool } from "@/data/admin/tools";

export const metadata = { title: "Công cụ AI · Admin" };

const columns: ColumnConfig<AdminTool>[] = [
  { key: "name", label: "Tên" },
  { key: "category", label: "Danh mục" },
  { key: "pricing", label: "Giá" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "name", label: "Tên", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true },
  { key: "category", label: "Danh mục", type: "text" },
  { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", full: true },
  { key: "pricing", label: "Giá", type: "text" },
  { key: "link", label: "Link", type: "text" },
  { key: "badge", label: "Badge", type: "select", options: ["Recommended", "Tôi đang dùng", "Affiliate"] },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminToolsPage() {
  return <DataTable<AdminTool> collectionKey="tools" title="Công cụ AI" columns={columns} fields={fields} />;
}
