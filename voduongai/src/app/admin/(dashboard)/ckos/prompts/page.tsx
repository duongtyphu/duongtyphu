import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";
import type { AdminPrompt } from "@/data/admin/prompts";

export const metadata = { title: "Prompt (Folder) · Admin" };

const columns: ColumnConfig<AdminPrompt>[] = [
  { key: "title", label: "Tiêu đề" },
  { key: "category", label: "Danh mục" },
  { key: "level", label: "Cấp độ" },
  { key: "tier", label: "Gói" },
  { key: "status", label: "Trạng thái" },
];

// copyCount không đưa vào form — là số liệu đếm lượt copy thật do Portal
// ghi nhận, không phải nội dung admin biên tập.
const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true },
  { key: "category", label: "Danh mục", type: "text" },
  { key: "level", label: "Cấp độ", type: "select", options: ["Cơ bản", "Trung cấp", "Nâng cao"], required: true },
  { key: "tier", label: "Gói", type: "select", options: ["Free", "Premium"], required: true },
  { key: "description", label: "Mô tả", type: "textarea", full: true },
  { key: "content", label: "Nội dung Prompt", type: "textarea", full: true },
  { key: "exampleOutput", label: "Ví dụ kết quả", type: "textarea", full: true },
  { key: "tags", label: "Tags", type: "tags" },
  { key: "featured", label: "Nổi bật", type: "boolean" },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCkosPromptsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="ckos-atmosphere-bg">
      <DataTable<AdminPrompt>
        collectionKey="prompts"
        title="Prompt (Folder)"
        columns={columns}
        fields={fields}
        itemNoun="Knowledge Card"
        addButtonLabel="+ Thêm Card"
        panelLabel="Nội dung tri thức"
        breadcrumb={[
          { label: "Học viện" },
          { label: "Hệ tri thức AI (CKOS)", href: "/admin/ckos" },
          { label: "Prompt (Folder)" },
        ]}
      />
    </AdminAtmosphere>
  );
}
