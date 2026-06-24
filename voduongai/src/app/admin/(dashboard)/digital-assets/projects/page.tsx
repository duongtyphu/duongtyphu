"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { digitalAssetProjects, digitalAssetCategories, type DigitalAssetProject } from "@/data/digitalAssets";

const CATEGORY_OPTIONS = digitalAssetCategories.map((c) => c.key);
const BADGE_OPTIONS = ["Đang theo dõi", "Đang tham gia", "Đề xuất", "Mới"];

export default function DigitalAssetProjectsAdminPage() {
  return (
    <CrudPage<DigitalAssetProject>
      title="Dự án Tài sản số"
      description="Quản lý các dự án/sản phẩm hiển thị trong mục Tài sản số trên Portal."
      collectionKey="digital-asset-projects"
      seed={digitalAssetProjects}
      searchKeys={["name", "slug"]}
      filterOptions={{ key: "category", label: "Danh mục", options: CATEGORY_OPTIONS }}
      columns={[
        {
          key: "name",
          label: "Dự án",
          render: (p) => (
            <span className="flex items-center gap-2">
              <span>{p.logo}</span>
              <span className="font-semibold text-white">{p.name}</span>
            </span>
          ),
        },
        {
          key: "category",
          label: "Danh mục",
          render: (p) => digitalAssetCategories.find((c) => c.key === p.category)?.name ?? p.category,
        },
        { key: "badge", label: "Badge" },
        { key: "status", label: "Trạng thái" },
        { key: "featured", label: "Nổi bật", render: (p) => (p.featured ? "✅" : "—") },
        { key: "priority", label: "Độ ưu tiên" },
      ]}
      fields={[
        { key: "name", label: "Tên dự án", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "logo", label: "Logo (emoji)", type: "text", placeholder: "🌐" },
        { key: "image", label: "Ảnh đại diện (URL)", type: "text" },
        { key: "category", label: "Danh mục", type: "select", options: CATEGORY_OPTIONS, required: true },
        { key: "badge", label: "Badge", type: "select", options: BADGE_OPTIONS },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
        { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", required: true, full: true },
        { key: "content", label: "Nội dung chi tiết", type: "textarea", full: true },
        { key: "whatIsIt", label: "Dự án là gì?", type: "textarea", full: true },
        { key: "problemSolved", label: "Dự án giải quyết vấn đề gì?", type: "textarea", full: true },
        { key: "whyInterested", label: "Vì sao tôi quan tâm?", type: "textarea", full: true },
        { key: "whoForIt", label: "Phù hợp với ai?", type: "textarea", full: true },
        { key: "notes", label: "Những điểm cần lưu ý", type: "textarea", full: true },
        { key: "disclaimer", label: "Disclaimer riêng (tuỳ chọn)", type: "textarea", full: true },
        { key: "relatedResources", label: "Tài nguyên liên quan", type: "tags", full: true },
        { key: "featured", label: "Nổi bật", type: "boolean" },
        { key: "priority", label: "Độ ưu tiên", type: "number", required: true },
        { key: "order", label: "Thứ tự", type: "number", required: true },
        { key: "createdAt", label: "Ngày tạo", type: "date" },
        { key: "updatedAt", label: "Cập nhật lần cuối", type: "date" },
      ]}
    />
  );
}
