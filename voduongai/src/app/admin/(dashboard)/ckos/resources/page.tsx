import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";
import type { AdminResource } from "@/data/admin/resources";

export const metadata = { title: "Resource (Folder) · Admin" };

const columns: ColumnConfig<AdminResource>[] = [
  { key: "name", label: "Tên" },
  { key: "category", label: "Danh mục" },
  { key: "tier", label: "Gói" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "name", label: "Tên", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true },
  {
    key: "type",
    label: "Loại",
    type: "select",
    options: ["Ebook", "Danh sách kiểm tra", "Mẫu", "Bộ Prompt", "Lộ trình", "Mẫu tham khảo"],
    required: true,
  },
  { key: "category", label: "Danh mục", type: "text" },
  { key: "tier", label: "Gói", type: "select", options: ["Free", "Premium"], required: true },
  { key: "description", label: "Mô tả", type: "textarea", full: true },
  { key: "whenToUse", label: "Khi nào nên dùng", type: "textarea", full: true },
  { key: "whenNotToUse", label: "Khi nào KHÔNG nên dùng", type: "textarea", full: true },
  { key: "relatedProjectHref", label: "Link Dự án & Cơ hội liên quan (nếu có)", type: "text" },
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
      <DataTable<AdminResource>
        collectionKey="resources"
        title="Resource (Folder)"
        columns={columns}
        fields={fields}
        itemNoun="Knowledge Card"
        addButtonLabel="+ Thêm Card"
        panelLabel="Nội dung tri thức"
        breadcrumb={[
          { label: "Học viện" },
          { label: "Hệ tri thức AI (CKOS)", href: "/admin/ckos" },
          { label: "Resource (Folder)" },
        ]}
      />
    </AdminAtmosphere>
  );
}
