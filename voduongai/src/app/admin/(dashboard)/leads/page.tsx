"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { leadsSeed, type AdminLead } from "@/data/admin/people";

export default function LeadsAdminPage() {
  return (
    <CrudPage<AdminLead>
      title="Leads"
      description="Theo dõi lead đăng ký từ các nguồn khác nhau."
      collectionKey="leads"
      seed={leadsSeed}
      searchKeys={["name", "email", "source"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["New", "Contacted", "Converted"] }}
      columns={[
        { key: "name", label: "Họ tên" },
        { key: "email", label: "Email" },
        { key: "source", label: "Nguồn" },
        { key: "leadMagnet", label: "Lead magnet" },
        { key: "registeredAt", label: "Ngày đăng ký" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "name", label: "Họ tên", type: "text", required: true },
        { key: "email", label: "Email", type: "text", required: true },
        { key: "phone", label: "Số điện thoại", type: "text" },
        { key: "source", label: "Nguồn đăng ký", type: "text" },
        { key: "leadMagnet", label: "Lead magnet", type: "text" },
        { key: "registeredAt", label: "Ngày đăng ký", type: "date" },
        { key: "status", label: "Trạng thái", type: "select", options: ["New", "Contacted", "Converted"] },
        { key: "note", label: "Ghi chú", type: "textarea", full: true },
        { key: "tags", label: "Tag", type: "tags" },
      ]}
    />
  );
}
