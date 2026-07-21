import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Dự án & Cơ hội · Admin" };

/**
 * Việc 5 (Nhóm B), phương án (a) đã được Founder chọn — chỉ quản đúng 9
 * field hiện có của bảng `projects` (schema generic id/data/status/order),
 * nối lại đúng nguồn đọc ở /portal/duan-cohoi (trang hub). KHÔNG mở rộng
 * schema cho trang chi tiết `[ecosystemSlug]/[subProjectSlug]` — 2 trang đó
 * vẫn đọc `src/data/portal/ecosystems.ts` tĩnh như trước, ngoài phạm vi
 * việc này (xem CLAUDE.md mục "Dự án & Cơ hội").
 */
type AdminProject = {
  id: string;
  key: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  statusLabel: string;
  expectation: string;
  fitCriteria: string;
  avoidCriteria: string;
  status: string;
};

const ICON_OPTIONS = ["layers", "building-2", "bitcoin", "link-2", "line-chart"];

const columns: ColumnConfig<AdminProject>[] = [
  { key: "name", label: "Tên hệ sinh thái" },
  { key: "statusLabel", label: "Nhãn trạng thái (hiển thị Portal)" },
  { key: "status", label: "Trạng thái xuất bản" },
];

const fields: FieldConfig[] = [
  { key: "key", label: "Key nội bộ (khớp key trong ECOSYSTEM_SURFACE, không đổi trừ khi chắc chắn)", type: "text", required: true },
  { key: "name", label: "Tên hệ sinh thái", type: "text", required: true },
  { key: "description", label: "Mô tả ngắn", type: "textarea", full: true, required: true },
  {
    key: "href",
    label: "Đường dẫn trang chi tiết (phải khớp đúng route tĩnh có sẵn ở /portal/duan-cohoi/[ecosystemSlug])",
    type: "text",
    required: true,
  },
  { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, required: true },
  { key: "statusLabel", label: "Nhãn trạng thái hiển thị (vd. \"Đang theo dõi\")", type: "text", required: true },
  { key: "expectation", label: "Kỳ vọng thực tế (expectedOutcome)", type: "textarea", full: true },
  { key: "fitCriteria", label: "Phù hợp với ai (whoFor)", type: "textarea", full: true },
  { key: "avoidCriteria", label: "Chưa phù hợp với ai (whoNotReady)", type: "textarea", full: true },
  { key: "status", label: "Trạng thái xuất bản", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminProjectsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="projects-atmosphere-bg">
      <DataTable<AdminProject>
        collectionKey="projects"
        title="Dự án & Cơ hội"
        columns={columns}
        fields={fields}
        itemNoun="Hệ sinh thái"
        addButtonLabel="+ Thêm hệ sinh thái"
      />
    </AdminAtmosphere>
  );
}
