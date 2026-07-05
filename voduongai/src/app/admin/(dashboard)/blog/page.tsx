"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { blogPostsSeed, type AdminBlogPost } from "@/data/admin/content";
import { blogCategories } from "@/data/blog";
import { Badge } from "@/components/admin/ui/Badge";

export default function BlogAdminPage() {
  return (
    <CrudPage<AdminBlogPost>
      title="Blog AI"
      description="Quản lý bài viết Blog AI. Nội dung dùng Markdown/textarea."
      collectionKey="blog"
      seed={blogPostsSeed}
      searchKeys={["title", "category"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      viewHref={(it) => `/blogai/${it.slug}`}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "category", label: "Danh mục" },
        { key: "author", label: "Tác giả" },
        { key: "publishedAt", label: "Ngày đăng" },
        {
          key: "featured",
          label: "Nổi bật",
          render: (it) => (it.featured ? <Badge tone="orange">Featured</Badge> : <span className="text-white/30">—</span>),
        },
        { key: "status", label: "Trạng thái" },
      ]}
      aiAssist={{
        kind: "blog",
        briefKey: "excerpt",
        contentKey: "content",
        applyResult: (data) => ({
          slug: data.slug,
          excerpt: data.summary,
          content: "content" in data ? data.content : "",
          tags: data.tags,
          metaTitle: "seoTitle" in data ? data.seoTitle : undefined,
          metaDescription: "seoDescription" in data ? data.seoDescription : undefined,
        }),
      }}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "coverImage", label: "Ảnh đại diện", type: "text" },
        { key: "excerpt", label: "Mô tả ngắn", type: "textarea", full: true },
        { key: "content", label: "Nội dung bài viết (Markdown)", type: "textarea", full: true },
        { key: "category", label: "Danh mục", type: "select", options: [...blogCategories] },
        { key: "tags", label: "Tag", type: "tags" },
        { key: "author", label: "Tác giả", type: "text" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
        { key: "publishedAt", label: "Ngày đăng", type: "date" },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "metaTitle", label: "Meta title", type: "text" },
        { key: "metaDescription", label: "Meta description", type: "textarea", full: true },
        { key: "ogImage", label: "Open Graph image", type: "text" },
        { key: "companionSummary", label: "Mô tả cho Companion (summaryForCompanion)", type: "textarea", full: true },
        { key: "keyTakeaways", label: "Key Takeaways (mỗi dòng 1 điểm)", type: "textarea", full: true },
        { key: "relatedTools", label: "Công cụ liên quan (slug, cách nhau bởi dấu phẩy)", type: "text", full: true },
        { key: "relatedCourseHref", label: "Khóa học liên quan (href)", type: "text" },
      ]}
    />
  );
}
