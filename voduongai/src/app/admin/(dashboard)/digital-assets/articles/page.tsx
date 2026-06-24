"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import {
  digitalAssetArticles,
  digitalAssetProjects,
  digitalAssetCategories,
  type DigitalAssetArticle,
} from "@/data/digitalAssets";

const PROJECT_OPTIONS = digitalAssetProjects.map((p) => p.id);
const CATEGORY_OPTIONS = digitalAssetCategories.map((c) => c.key);

function projectName(projectId: string) {
  return digitalAssetProjects.find((p) => p.id === projectId)?.name ?? projectId;
}

export default function DigitalAssetArticlesAdminPage() {
  return (
    <CrudPage<DigitalAssetArticle>
      title="Bài viết dự án Tài sản số"
      description="Quản lý các bài viết/phân tích gắn với từng dự án Tài sản số."
      collectionKey="digital-asset-articles"
      seed={digitalAssetArticles}
      searchKeys={["title"]}
      filterOptions={{ key: "category", label: "Danh mục", options: CATEGORY_OPTIONS }}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "projectId", label: "Dự án", render: (a) => projectName(a.projectId) },
        {
          key: "category",
          label: "Danh mục",
          render: (a) => digitalAssetCategories.find((c) => c.key === a.category)?.name ?? a.category,
        },
        { key: "status", label: "Trạng thái" },
        { key: "featured", label: "Nổi bật", render: (a) => (a.featured ? "✅" : "—") },
        { key: "publishedAt", label: "Ngày đăng" },
      ]}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "projectId", label: "Dự án", type: "select", options: PROJECT_OPTIONS, required: true },
        { key: "category", label: "Danh mục", type: "select", options: CATEGORY_OPTIONS, required: true },
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
}
