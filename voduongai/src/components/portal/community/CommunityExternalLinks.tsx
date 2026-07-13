"use client";

import { Globe, MessageCircle, PlayCircle, Send, Mail } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import { communityChannelsSeed, type CommunityChannel } from "@/data/admin/community";

/**
 * JOURNEY-SPR-901 Task 4 — trước sprint này, Final CTA (/portal/congdongai)
 * hardcode 3 link Facebook Group/Zalo Group/YouTube trong siteConfig
 * (site.ts), trong khi CRUD thật (/admin/community, collection "community")
 * có Consumer = 0 — Founder sửa link ở Admin không có tác dụng gì trên
 * Portal. Component này đọc trực tiếp collection thật (cùng hook
 * useCollection() mà AdminPromptsSection.tsx đã dùng để nối /portal/prompts
 * với Admin) — không tạo object/bảng mới, chỉ nối dây cái đã có.
 */
const PLATFORM_ICON: Record<CommunityChannel["platform"], typeof Globe> = {
  Facebook: Globe,
  Zalo: MessageCircle,
  YouTube: PlayCircle,
  TikTok: Globe,
  Telegram: Send,
  Email: Mail,
  Newsletter: Mail,
};

export function CommunityExternalLinks() {
  const { items, ready } = useCollection<CommunityChannel>("community", communityChannelsSeed);
  const active = items.filter((c) => c.status === "Active" && c.url);
  if (!ready || active.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-3">
      {active.map((channel) => {
        const Icon = PLATFORM_ICON[channel.platform] ?? Globe;
        return (
          <a
            key={channel.id}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
          >
            <Icon className="h-3.5 w-3.5" /> {channel.label}
          </a>
        );
      })}
    </div>
  );
}
