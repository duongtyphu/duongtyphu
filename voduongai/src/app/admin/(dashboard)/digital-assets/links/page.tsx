"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { Badge } from "@/components/admin/ui/Badge";
import { digitalAssetLinks, digitalAssetProjects, type DigitalAssetLink } from "@/data/digitalAssets";

const PROJECT_OPTIONS = digitalAssetProjects.map((p) => p.id);
const TYPE_OPTIONS = [
  "Website",
  "Affiliate",
  "Exchange",
  "Telegram",
  "App",
  "Document",
  "Video",
  "Guide",
  "Community",
  "Other",
];

function projectName(projectId: string) {
  return digitalAssetProjects.find((p) => p.id === projectId)?.name ?? projectId;
}

export default function DigitalAssetLinksAdminPage() {
  return (
    <CrudPage<DigitalAssetLink>
      title="Link dự án ĐẦU TƯ CÙNG TÔI"
      description="Quản lý các link (website, affiliate, cộng đồng...) gắn với từng dự án."
      collectionKey="digital-asset-links"
      seed={digitalAssetLinks}
      searchKeys={["title"]}
      filterOptions={{ key: "projectId", label: "Dự án", options: PROJECT_OPTIONS }}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "projectId", label: "Dự án", render: (l) => projectName(l.projectId) },
        { key: "type", label: "Loại" },
        {
          key: "isAffiliate",
          label: "Affiliate",
          render: (l) => (l.isAffiliate ? <Badge tone="orange">Affiliate</Badge> : "—"),
        },
        { key: "clickCount", label: "Click" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "projectId", label: "Dự án", type: "select", options: PROJECT_OPTIONS, required: true },
        { key: "title", label: "Tiêu đề", type: "text", required: true },
        { key: "type", label: "Loại link", type: "select", options: TYPE_OPTIONS, required: true },
        { key: "url", label: "URL", type: "text", required: true, full: true },
        { key: "ctaText", label: "CTA text", type: "text", required: true },
        { key: "description", label: "Mô tả", type: "textarea", full: true },
        { key: "isAffiliate", label: "Là link Affiliate", type: "boolean" },
        { key: "trackingCode", label: "Tracking code", type: "text" },
        { key: "clickCount", label: "Số click (mock)", type: "number" },
        { key: "order", label: "Thứ tự", type: "number", required: true },
        { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Inactive"] },
      ]}
    />
  );
}
