"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { digitalAssetCategories, type DigitalAssetCategory } from "@/data/digitalAssets";

export default function DigitalAssetCategoriesAdminPage() {
  return (
    <CrudPage<DigitalAssetCategory>
      title="Danh mục Tài sản số"
      description="Quản lý các lĩnh vực/danh mục trong mục Tài sản số trên Portal."
      collectionKey="digital-asset-categories"
      seed={digitalAssetCategories}
      searchKeys={["name", "slug"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Active", "Inactive"] }}
      columns={[
        {
          key: "name",
          label: "Danh mục",
          render: (c) => (
            <span className="flex items-center gap-2">
              <span>{c.icon}</span>
              <span className="font-semibold text-white">{c.name}</span>
            </span>
          ),
        },
        { key: "slug", label: "Slug" },
        { key: "order", label: "Thứ tự" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "name", label: "Tên danh mục", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "icon", label: "Icon", type: "text", placeholder: "💠" },
        { key: "color", label: "Màu (hex)", type: "text", placeholder: "#2563EB" },
        { key: "description", label: "Mô tả", type: "textarea", required: true, full: true },
        { key: "order", label: "Thứ tự", type: "number", required: true },
        { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Inactive"] },
      ]}
    />
  );
}
