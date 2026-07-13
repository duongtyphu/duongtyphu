"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { AdminResource } from "@/data/admin/resources";

export function ResourceManager({
  title,
  collectionKey,
  seed,
}: {
  title: string;
  collectionKey: string;
  seed: AdminResource[];
}) {
  return (
    <CrudPage<AdminResource>
      title={title}
      description="Quản lý tài nguyên hiển thị và phân phối trong Portal."
      collectionKey={collectionKey}
      seed={seed}
      searchKeys={["name", "category"]}
      filterOptions={{ key: "tier", label: "Gói", options: ["Free", "Premium"] }}
      columns={[
        { key: "name", label: "Tên" },
        { key: "category", label: "Danh mục" },
        { key: "tier", label: "Gói" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "name", label: "Tên", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "thumbnail", label: "Thumbnail", type: "text" },
        { key: "description", label: "Mô tả", type: "textarea", full: true },
        { key: "fileUrl", label: "File URL", type: "text" },
        { key: "downloadLink", label: "Link tải", type: "text" },
        { key: "category", label: "Danh mục", type: "text" },
        { key: "tags", label: "Tag", type: "tags" },
        { key: "tier", label: "Free / Premium", type: "select", options: ["Free", "Premium"] },
        { key: "requiresSignup", label: "Yêu cầu đăng ký", type: "boolean" },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
