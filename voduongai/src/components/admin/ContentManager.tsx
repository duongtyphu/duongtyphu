"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { AdminContentItem } from "@/data/admin/content";

export function ContentManager({
  title,
  collectionKey,
  seed,
}: {
  title: string;
  collectionKey: string;
  seed: AdminContentItem[];
}) {
  return (
    <CrudPage<AdminContentItem>
      title={title}
      collectionKey={collectionKey}
      seed={seed}
      searchKeys={["title", "summary"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "publishedAt", label: "Ngày đăng" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "summary", label: "Tóm tắt", type: "textarea", full: true },
        { key: "body", label: "Nội dung", type: "textarea", full: true },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
        { key: "publishedAt", label: "Ngày đăng", type: "date" },
        { key: "featured", label: "Featured", type: "boolean" },
      ]}
    />
  );
}
