"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";
import { Badge } from "@/components/admin/ui/Badge";

export default function ToolsAdminPage() {
  return (
    <KnowledgeCrudPage
      title="Tools"
      description="Quản lý công cụ AI & phần mềm — module quan trọng cho doanh thu Affiliate. Canonical CKOS module (ADM-SPR-004): Title/Summary/Body map vào name/shortDescription/longDescription để Portal tiếp tục hoạt động bình thường."
      collectionKey="tools"
      titleKey="name"
      summaryKey="shortDescription"
      bodyKey="longDescription"
      categoryOptions={["AI", "Thiết kế", "Video", "Năng suất", "Tự động hoá", "Lưu trữ web"]}
      viewHref={(it) => `/portal/tools/${it.slug}`}
      extraColumns={[
        { key: "pricing", label: "Giá" },
        { key: "rating", label: "Rating" },
        { key: "order", label: "Thứ tự" },
        {
          key: "featured",
          label: "Nổi bật",
          render: (it) => (it.featured ? <Badge tone="orange">Featured</Badge> : <span className="text-white/30">—</span>),
        },
      ]}
      extraFields={[
        { key: "logo", label: "Logo/icon id", type: "text" },
        { key: "useCase", label: "Tôi dùng để làm gì", type: "textarea", full: true },
        { key: "audience", label: "Phù hợp với ai", type: "text", full: true },
        { key: "pros", label: "Ưu điểm", type: "tags", full: true },
        { key: "cons", label: "Nhược điểm", type: "tags", full: true },
        { key: "pricing", label: "Giá", type: "text" },
        { key: "link", label: "Link truy cập", type: "text" },
        { key: "affiliateUrl", label: "Affiliate URL", type: "text" },
        { key: "videoUrl", label: "Video hướng dẫn", type: "text" },
        { key: "workflow", label: "Workflow thực tế", type: "textarea", full: true },
        { key: "relatedPromptId", label: "Prompt liên quan (id) — xem thêm mục Relationship", type: "text" },
        { key: "relatedResourceHref", label: "Tài nguyên liên quan", type: "text" },
        { key: "ctaText", label: "CTA text", type: "text", required: true },
        { key: "ctaLink", label: "CTA link", type: "text", required: true },
        { key: "badge", label: "Badge", type: "select", options: ["Recommended", "Tôi đang dùng", "Affiliate"] },
        { key: "rating", label: "Rating", type: "number" },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "tier", label: "Free / Paid", type: "select", options: ["Free", "Paid"] },
        { key: "order", label: "Thứ tự hiển thị", type: "number", required: true },
        { key: "companionSummary", label: "Mô tả cho Companion (summaryForCompanion)", type: "textarea", full: true },
      ]}
    />
  );
}
