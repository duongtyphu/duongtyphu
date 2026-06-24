"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { startHereSeed, type StartHereStep } from "@/data/admin/startHere";

export default function StartHereAdminPage() {
  return (
    <CrudPage<StartHereStep>
      title="Bắt đầu tại đây"
      description="Quản lý các bước trong lộ trình 'Bắt đầu tại đây' trên Portal."
      collectionKey="start-here-steps"
      seed={startHereSeed}
      searchKeys={["title", "description"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      columns={[
        { key: "order", label: "Thứ tự" },
        { key: "title", label: "Tiêu đề" },
        { key: "icon", label: "Icon" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
        { key: "description", label: "Mô tả", type: "textarea", required: true, full: true },
        { key: "icon", label: "Icon", type: "text", placeholder: "🚀" },
        { key: "order", label: "Thứ tự", type: "number", required: true },
        { key: "relatedResource", label: "Tài nguyên liên quan (href)", type: "text" },
        { key: "relatedTool", label: "Công cụ liên quan (id)", type: "text" },
        { key: "relatedPrompt", label: "Prompt liên quan (id)", type: "text" },
        { key: "relatedLesson", label: "Bài học liên quan (id)", type: "text" },
        { key: "ctaText", label: "CTA text", type: "text", required: true },
        { key: "ctaHref", label: "CTA link", type: "text", required: true },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
