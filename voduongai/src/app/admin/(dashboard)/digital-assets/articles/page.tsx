"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { DigitalAssetCategoryTabs } from "@/components/admin/DigitalAssetCategoryTabs";
import {
  digitalAssetArticles,
  digitalAssetProjects,
  digitalAssetCategories,
  type DigitalAssetArticle,
} from "@/data/digitalAssets";

function projectName(projectId: string) {
  return digitalAssetProjects.find((p) => p.id === projectId)?.name ?? projectId;
}

export default function DigitalAssetArticlesAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Bài viết dự án ĐẦU TƯ CÙNG TÔI</h1>
        <p className="mt-1 text-sm text-white/50">
          Chọn danh mục bên dưới để quản lý riêng bài viết của từng danh mục — bài viết luôn theo đúng danh mục
          của dự án đã chọn.
        </p>
      </div>

      <DigitalAssetCategoryTabs>
        {(categoryKey) => {
          const category = digitalAssetCategories.find((c) => c.key === categoryKey);
          const projectsInCategory = digitalAssetProjects.filter((p) => p.category === categoryKey);
          const projectOptions = projectsInCategory.map((p) => p.id);

          return (
            <CrudPage<DigitalAssetArticle>
              title={`Bài viết — ${category?.name ?? categoryKey}`}
              description={category?.description}
              collectionKey="digital-asset-articles"
              seed={digitalAssetArticles}
              searchKeys={["title"]}
              lockedFilter={{ key: "category", value: categoryKey }}
              columns={[
                { key: "title", label: "Tiêu đề" },
                { key: "projectId", label: "Dự án", render: (a) => projectName(a.projectId) },
                { key: "status", label: "Trạng thái" },
                { key: "featured", label: "Nổi bật", render: (a) => (a.featured ? "✅" : "—") },
                { key: "publishedAt", label: "Ngày đăng" },
              ]}
              fields={[
                { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
                { key: "slug", label: "Slug", type: "text", required: true },
                { key: "projectId", label: "Dự án", type: "select", options: projectOptions, required: true },
                { key: "image", label: "Ảnh bài viết (URL)", type: "text" },
                { key: "author", label: "Tác giả", type: "text", required: true },
                { key: "excerpt", label: "Mô tả ngắn", type: "textarea", required: true, full: true },
                { key: "content", label: "Nội dung", type: "textarea", required: true, full: true },
                { key: "tags", label: "Tags", type: "tags", full: true },
                { key: "publishedAt", label: "Ngày đăng", type: "date" },
                { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
                { key: "featured", label: "Nổi bật", type: "boolean" },
                { key: "metaTitle", label: "Meta title (SEO)", type: "text", full: true },
                { key: "metaDescription", label: "Meta description (SEO)", type: "textarea", full: true },
                { key: "ogImage", label: "OG Image (URL)", type: "text" },
              ]}
            />
          );
        }}
      </DigitalAssetCategoryTabs>
    </div>
  );
}
