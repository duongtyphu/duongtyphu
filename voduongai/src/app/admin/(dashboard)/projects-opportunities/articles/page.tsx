"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PROJECTS_OPPORTUNITIES_SECTIONS } from "@/lib/admin/projectsOpportunities/navigation";
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

/**
 * PROJECTS-SPR-602: chuyển từ /admin/digital-assets/articles sang đây
 * (Consumer thật của Article không đổi — vẫn /portal/duan-cohoi/bai-viet/[slug]
 * + giờ còn được Ecosystem chọn làm "Bài viết liên quan" qua field
 * `relatedArticleIds`, xem /admin/projects-opportunities/ecosystems).
 *
 * `projectId` là field cũ trên DigitalAssetArticle (thuộc model
 * DigitalAssetProject đã gỡ CRUD khỏi Admin — không route Portal thật nào
 * đọc field này). Giữ nguyên field/select này (không đổi schema Article,
 * ngoài phạm vi sprint) — options vẫn lấy từ danh sách project cũ có sẵn,
 * không bịa danh sách mới.
 */
export default function ProjectsOpportunitiesArticlesPage() {
  return (
    <AdminWorkspaceShell title="Projects & Opportunities" description="" rootHref="/admin/projects-opportunities" sections={PROJECTS_OPPORTUNITIES_SECTIONS}>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Bài viết Dự án & Cơ hội</h1>
        <p className="mt-1 text-sm text-white/50">
          Chọn danh mục bên dưới để quản lý bài viết theo từng danh mục. Xem trực tiếp tại{" "}
          <code>/portal/duan-cohoi/bai-viet/[slug]</code>. Bài viết Published còn có thể được chọn làm
          &quot;Bài viết liên quan&quot; trong từng Hệ sinh thái.
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
              viewHref={(a) => `/portal/duan-cohoi/bai-viet/${a.slug}`}
              columns={[
                { key: "title", label: "Tiêu đề" },
                { key: "projectId", label: "Dự án (cũ)", render: (a) => projectName(a.projectId) },
                { key: "status", label: "Trạng thái" },
                { key: "featured", label: "Nổi bật", render: (a) => (a.featured ? "✅" : "—") },
                { key: "publishedAt", label: "Ngày đăng" },
              ]}
              fields={[
                { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
                { key: "slug", label: "Slug", type: "text", required: true },
                { key: "projectId", label: "Dự án (cũ, không quản lý ở đây)", type: "select", options: projectOptions, required: true },
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
    </AdminWorkspaceShell>
  );
}
