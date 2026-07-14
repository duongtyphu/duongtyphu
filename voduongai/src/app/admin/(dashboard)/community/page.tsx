"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { CrudPage } from "@/components/admin/CrudPage";
import { communityChannelsSeed, type CommunityChannel } from "@/data/admin/community";
import { JOURNEY_COMMUNITY_SECTIONS } from "@/lib/admin/journeyCommunity/navigation";

/**
 * Kênh cộng đồng (JOURNEY-SPR-901 Task 4) — CRUD thật (Supabase, collection
 * "community"), nay đọc trực tiếp bởi /portal/congdongai (Final CTA — 3
 * external link) qua CommunityExternalLinks.tsx. Trước sprint này Consumer
 * = 0 (Portal hardcode siteConfig.community thay vì đọc collection này).
 */
export default function CommunityAdminPage() {
  return (
    <AdminWorkspaceShell
      title="Journey & Community"
      description="Kênh cộng đồng — nay đọc trực tiếp bởi /portal/congdongai (Final CTA, các link Active đầu tiên theo nền tảng Facebook/Zalo/YouTube). Đổi URL/trạng thái ở đây có hiệu lực thật trên Portal (JOURNEY-SPR-901)."
      rootHref="/admin/journey"
      sections={JOURNEY_COMMUNITY_SECTIONS}
    >
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
    </AdminWorkspaceShell>
  );
}
