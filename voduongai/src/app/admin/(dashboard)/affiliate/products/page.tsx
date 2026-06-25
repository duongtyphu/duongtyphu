"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { affiliateProductsSeed, type AdminAffiliateProduct } from "@/data/admin/affiliate";
import { Badge } from "@/components/admin/ui/Badge";

export default function AffiliateProductsPage() {
  return (
    <CrudPage<AdminAffiliateProduct>
      title="Sản phẩm Affiliate"
      description="Quản lý sản phẩm/dịch vụ Affiliate đề xuất trong Affiliate Hub."
      collectionKey="affiliate-products"
      seed={affiliateProductsSeed}
      searchKeys={["name", "category"]}
      filterOptions={{ key: "badge", label: "Badge", options: ["Recommended", "Best Choice", "New", "None"] }}
      columns={[
        { key: "name", label: "Tên sản phẩm" },
        { key: "category", label: "Danh mục" },
        {
          key: "badge",
          label: "Badge",
          render: (it) => (it.badge !== "None" ? <Badge tone="orange">{it.badge}</Badge> : <span className="text-white/30">—</span>),
        },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "name", label: "Tên sản phẩm", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "logo", label: "Logo", type: "text" },
        { key: "category", label: "Danh mục", type: "text" },
        { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", full: true },
        { key: "longDescription", label: "Mô tả chi tiết", type: "textarea", full: true },
        { key: "audience", label: "Phù hợp với ai", type: "text", full: true },
        { key: "useCase", label: "Use case", type: "textarea", full: true },
        { key: "workflow", label: "Workflow thực tế", type: "textarea", full: true },
        { key: "pros", label: "Ưu điểm", type: "tags" },
        { key: "cons", label: "Nhược điểm", type: "tags" },
        { key: "pricing", label: "Giá", type: "text" },
        { key: "affiliateUrl", label: "Affiliate URL", type: "text", required: true },
        { key: "trackingCode", label: "Tracking code", type: "text" },
        { key: "isAffiliate", label: "Là liên kết Affiliate", type: "boolean" },
        { key: "videoUrl", label: "Video review", type: "text" },
        { key: "badge", label: "Badge", type: "select", options: ["Recommended", "Best Choice", "New", "None"] },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
