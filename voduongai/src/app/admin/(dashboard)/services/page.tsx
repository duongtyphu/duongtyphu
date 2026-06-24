"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { servicesSeed, type AdminService } from "@/data/admin/services";

export default function ServicesAdminPage() {
  return (
    <CrudPage<AdminService>
      title="Dịch vụ"
      description="Quản lý các dịch vụ tư vấn/đồng hành hiển thị tại Portal → Dịch vụ."
      collectionKey="services"
      seed={servicesSeed}
      searchKeys={["title"]}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "ctaLabel", label: "Nút CTA" },
        { key: "order", label: "Thứ tự" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
        { key: "description", label: "Mô tả", type: "textarea", required: true, full: true },
        { key: "ctaLabel", label: "Tên nút CTA", type: "text", required: true },
        { key: "ctaType", label: "Loại CTA", type: "select", options: ["email", "link"], required: true },
        {
          key: "ctaValue",
          label: "Giá trị CTA (email hoặc URL — để trống = dùng email liên hệ chung)",
          type: "text",
          full: true,
        },
        { key: "order", label: "Thứ tự hiển thị", type: "number" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
