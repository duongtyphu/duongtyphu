"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { Badge } from "@/components/admin/ui/Badge";

export default function ToolsAdminPage() {
  return (
    <CrudPage<AdminTool>
      title="Tool Library"
      description="Quản lý công cụ AI & phần mềm — module quan trọng cho doanh thu Affiliate."
      collectionKey="tools"
      seed={toolsAdminSeed}
      searchKeys={["name", "category"]}
      filterOptions={{ key: "category", label: "Danh mục", options: ["AI", "Thiết kế", "Video", "Năng suất", "Tự động hoá", "Lưu trữ web"] }}
      columns={[
        { key: "name", label: "Tên công cụ" },
        { key: "category", label: "Danh mục" },
        { key: "badge", label: "Badge" },
        { key: "pricing", label: "Giá" },
        { key: "rating", label: "Rating" },
        {
          key: "featured",
          label: "Nổi bật",
          render: (it) => (it.featured ? <Badge tone="orange">Featured</Badge> : <span className="text-white/30">—</span>),
        },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "name", label: "Tên công cụ", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "logo", label: "Logo/icon id", type: "text" },
        { key: "category", label: "Danh mục", type: "select", options: ["AI", "Thiết kế", "Video", "Năng suất", "Tự động hoá", "Lưu trữ web"] },
        { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", full: true },
        { key: "longDescription", label: "Mô tả chi tiết", type: "textarea", full: true },
        { key: "useCase", label: "Tôi dùng để làm gì", type: "textarea", full: true },
        { key: "audience", label: "Phù hợp với ai", type: "text", full: true },
        { key: "pros", label: "Ưu điểm", type: "tags", full: true },
        { key: "cons", label: "Nhược điểm", type: "tags", full: true },
        { key: "pricing", label: "Giá", type: "text" },
        { key: "link", label: "Link truy cập", type: "text" },
        { key: "affiliateUrl", label: "Affiliate URL", type: "text" },
        { key: "videoUrl", label: "Video hướng dẫn", type: "text" },
        { key: "workflow", label: "Workflow thực tế", type: "textarea", full: true },
        { key: "relatedPromptId", label: "Prompt liên quan (id)", type: "text" },
        { key: "relatedResourceHref", label: "Tài nguyên liên quan", type: "text" },
        { key: "ctaText", label: "CTA text", type: "text", required: true },
        { key: "ctaLink", label: "CTA link", type: "text", required: true },
        { key: "badge", label: "Badge", type: "select", options: ["Recommended", "Tôi đang dùng", "Affiliate"] },
        { key: "rating", label: "Rating", type: "number" },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "tier", label: "Free / Paid", type: "select", options: ["Free", "Paid"] },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
