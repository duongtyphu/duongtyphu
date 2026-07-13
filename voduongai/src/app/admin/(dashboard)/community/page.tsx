"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { communityChannelsSeed, type CommunityChannel } from "@/data/admin/community";

export default function CommunityAdminPage() {
  return (
    <CrudPage<CommunityChannel>
      title="Cộng đồng"
      description="Quản lý kênh cộng đồng: Facebook, YouTube, TikTok, Zalo, Telegram, Email, Newsletter."
      collectionKey="community"
      seed={communityChannelsSeed}
      searchKeys={["label", "platform"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Active", "Inactive"] }}
      columns={[
        { key: "platform", label: "Nền tảng" },
        { key: "label", label: "Tên hiển thị" },
        { key: "url", label: "Link" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        {
          key: "platform",
          label: "Nền tảng",
          type: "select",
          options: ["Facebook", "YouTube", "TikTok", "Zalo", "Telegram", "Email", "Newsletter"],
        },
        { key: "label", label: "Tên hiển thị", type: "text", required: true },
        { key: "url", label: "URL", type: "text" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Inactive"] },
      ]}
    />
  );
}
