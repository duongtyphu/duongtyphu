"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { DigitalAssetCategoryTabs } from "@/components/admin/DigitalAssetCategoryTabs";
import { digitalAssetProjects, digitalAssetCategories, type DigitalAssetProject } from "@/data/digitalAssets";

const BADGE_OPTIONS = ["Đang theo dõi", "Đang tham gia", "Đề xuất", "Mới"];

export default function DigitalAssetProjectsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Dự án ĐẦU TƯ CÙNG TÔI</h1>
        <p className="mt-1 text-sm text-white/50">
          Chọn danh mục bên dưới để quản lý riêng dự án của từng danh mục — tránh nhầm dự án giữa các mục.
        </p>
      </div>

      <DigitalAssetCategoryTabs>
        {(categoryKey) => {
          const category = digitalAssetCategories.find((c) => c.key === categoryKey);
          return (
            <CrudPage<DigitalAssetProject>
              title={`Dự án — ${category?.name ?? categoryKey}`}
              description={category?.description}
              collectionKey="digital-asset-projects"
              seed={digitalAssetProjects}
              searchKeys={["name", "slug"]}
              lockedFilter={{ key: "category", value: categoryKey }}
              viewHref={(p) => `/portal/digital-assets/${p.slug}`}
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
        }}
      </DigitalAssetCategoryTabs>
    </div>
  );
}
