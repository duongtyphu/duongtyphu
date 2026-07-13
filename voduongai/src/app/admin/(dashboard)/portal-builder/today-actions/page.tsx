"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { todayActionsSeed, type TodayActionCard } from "@/data/admin/todayActions";

export default function TodayActionsAdminPage() {
  return (
    <CrudPage<TodayActionCard>
      title="Hôm nay bạn muốn làm gì?"
      description="Quản lý các thẻ lựa chọn hành động trên Dashboard Portal."
      collectionKey="today-action-cards"
      seed={todayActionsSeed}
      searchKeys={["title", "description"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      columns={[
        { key: "order", label: "Thứ tự" },
        { key: "title", label: "Tiêu đề" },
        { key: "featured", label: "Nổi bật" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
        { key: "description", label: "Mô tả", type: "textarea", required: true, full: true },
        { key: "icon", label: "Icon", type: "text", placeholder: "🤖" },
        { key: "gradient", label: "Gradient (CSS)", type: "text", placeholder: "from-blue-500 to-cyan-400" },
        { key: "ctaText", label: "CTA text", type: "text", required: true },
        { key: "ctaHref", label: "CTA link", type: "text", required: true },
        { key: "order", label: "Thứ tự", type: "number", required: true },
        { key: "featured", label: "Nổi bật", type: "boolean" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
