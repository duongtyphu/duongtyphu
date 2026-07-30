import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Affiliate Hub — Nổi bật tháng này · Admin" };

/**
 * Nối dây lần đầu — bảng `affiliate_hub_top_products` (1 dòng seed thật),
 * dùng vocabulary trạng thái riêng "Active"/"Inactive" (giữ nguyên, cùng
 * kiểu bảng `community` đã có từ trước) thay vì Draft/Published/Hidden.
 * Mỗi dòng CHỈ tham chiếu `productId` sang bảng "Affiliate Hub — Sản phẩm
 * đề xuất" (nhập đúng id, không multi-select vì đây tham chiếu 1-1) —
 * KHÔNG copy nội dung sản phẩm sang đây.
 */
type AdminAffiliateHubTopProductRow = {
  id: string;
  productId: string;
  productName: string;
  badge: string;
  order: number;
  guideHref: string;
  trialHref: string;
  status: string;
};

const columns: ColumnConfig<AdminAffiliateHubTopProductRow>[] = [
  { key: "productName", label: "Sản phẩm" },
  { key: "badge", label: "Badge" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  {
    key: "productId",
    label: "ID sản phẩm (nhập đúng id ở \"Affiliate Hub — Sản phẩm đề xuất\", vd. affp_1)",
    type: "text",
    required: true,
  },
  { key: "productName", label: "Tên sản phẩm (hiển thị)", type: "text", required: true },
  { key: "badge", label: "Badge", type: "select", options: ["Recommended", "Best Choice", "New"], required: true },
  { key: "order", label: "Thứ tự hiển thị (số)", type: "number", required: true },
  { key: "guideHref", label: "Link xem hướng dẫn (nội bộ)", type: "text", required: true, placeholder: "/portal/affiliate-hub/hostinger" },
  { key: "trialHref", label: "Link dùng thử (ngoài)", type: "text", required: true, placeholder: "https://..." },
  { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Inactive"], required: true },
];

export default function AdminAffiliateHubTopProductsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="projects-atmosphere-bg">
      <DataTable<AdminAffiliateHubTopProductRow>
        collectionKey="affiliate-hub-top-products"
        title="Affiliate Hub — Nổi bật tháng này"
        columns={columns}
        fields={fields}
        itemNoun="Mục nổi bật"
        addButtonLabel="+ Thêm mục nổi bật"
        breadcrumb={[
          { label: "Học viện" },
          { label: "Dự án & Cơ hội", href: "/admin/duan-cohoi" },
          { label: "Affiliate Hub — Nổi bật tháng này" },
        ]}
      />
    </AdminAtmosphere>
  );
}
