"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { ACADEMY_WORKSPACE_SECTIONS } from "@/lib/admin/academy/navigation";
import { CrudPage } from "@/components/admin/CrudPage";
import { dailyMissionsSeed, type DailyMission } from "@/data/admin/roadmap";

export default function DailyMissionsPage() {
  return (
    <AdminWorkspaceShell title="Academy Workspace" description="" rootHref="/admin/academy" sections={ACADEMY_WORKSPACE_SECTIONS}>
    <CrudPage<DailyMission>
      title="Nhiệm vụ hôm nay"
      description="⚠️ Đính chính ACADEMY-SPR-401: mô tả cũ ghi 'hiển thị trên Portal Dashboard' — xác nhận lại trực tiếp: 0 route/component Portal nào đọc collection này. Vẫn quản lý được đầy đủ ở đây, nhưng thay đổi CHƯA hiển thị ra Portal thật."
      collectionKey="daily-missions"
      seed={dailyMissionsSeed}
      searchKeys={["title", "description"]}
      filterOptions={{
        key: "taskType",
        label: "Loại",
        options: ["Học", "Copy Prompt", "Xem công cụ", "Tải tài nguyên", "Hoàn thành bài học", "Click CTA"],
      }}
      columns={[
        { key: "order", label: "Thứ tự" },
        { key: "title", label: "Tiêu đề" },
        { key: "taskType", label: "Loại nhiệm vụ" },
        { key: "points", label: "Điểm" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true },
        { key: "description", label: "Mô tả", type: "textarea", full: true },
        {
          key: "taskType",
          label: "Loại nhiệm vụ",
          type: "select",
          options: ["Học", "Copy Prompt", "Xem công cụ", "Tải tài nguyên", "Hoàn thành bài học", "Click CTA"],
        },
        { key: "points", label: "Điểm thưởng", type: "number" },
        { key: "link", label: "Liên kết nội dung", type: "text" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Inactive"] },
        { key: "repeatsDaily", label: "Lặp lại hằng ngày", type: "boolean" },
        { key: "order", label: "Thứ tự hiển thị", type: "number" },
      ]}
    />
    </AdminWorkspaceShell>
  );
}
