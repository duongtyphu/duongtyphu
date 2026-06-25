"use client";

import Link from "next/link";
import { CrudPage } from "@/components/admin/CrudPage";
import { affiliateHubSeed, type AffiliateHubSection } from "@/data/admin/affiliateHub";

export default function AffiliateHubAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Quản lý 7 section của Affiliate Hub trên Portal.
        </p>
        <Link
          href="/admin/affiliate-hub/top-products"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          Quản lý Top sản phẩm tháng này →
        </Link>
      </div>
      <CrudPage<AffiliateHubSection>
        title="Affiliate Hub"
        description="Quản lý nội dung từng section của Affiliate Hub."
        collectionKey="affiliate-hub-sections"
        seed={affiliateHubSeed}
        searchKeys={["title", "description"]}
        filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
        columns={[
          { key: "order", label: "Thứ tự" },
          { key: "title", label: "Tiêu đề" },
          { key: "key", label: "Key" },
          { key: "status", label: "Trạng thái" },
        ]}
        fields={[
          { key: "key", label: "Key", type: "text", required: true },
          { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
          { key: "description", label: "Mô tả", type: "textarea", required: true, full: true },
          { key: "icon", label: "Icon", type: "text", placeholder: "🚀" },
          { key: "relatedResource", label: "Tài nguyên liên quan", type: "text" },
          { key: "relatedPrompt", label: "Prompt liên quan (id)", type: "text" },
          { key: "relatedTool", label: "Công cụ liên quan (id)", type: "text" },
          { key: "relatedAffiliateProduct", label: "Sản phẩm Affiliate liên quan (id)", type: "text" },
          { key: "ctaText", label: "CTA text", type: "text", required: true },
          { key: "ctaHref", label: "CTA link", type: "text", required: true },
          { key: "order", label: "Thứ tự", type: "number", required: true },
          { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
        ]}
      />
    </div>
  );
}
