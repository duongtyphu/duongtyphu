"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { dailyMissionsSeed, type DailyMission } from "@/data/admin/roadmap";

export default function DailyMissionsPage() {
  return (
    <CrudPage<DailyMission>
      title="Nhiệm vụ hôm nay"
      description="Quản lý danh sách nhiệm vụ hiển thị trên Portal Dashboard."
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
  );
}
