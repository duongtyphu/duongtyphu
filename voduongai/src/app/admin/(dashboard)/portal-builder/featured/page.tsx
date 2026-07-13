"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { featuredContentSeed, type FeaturedContent } from "@/data/admin/portalBuilder";

export default function FeaturedContentPage() {
  return (
    <CrudPage<FeaturedContent>
      title="Nội dung nổi bật"
      description="Chọn Prompt, Công cụ, Ebook, Affiliate, khóa học nổi bật hiển thị trên Portal."
      collectionKey="portal-featured"
      seed={featuredContentSeed}
      searchKeys={["title", "relatedItem"]}
      filterOptions={{
        key: "type",
        label: "Loại",
        options: ["Prompt", "Công cụ", "Ebook", "Affiliate", "Khóa học", "Tài nguyên mới"],
      }}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "type", label: "Loại" },
        { key: "relatedItem", label: "Liên kết tới" },
        { key: "priority", label: "Ưu tiên" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "title", label: "Title", type: "text", required: true },
        {
          key: "type",
          label: "Type",
          type: "select",
          options: ["Prompt", "Công cụ", "Ebook", "Affiliate", "Khóa học", "Tài nguyên mới"],
        },
        { key: "relatedItem", label: "Related item (slug/id)", type: "text" },
        { key: "priority", label: "Priority", type: "number" },
        { key: "status", label: "Status", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
