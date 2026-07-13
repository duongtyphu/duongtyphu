"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { promptsSeed, type AdminPrompt } from "@/data/admin/prompts";
import { Badge } from "@/components/admin/ui/Badge";

export default function PromptsAdminPage() {
  return (
    <CrudPage<AdminPrompt>
      title="Prompt Library"
      description="Quản lý toàn bộ Prompt AI hiển thị trong Portal."
      collectionKey="prompts"
      seed={promptsSeed}
      searchKeys={["title", "category"]}
      filterOptions={{ key: "tier", label: "Gói", options: ["Free", "Premium"] }}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "category", label: "Danh mục" },
        { key: "copyCount", label: "Lượt copy" },
        {
          key: "featured",
          label: "Nổi bật",
          render: (it) => (it.featured ? <Badge tone="orange">Featured</Badge> : <span className="text-white/30">—</span>),
        },
        { key: "status", label: "Trạng thái" },
      ]}
      aiAssist={{
        kind: "prompt",
        briefKey: "description",
        contentKey: "content",
        applyResult: (data) => ({
          slug: data.slug,
          description: data.summary,
          content: "content" in data ? data.content : "",
          tags: data.tags,
        }),
      }}
      fields={[
        { key: "title", label: "Tiêu đề Prompt", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "category", label: "Danh mục", type: "text" },
        { key: "description", label: "Mô tả", type: "textarea", full: true },
        { key: "content", label: "Nội dung Prompt", type: "textarea", full: true },
        { key: "exampleOutput", label: "Ví dụ đầu ra", type: "textarea", full: true },
        { key: "tags", label: "Tag", type: "tags" },
        { key: "level", label: "Cấp độ", type: "select", options: ["Cơ bản", "Trung cấp", "Nâng cao"] },
        { key: "tier", label: "Free / Premium", type: "select", options: ["Free", "Premium"] },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "copyCount", label: "Số lần copy (mock)", type: "number" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
