"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { CrudPage } from "@/components/admin/CrudPage";
import {
  digitalAssetCategories,
  digitalAssetProjects,
  digitalAssetArticles,
  type DigitalAssetCategoryKey,
  type DigitalAssetProject,
  type DigitalAssetArticle,
} from "@/data/digitalAssets";

const BADGE_OPTIONS = ["Đang theo dõi", "Đang tham gia", "Đề xuất", "Mới"];

// One workspace per category, mirroring the Portal sidebar's category split
// (Hệ sinh thái DigiU / SolarGroup / Crypto / Blockchain / Trading) instead
// of the old data-type-first nav (Dự án / Link / Bài viết as separate pages).
export default function DigitalAssetCategoryAdminPage() {
  const { key } = useParams<{ key: string }>();
  const categoryKey = key as DigitalAssetCategoryKey;
  const category = digitalAssetCategories.find((c) => c.key === categoryKey);

  if (!category) notFound();

  const projectsInCategory = digitalAssetProjects.filter((p) => p.category === categoryKey);
  const projectOptions = projectsInCategory.map((p) => p.id);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">{category.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/admin/digital-assets/categories"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white"
          >
            Cấu hình danh mục
          </Link>
          <Link
            href="/admin/digital-assets/analytics"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white"
          >
            Báo cáo
          </Link>
        </div>
      </div>

      <CrudPage<DigitalAssetProject>
        title="Dự án"
        description="Các dự án thuộc danh mục này."
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

      <CrudPage<DigitalAssetArticle>
        title="Bài viết dự án"
        description="Bài viết / phân tích gắn với dự án trong danh mục này."
        collectionKey="digital-asset-articles"
        seed={digitalAssetArticles}
        searchKeys={["title"]}
        lockedFilter={{ key: "category", value: categoryKey }}
        viewHref={(a) => `/portal/duan-cohoi/bai-viet/${a.slug}`}
        columns={[
          { key: "title", label: "Tiêu đề" },
          {
            key: "projectId",
            label: "Dự án",
            render: (a) => projectsInCategory.find((p) => p.id === a.projectId)?.name ?? a.projectId,
          },
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

      <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-sm font-bold text-white">Link dự án</h2>
        <p className="mt-1.5 text-sm text-white/50">
          Link được gắn theo từng dự án (không theo danh mục trực tiếp). Quản lý tất cả link tại trang Link dự án,
          lọc theo dự án thuộc danh mục này: {projectsInCategory.map((p) => p.name).join(", ") || "—"}.
        </p>
        <Link
          href="/admin/digital-assets/links"
          className="mt-4 inline-block rounded-full gradient-surface px-5 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        >
          Quản lý Link dự án →
        </Link>
      </div>
    </div>
  );
}
