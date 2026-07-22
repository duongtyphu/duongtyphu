"use client";

import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "./EditModeContext";
import { PillarEntranceCard, type PillarIconKey, type PillarAccent } from "./PillarEntranceCard";
import type { LiveHomeCard } from "@/lib/portal/live-home-cards";

/**
 * 7 Pillar Entrance Card — đọc thật từ `home_cards` (nối dây, xem CLAUDE.md
 * mục "Nhóm 3 — Nối dây home_cards"). `seed` là dữ liệu đã fetch server-side
 * ở `GemHomePage` (`getLiveHomeCards()`) — với `editMode=false` (Portal
 * thật, mặc định), `useCollection(..., {enabled: false})` KHÔNG fetch gì cả,
 * chỉ pass-through đúng `seed` này làm `items` — seed đã LÀ dữ liệu thật nên
 * Portal vẫn hiển thị đúng ngay, không có request mạng thừa nào. Route
 * live-edit tương lai (chưa build) sẽ bọc `<EditModeProvider>` khiến
 * `useEditMode()` trả `true`, kích hoạt fetch/phản ứng thật qua
 * `useCollection()` để sửa tại chỗ — không cần sửa lại file này.
 */
export function HomePillarCards({
  seed,
  ownedCount,
  premiumStarted,
}: {
  seed: LiveHomeCard[];
  ownedCount: number;
  premiumStarted: string;
}) {
  const editMode = useEditMode();
  const { items } = useCollection<LiveHomeCard>("home-cards", seed, { enabled: editMode });

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((card) => {
        const isPremium = card.id === "card_premium";
        const companionLine =
          isPremium && ownedCount > 0 && card.companionLineOwned ? card.companionLineOwned : card.companionLine;
        return (
          <PillarEntranceCard
            key={card.id}
            icon={card.icon as PillarIconKey}
            accent={card.accent as PillarAccent}
            title={card.title}
            what={card.what}
            href={card.href}
            startedMode={card.startedMode as "module" | "aggregate" | "recent" | undefined}
            module={card.module ?? undefined}
            startedOverride={isPremium ? premiumStarted : undefined}
            companionLine={companionLine}
            ctaLabel={card.ctaLabel}
          />
        );
      })}
    </div>
  );
}
