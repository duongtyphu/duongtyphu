"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { updatesSeed, type UpdateItem } from "@/data/admin/updates";

export default function UpdatesAdminPage() {
  return (
    <CrudPage<UpdateItem>
      title="Tin tức & Cập nhật"
      description="Quản lý tin tức và cập nhật hệ sinh thái hiển thị trên Portal."
      collectionKey="updates"
      seed={updatesSeed}
      searchKeys={["title", "shortContent"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "type", label: "Loại" },
        { key: "publishedAt", label: "Ngày đăng" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        {
          key: "type",
          label: "Loại",
          type: "select",
          options: ["Tài nguyên mới", "Prompt mới", "Công cụ mới", "Khóa học mới", "Cập nhật hệ sinh thái", "Thông báo"],
        },
        { key: "shortContent", label: "Nội dung ngắn", type: "textarea", required: true, full: true },
        { key: "content", label: "Nội dung chi tiết", type: "textarea", required: true, full: true },
        { key: "publishedAt", label: "Ngày đăng", type: "date", required: true },
        { key: "author", label: "Tác giả", type: "text" },
        { key: "featured", label: "Nổi bật", type: "boolean" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
