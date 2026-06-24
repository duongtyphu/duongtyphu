"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { ctaSeed, type CtaItem } from "@/data/admin/portalBuilder";

export default function CtaManagerPage() {
  return (
    <CrudPage<CtaItem>
      title="CTA Manager"
      description="Quản lý các nút Call-to-action hiển thị trong Portal."
      collectionKey="portal-cta"
      seed={ctaSeed}
      searchKeys={["text", "location"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Active", "Inactive"] }}
      columns={[
        { key: "text", label: "CTA text" },
        { key: "href", label: "Link" },
        { key: "location", label: "Vị trí" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "text", label: "CTA text", type: "text", required: true },
        { key: "href", label: "CTA link", type: "text", required: true },
        { key: "type", label: "CTA type", type: "select", options: ["Primary", "Secondary", "Outline"] },
        { key: "buttonStyle", label: "Button style", type: "select", options: ["Pill", "Square"] },
        { key: "location", label: "Location", type: "text" },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
      ]}
    />
  );
}
