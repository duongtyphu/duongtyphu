import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";
import type { AdminResource } from "@/data/admin/resources";

export const metadata = { title: "Resource · Admin" };

const columns: ColumnConfig<AdminResource>[] = [
  { key: "name", label: "Tên" },
  { key: "category", label: "Danh mục" },
  { key: "tier", label: "Gói" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "name", label: "Tên", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true },
  { key: "type", label: "Loại", type: "select", options: ["Tài nguyên"], required: true },
  { key: "category", label: "Danh mục", type: "text" },
  { key: "tier", label: "Gói", type: "select", options: ["Free", "Premium"], required: true },
  { key: "description", label: "Mô tả", type: "textarea", full: true },
  { key: "fileUrl", label: "Link file", type: "text" },
  { key: "downloadLink", label: "Link tải khác (nếu có)", type: "text" },
  { key: "thumbnail", label: "Ảnh thumbnail", type: "text" },
  { key: "tags", label: "Tags", type: "tags" },
  { key: "requiresSignup", label: "Yêu cầu đăng ký", type: "boolean" },
  { key: "featured", label: "Nổi bật", type: "boolean" },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCkosResourcesPage() {
  return (
    <AdminAtmosphere atmosphereClassName="ckos-atmosphere-bg">
      <DataTable<AdminResource> collectionKey="resources" title="Resource" columns={columns} fields={fields} />
    </AdminAtmosphere>
  );
}
