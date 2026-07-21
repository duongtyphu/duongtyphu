import { DataTable } from "@/components/admin/DataTable";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";
import type { AdminTool } from "@/data/admin/tools";

export const metadata = { title: "Công cụ AI · Admin" };

const TOOL_CATEGORIES = [
  "AI Chat",
  "AI Hình ảnh",
  "AI Video",
  "AI Lập trình",
  "AI Tự động hóa",
  "AI Marketing",
  "AI Phân tích",
  "AI Dịch thuật",
];

const columns: ColumnConfig<AdminTool>[] = [
  { key: "name", label: "Tên" },
  { key: "category", label: "Danh mục" },
  { key: "pricing", label: "Giá" },
  {
    key: "tagline",
    label: "Nội dung chi tiết",
    requiredForComplete: ["tagline", "companionSummary", "bestFor", "notGoodFor"],
  },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "name", label: "Tên", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true },
  { key: "category", label: "Danh mục", type: "select", options: TOOL_CATEGORIES },
  { key: "tagline", label: "Tagline (1 câu mô tả ngắn)", type: "text" },
  { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", full: true },
  { key: "companionSummary", label: "Tóm tắt từ Companion", type: "textarea", full: true },
  { key: "pricing", label: "Giá", type: "text" },
  { key: "pricingNote", label: "Ghi chú giá", type: "text" },
  { key: "link", label: "Link", type: "text" },
  {
    key: "bestFor",
    label: "Phù hợp cho (mỗi dòng 1 mục)",
    type: "textarea",
    full: true,
    transform: "newline-list",
  },
  {
    key: "notGoodFor",
    label: "Không phù hợp cho (mỗi dòng 1 mục)",
    type: "textarea",
    full: true,
    transform: "newline-list",
  },
  {
    key: "relatedArticleSlugs",
    label: "Slug bài viết liên quan (mỗi dòng 1 slug)",
    type: "textarea",
    full: true,
    transform: "newline-list",
  },
  {
    key: "relatedNeedSlugs",
    label: "Slug nhu cầu liên quan (mỗi dòng 1 slug)",
    type: "textarea",
    full: true,
    transform: "newline-list",
  },
  { key: "badge", label: "Badge", type: "select", options: ["Recommended", "Tôi đang dùng", "Affiliate"] },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminToolsPage() {
  return <DataTable<AdminTool> collectionKey="tools" title="Công cụ AI" columns={columns} fields={fields} />;
}
