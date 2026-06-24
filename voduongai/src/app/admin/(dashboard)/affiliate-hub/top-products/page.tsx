"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { affiliateHubTopProductsSeed, type AffiliateHubTopProduct } from "@/data/admin/affiliateHub";

export default function AffiliateHubTopProductsAdminPage() {
  return (
    <CrudPage<AffiliateHubTopProduct>
      title="Top sản phẩm tháng này"
      description="Chọn sản phẩm Affiliate (theo productId trong Sản phẩm Affiliate) để nổi bật trong Affiliate Hub."
      collectionKey="affiliate-hub-top-products"
      seed={affiliateHubTopProductsSeed}
      searchKeys={["productName", "productId"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Active", "Inactive"] }}
      columns={[
        { key: "order", label: "Thứ tự" },
        { key: "productName", label: "Sản phẩm" },
        { key: "badge", label: "Badge" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "productId", label: "Product ID (Sản phẩm Affiliate)", type: "text", required: true },
        { key: "productName", label: "Tên sản phẩm", type: "text", required: true, full: true },
        { key: "badge", label: "Badge", type: "select", options: ["Recommended", "Best Choice", "New"] },
        { key: "order", label: "Thứ tự", type: "number", required: true },
        { key: "guideHref", label: "Link Xem hướng dẫn", type: "text", required: true },
        { key: "trialHref", label: "Link Dùng thử", type: "text", required: true },
        { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Inactive"] },
      ]}
    />
  );
}
