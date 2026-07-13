"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";
import { Badge } from "@/components/admin/ui/Badge";

export default function PromptsAdminPage() {
  return (
    <KnowledgeCrudPage
      title="Prompts"
      description="Quản lý toàn bộ Prompt AI hiển thị trong Portal. Canonical CKOS module (ADM-SPR-004): Summary/Body map vào description/content để Portal tiếp tục hoạt động bình thường."
      collectionKey="prompts"
      summaryKey="description"
      bodyKey="content"
      extraColumns={[
        { key: "copyCount", label: "Lượt copy" },
        {
          key: "featured",
          label: "Nổi bật",
          render: (it) => (it.featured ? <Badge tone="orange">Featured</Badge> : <span className="text-white/30">—</span>),
        },
      ]}
      aiAssist={{
        kind: "prompt",
        applyResult: (data) => ({
          slug: "slug" in data ? data.slug : "",
          summary: "summary" in data ? data.summary : "",
          body: "content" in data ? data.content : "",
          tags: "tags" in data ? data.tags : [],
        }),
      }}
      extraFields={[
        { key: "exampleOutput", label: "Ví dụ đầu ra", type: "textarea", full: true },
        { key: "level", label: "Cấp độ", type: "select", options: ["Cơ bản", "Trung cấp", "Nâng cao"] },
        { key: "tier", label: "Free / Premium", type: "select", options: ["Free", "Premium"] },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "copyCount", label: "Số lần copy (mock)", type: "number" },
      ]}
    />
  );
}
