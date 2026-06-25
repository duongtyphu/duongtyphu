"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { studentSuccessSeed, type StudentStory } from "@/data/admin/studentSuccess";

export default function StudentSuccessAdminPage() {
  return (
    <CrudPage<StudentStory>
      title="Thành công học viên"
      description="Quản lý các câu chuyện thành công của học viên hiển thị trên Portal."
      collectionKey="student-success-stories"
      seed={studentSuccessSeed}
      searchKeys={["studentName", "title", "result"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      columns={[
        { key: "studentName", label: "Học viên" },
        { key: "title", label: "Tiêu đề" },
        { key: "featured", label: "Nổi bật" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "studentName", label: "Tên học viên", type: "text", required: true },
        { key: "avatar", label: "Avatar URL", type: "text" },
        { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
        { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", required: true, full: true },
        { key: "content", label: "Nội dung chi tiết", type: "textarea", required: true, full: true },
        { key: "result", label: "Kết quả", type: "text", required: true, full: true },
        { key: "toolsUsed", label: "Công cụ đã dùng", type: "tags" },
        { key: "relatedResource", label: "Tài nguyên liên quan", type: "text" },
        { key: "image", label: "Ảnh minh hoạ URL", type: "text" },
        { key: "featured", label: "Nổi bật", type: "boolean" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
