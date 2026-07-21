import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Thư viện AI (Folder) · Admin" };

type AdminKnowledgeCollection = {
  id: string;
  name: string;
  description: string;
  seedSlugs: string[];
  status: string;
};

// LƯU Ý: page.tsx này là Server Component (không "use client") — columns
// truyền xuống DataTable → DataTableClient ("use client"), nên TUYỆT ĐỐI
// không được gán function vào ColumnConfig.render ở đây (function không
// serialize được qua ranh giới Server→Client, đúng lỗi đã gặp và sửa ở
// /admin/ckos/sop trước đó). Cột "seedSlugs" hiển thị mặc định (join dấu
// phẩy) thay vì đếm số lượng qua render function.
const columns: ColumnConfig<AdminKnowledgeCollection>[] = [
  { key: "name", label: "Tên bộ sưu tập" },
  { key: "seedSlugs", label: "Lesson thuộc bộ sưu tập" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "name", label: "Tên bộ sưu tập", type: "text", required: true },
  { key: "description", label: "Mô tả ngắn", type: "textarea", full: true },
  {
    key: "seedSlugs",
    label: "Lesson thuộc bộ sưu tập này (chọn từ danh sách thật)",
    type: "multi-select",
    optionsSource: "knowledge-seeds",
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
      />
    </AdminAtmosphere>
  );
}
