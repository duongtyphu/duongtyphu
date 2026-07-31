import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Thực hành tốt (Folder) · Admin" };

type AdminBestPractice = {
  id: string;
  title: string;
  description: string;
  principle: string;
  legacySourceId: string;
  relatedToolSlugs: string[];
  relatedCaseStudyIds: string[];
  status: string;
};

// LƯU Ý: page.tsx này là Server Component (không "use client") — columns
// truyền xuống DataTable → DataTableClient ("use client"), nên TUYỆT ĐỐI
// không được gán function vào ColumnConfig.render ở đây (đúng lỗi đã gặp và
// sửa ở /admin/ckos/sop trước đó).
const columns: ColumnConfig<AdminBestPractice>[] = [
  { key: "title", label: "Tiêu đề" },
  { key: "description", label: "Mô tả ngắn" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
  { key: "description", label: "Mô tả ngắn", type: "textarea", full: true },
  { key: "principle", label: "Nguyên tắc / bài học rút ra", type: "textarea", full: true },
  { key: "legacySourceId", label: "Nguồn gốc (legacy source id, tham khảo)", type: "text" },
  {
    key: "relatedToolSlugs",
    label: "Công cụ AI liên quan",
    type: "multi-select",
    optionsSource: "tools",
    full: true,
  },
  {
    key: "relatedCaseStudyIds",
    label: "Case Study liên quan",
    type: "multi-select",
    optionsSource: "case-studies",
    full: true,
  },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCkosBestPracticesPage() {
  return (
    <AdminAtmosphere atmosphereClassName="ckos-atmosphere-bg">
      <DataTable<AdminBestPractice>
        collectionKey="best-practices"
        title="Thực hành tốt (Folder)"
        columns={columns}
        fields={fields}
        itemNoun="Knowledge Card"
        addButtonLabel="+ Thêm Card"
        panelLabel="Nội dung tri thức"
        breadcrumb={[
          { label: "Học viện" },
          { label: "Hệ tri thức AI (CKOS)", href: "/admin/ckos" },
          { label: "Thực hành tốt (Folder)" },
        ]}
      />
    </AdminAtmosphere>
  );
}
