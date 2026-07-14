"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { roadmapSeed, type RoadmapStep } from "@/data/admin/roadmap";

export default function RoadmapManagerPage() {
  return (
    <CrudPage<RoadmapStep>
      title="Lộ trình thành công"
      description="Quản lý các bước trong Lộ trình thành công hiển thị trên Portal."
      collectionKey="roadmap-steps"
      seed={roadmapSeed}
      searchKeys={["title", "description"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      columns={[
        { key: "order", label: "Thứ tự" },
        { key: "icon", label: "Icon" },
        { key: "title", label: "Tên bước" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "title", label: "Tên bước", type: "text", required: true },
        { key: "description", label: "Mô tả", type: "textarea", full: true },
        { key: "icon", label: "Icon", type: "text", placeholder: "🚀" },
        { key: "order", label: "Thứ tự", type: "number" },
        { key: "relatedResource", label: "Tài nguyên liên quan", type: "text" },
        { key: "relatedPrompt", label: "Prompt liên quan", type: "text" },
        { key: "relatedTool", label: "Công cụ liên quan", type: "text" },
        { key: "relatedLesson", label: "Bài học liên quan", type: "text" },
        { key: "relatedMission", label: "Nhiệm vụ liên quan", type: "text" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
