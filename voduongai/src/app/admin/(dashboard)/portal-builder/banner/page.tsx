"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { bannersSeed, type Banner } from "@/data/admin/portalBuilder";

export default function BannerManagerPage() {
  return (
    <CrudPage<Banner>
      title="Banner Manager"
      description="Quản lý thanh thông báo đầu Portal."
      collectionKey="portal-banners"
      seed={bannersSeed}
      searchKeys={["message"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Active", "Inactive"] }}
      columns={[
        { key: "message", label: "Nội dung" },
        { key: "type", label: "Loại" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "message", label: "Nội dung banner", type: "textarea", required: true, full: true },
        { key: "icon", label: "Icon", type: "text", placeholder: "🔔" },
        { key: "link", label: "Link (nếu có)", type: "text" },
        { key: "type", label: "Loại", type: "select", options: ["Info", "Promotion", "Warning", "Update"] },
        { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Inactive"] },
        { key: "startDate", label: "Ngày bắt đầu", type: "date" },
        { key: "endDate", label: "Ngày kết thúc", type: "date" },
      ]}
    />
  );
}
