"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { userGoalsSeed, type UserGoal } from "@/data/admin/userGoals";

export default function UserGoalsAdminPage() {
  return (
    <CrudPage<UserGoal>
      title="Mục tiêu người dùng"
      description="Quản lý các lựa chọn trong widget 'Mục tiêu của tôi' trên Portal."
      collectionKey="user-goals"
      seed={userGoalsSeed}
      searchKeys={["label", "description"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      columns={[
        { key: "order", label: "Thứ tự" },
        { key: "label", label: "Tên mục tiêu" },
        { key: "goalKey", label: "Key" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "goalKey", label: "Goal key", type: "text", required: true },
        { key: "label", label: "Tên mục tiêu", type: "text", required: true, full: true },
        { key: "description", label: "Mô tả", type: "textarea", full: true },
        { key: "icon", label: "Icon", type: "text", placeholder: "🎯" },
        { key: "suggestionText", label: "Gợi ý hiển thị", type: "textarea", full: true },
        { key: "suggestedRoute", label: "Route gợi ý", type: "text" },
        { key: "relatedResource", label: "Tài nguyên liên quan", type: "text" },
        { key: "relatedTool", label: "Công cụ liên quan", type: "text" },
        { key: "order", label: "Thứ tự", type: "number", required: true },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
