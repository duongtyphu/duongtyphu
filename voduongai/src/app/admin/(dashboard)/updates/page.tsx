import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Tin tức cộng đồng · Admin" };

/**
 * Việc 8 (Phần 2) — quản bảng `updates` (5 tin), nuôi khối "Community News"
 * ở /portal/congdongai (xem `src/lib/portal/live-updates.ts`, chỉ hiện dòng
 * `status="Published"`). Thay hẳn mảng tĩnh `NEWS` (Phần 1).
 */
type AdminUpdate = {
  id: string;
  title: string;
  slug: string;
  type: string;
  author: string;
  publishedAt: string;
  shortContent: string;
  content: string;
  featured: boolean;
  status: string;
};

const columns: ColumnConfig<AdminUpdate>[] = [
  { key: "title", label: "Tiêu đề" },
  { key: "type", label: "Loại" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", full: true, required: true },
  { key: "slug", label: "Slug", type: "text", required: true },
  { key: "type", label: "Loại (vd. \"Prompt mới\", \"Công cụ mới\")", type: "text", required: true },
  { key: "author", label: "Tác giả", type: "text", required: true },
  { key: "publishedAt", label: "Ngày đăng", type: "date", required: true },
  { key: "shortContent", label: "Nội dung ngắn (hiển thị ở danh sách)", type: "textarea", full: true, required: true },
  { key: "content", label: "Nội dung đầy đủ", type: "textarea", full: true },
  { key: "featured", label: "Nổi bật", type: "boolean" },
  { key: "status", label: "Trạng thái xuất bản", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminUpdatesPage() {
  return (
    <AdminAtmosphere atmosphereClassName="campus-bg">
      <DataTable<AdminUpdate>
        collectionKey="updates"
        title="Tin tức cộng đồng"
        columns={columns}
        fields={fields}
        itemNoun="Tin"
        addButtonLabel="+ Thêm tin"
      />
    </AdminAtmosphere>
  );
}
