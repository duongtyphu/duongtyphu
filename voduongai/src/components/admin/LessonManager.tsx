"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Lesson } from "@/data/admin/learning";

export function LessonManager({
  title,
  collectionKey,
  seed,
}: {
  title: string;
  collectionKey: string;
  seed: Lesson[];
}) {
  return (
    <CrudPage<Lesson>
      title={title}
      description="Quản lý bài học, video, tài nguyên đính kèm và trạng thái xuất bản."
      collectionKey={collectionKey}
      seed={seed}
      searchKeys={["title", "category"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      columns={[
        { key: "order", label: "Thứ tự" },
        { key: "title", label: "Tiêu đề" },
        { key: "category", label: "Danh mục" },
        { key: "level", label: "Cấp độ" },
        { key: "tier", label: "Gói" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", full: true },
        { key: "content", label: "Nội dung bài học", type: "textarea", full: true },
        { key: "videoUrl", label: "Video URL", type: "text" },
        { key: "thumbnail", label: "Thumbnail", type: "text" },
        { key: "category", label: "Danh mục", type: "text" },
        { key: "level", label: "Cấp độ", type: "select", options: ["Cơ bản", "Trung cấp", "Nâng cao"] },
        { key: "duration", label: "Thời lượng", type: "text", placeholder: "15 phút" },
        { key: "relatedResource", label: "Tài nguyên đính kèm", type: "text" },
        { key: "relatedPrompt", label: "Prompt liên quan", type: "text" },
        { key: "relatedTool", label: "Công cụ liên quan", type: "text" },
        { key: "tier", label: "Free / Premium", type: "select", options: ["Free", "Premium"] },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
        { key: "order", label: "Thứ tự hiển thị", type: "number" },
      ]}
    />
  );
}
