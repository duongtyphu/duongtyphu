import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Affiliate Hub — Sản phẩm đề xuất · Admin" };

/**
 * Nối dây lần đầu — bảng `affiliate_products` đã tồn tại sẵn (1 dòng seed
 * thật: Hostinger), đăng ký sẵn trong SUPABASE_COLLECTIONS, chưa từng có
 * Admin UI. Portal đọc tại /portal/affiliate-hub +
 * /portal/affiliate-hub/[slug] (trang chi tiết từng sản phẩm).
 */
type AdminAffiliateProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  audience: string;
  useCase: string;
  workflow: string;
  pros: string[];
  cons: string[];
  pricing: string;
  affiliateUrl: string;
  isAffiliate: boolean;
  badge: string;
  featured: boolean;
  status: string;
};

const columns: ColumnConfig<AdminAffiliateProductRow>[] = [
  { key: "name", label: "Tên sản phẩm" },
  { key: "category", label: "Danh mục" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "name", label: "Tên sản phẩm", type: "text", required: true },
  { key: "slug", label: "Slug (dùng cho URL trang chi tiết)", type: "text", required: true },
  { key: "category", label: "Danh mục", type: "text", required: true, placeholder: "Hosting, AI Tools, Email..." },
  { key: "shortDescription", label: "Mô tả ngắn (hiển thị ở danh sách)", type: "textarea", full: true, required: true },
  { key: "longDescription", label: "Mô tả đầy đủ (trang chi tiết)", type: "textarea", full: true },
  { key: "audience", label: "Phù hợp cho", type: "text", full: true },
  { key: "useCase", label: "Dùng để làm gì", type: "text", full: true },
  { key: "workflow", label: "Quy trình sử dụng", type: "textarea", full: true },
  { key: "pros", label: "Ưu điểm (mỗi dòng 1 mục)", type: "textarea", full: true, transform: "newline-list" },
  { key: "cons", label: "Cần lưu ý (mỗi dòng 1 mục)", type: "textarea", full: true, transform: "newline-list" },
  { key: "pricing", label: "Giá", type: "text" },
  { key: "affiliateUrl", label: "Link Affiliate (có mã ref)", type: "text", full: true, required: true },
  { key: "isAffiliate", label: "Đây là link Affiliate (hiện badge minh bạch)", type: "boolean" },
  { key: "badge", label: "Badge", type: "select", options: ["None", "Recommended", "Best Choice", "New"] },
  { key: "featured", label: "Nổi bật", type: "boolean" },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminAffiliateProductsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="projects-atmosphere-bg">
      <DataTable<AdminAffiliateProductRow>
        collectionKey="affiliate-products"
        title="Affiliate Hub — Sản phẩm đề xuất"
        columns={columns}
        fields={fields}
        itemNoun="Sản phẩm"
        addButtonLabel="+ Thêm sản phẩm"
        breadcrumb={[
          { label: "Học viện" },
          { label: "Dự án & Cơ hội", href: "/admin/duan-cohoi" },
          { label: "Affiliate Hub — Sản phẩm đề xuất" },
        ]}
      />
    </AdminAtmosphere>
  );
}
