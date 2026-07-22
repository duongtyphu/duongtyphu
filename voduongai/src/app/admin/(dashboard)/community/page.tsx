import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Kênh cộng đồng · Admin" };

/**
 * Việc 8 (Phần 2) — quản bảng `community` (5 kênh: Facebook/YouTube/TikTok/
 * Zalo/Telegram), nuôi khối "Kết nối ngay hôm nay" ở /portal/congdongai
 * (xem `src/lib/portal/live-community.ts`, chỉ hiện dòng `status="Active"`).
 *
 * LƯU Ý SCHEMA: bảng này dùng vocabulary trạng thái riêng "Active"/
 * "Inactive" — KHÔNG phải "Draft"/"Published"/"Hidden" như mọi collection
 * generic khác, đã có sẵn từ đợt seed trước, giữ nguyên không đổi.
 */
type AdminCommunityChannel = {
  id: string;
  platform: string;
  label: string;
  url: string;
  status: string;
};

const columns: ColumnConfig<AdminCommunityChannel>[] = [
  { key: "platform", label: "Nền tảng" },
  { key: "label", label: "Tên hiển thị" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "platform", label: "Nền tảng (Facebook/YouTube/TikTok/Zalo/Telegram...)", type: "text", required: true },
  { key: "label", label: "Tên hiển thị (vd. \"Facebook Group\")", type: "text", required: true },
  { key: "url", label: "Đường dẫn kênh", type: "text", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Inactive"], required: true },
];

export default function AdminCommunityPage() {
  return (
    <AdminAtmosphere atmosphereClassName="campus-bg">
      <DataTable<AdminCommunityChannel>
        collectionKey="community"
        title="Kênh cộng đồng"
        columns={columns}
        fields={fields}
        itemNoun="Kênh"
        addButtonLabel="+ Thêm kênh"
      />
    </AdminAtmosphere>
  );
}
