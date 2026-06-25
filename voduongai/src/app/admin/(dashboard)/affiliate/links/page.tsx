"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { affiliateLinksSeed, type AdminAffiliateLink } from "@/data/admin/affiliate";

export default function AffiliateLinksPage() {
  return (
    <CrudPage<AdminAffiliateLink>
      title="Link Affiliate"
      description="Quản lý link tracking và campaign Affiliate."
      collectionKey="affiliate-links"
      seed={affiliateLinksSeed}
      searchKeys={["name", "campaign"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Active", "Inactive"] }}
      columns={[
        { key: "name", label: "Tên link" },
        { key: "campaign", label: "Campaign" },
        { key: "clicks", label: "Click (mock)" },
        { key: "conversions", label: "Conversion (mock)" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "name", label: "Tên link", type: "text", required: true },
        { key: "originalUrl", label: "URL gốc", type: "text", required: true },
        { key: "affiliateUrl", label: "Affiliate URL", type: "text", required: true },
        { key: "shortLabel", label: "Short label", type: "text" },
        { key: "campaign", label: "Campaign", type: "text" },
        { key: "trackingCode", label: "Tracking code", type: "text" },
        { key: "isAffiliate", label: "Là liên kết Affiliate", type: "boolean" },
        { key: "clicks", label: "Click count (mock)", type: "number" },
        { key: "conversions", label: "Conversion (mock)", type: "number" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Inactive"] },
      ]}
    />
  );
}
