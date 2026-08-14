import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Thư viện AI (Folder) · Admin" };

// Phase 28 (Schema v2, Bước 1): `name` đã đổi tên thành `title` trong `data`
// jsonb, và bổ sung `slug` + `relatedCollections`. Đổi tên (không nhân bản
// thêm key `title` bên cạnh `name`) để tránh 2 nguồn sự thật cho cùng 1 giá
// trị — xem supabase-phase28-schema-v2-step1-alter.sql.
type AdminKnowledgeCollection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  seedSlugs: string[];
  relatedCollections: string[];
  status: string;
};

// LƯU Ý: page.tsx này là Server Component (không "use client") — columns
// truyền xuống DataTable → DataTableClient ("use client"), nên TUYỆT ĐỐI
// không được gán function vào ColumnConfig.render ở đây (function không
// serialize được qua ranh giới Server→Client, đúng lỗi đã gặp và sửa ở
// /admin/ckos/sop trước đó). Cột "seedSlugs" hiển thị mặc định (join dấu
// phẩy) thay vì đếm số lượng qua render function.
const columns: ColumnConfig<AdminKnowledgeCollection>[] = [
  { key: "title", label: "Tên bộ sưu tập" },
  { key: "seedSlugs", label: "Lesson thuộc bộ sưu tập" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "title", label: "Tên bộ sưu tập", type: "text", required: true },
  {
    key: "slug",
    label: "Slug (đường dẫn /portal/hetrithucai/collection/…)",
    type: "text",
    required: true,
  },
  { key: "description", label: "Mô tả ngắn", type: "textarea", full: true },
  {
    key: "seedSlugs",
    label: "Lesson thuộc bộ sưu tập này (chọn từ danh sách thật)",
    type: "multi-select",
    optionsSource: "knowledge-seeds",
    full: true,
  },
  {
    key: "relatedCollections",
    label: "Bộ sưu tập liên quan (nhập slug, mỗi slug 1 dòng)",
    type: "textarea",
    transform: "newline-list",
    full: true,
  },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCkosKnowledgeCollectionsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="ckos-atmosphere-bg">
      <DataTable<AdminKnowledgeCollection>
        collectionKey="knowledge-collections"
        title="Thư viện AI (Folder)"
        columns={columns}
        fields={fields}
        itemNoun="Knowledge Card"
        addButtonLabel="+ Thêm Card"
        panelLabel="Nội dung tri thức"
        breadcrumb={[
          { label: "Học viện" },
          { label: "Hệ tri thức AI (CKOS)", href: "/admin/ckos" },
          { label: "Thư viện AI (Folder)" },
        ]}
      />
    </AdminAtmosphere>
  );
}
