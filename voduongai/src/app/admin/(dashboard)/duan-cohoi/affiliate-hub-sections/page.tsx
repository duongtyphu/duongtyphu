import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Affiliate Hub — Nội dung hướng dẫn · Admin" };

/**
 * Nối dây lần đầu — bảng `affiliate_hub_sections` đã tồn tại sẵn (7 dòng
 * seed thật: Bắt đầu/Chọn ngách/Chọn sản phẩm/Xây nội dung/Công cụ/Case
 * Study/Top sản phẩm), đăng ký sẵn trong SUPABASE_COLLECTIONS, nhưng chưa
 * từng có Admin UI nào quản trước đợt này. Portal đọc tại
 * /portal/affiliate-hub (src/lib/portal/live-affiliate-hub.ts).
 */
type AdminAffiliateHubSection = {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  relatedResource: string;
  relatedPrompt: string;
  relatedTool: string;
  relatedAffiliateProduct: string;
  ctaText: string;
  ctaHref: string;
  order: number;
  status: string;
};

const columns: ColumnConfig<AdminAffiliateHubSection>[] = [
  { key: "title", label: "Tiêu đề" },
  { key: "order", label: "Thứ tự" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "key", label: "Key nội bộ (không hiển thị)", type: "text", required: true },
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "description", label: "Mô tả", type: "textarea", full: true, required: true },
  { key: "icon", label: "Icon (1 emoji)", type: "text", required: true, placeholder: "🚀" },
  { key: "ctaText", label: "Nhãn nút CTA", type: "text", required: true },
  { key: "ctaHref", label: "Đường dẫn CTA", type: "text", required: true, placeholder: "/portal/..." },
  { key: "relatedResource", label: "Tài nguyên liên quan (tuỳ chọn, đường dẫn)", type: "text" },
  { key: "relatedPrompt", label: "Prompt liên quan (tuỳ chọn, id)", type: "text" },
  { key: "relatedTool", label: "Công cụ liên quan (tuỳ chọn, id/slug)", type: "text" },
  { key: "relatedAffiliateProduct", label: "Sản phẩm Affiliate liên quan (tuỳ chọn, id)", type: "text" },
  { key: "order", label: "Thứ tự hiển thị (số)", type: "number", required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminAffiliateHubSectionsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="projects-atmosphere-bg">
      <DataTable<AdminAffiliateHubSection>
        collectionKey="affiliate-hub-sections"
        title="Affiliate Hub — Nội dung hướng dẫn"
        columns={columns}
        fields={fields}
        itemNoun="Mục hướng dẫn"
        addButtonLabel="+ Thêm mục"
        breadcrumb={[
          { label: "Học viện" },
          { label: "Dự án & Cơ hội", href: "/admin/duan-cohoi" },
          { label: "Affiliate Hub — Nội dung hướng dẫn" },
        ]}
      />
    </AdminAtmosphere>
  );
}
