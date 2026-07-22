"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";
import { useEditMode } from "./EditModeContext";
import { PillarEntranceCard, type PillarIconKey, type PillarAccent } from "./PillarEntranceCard";
import type { LiveHomeCard } from "@/lib/portal/live-home-cards";

/** Y hệt danh sách field bản VisualEditor cũ đã dùng cho `home_cards`
 * (xem lịch sử — không thêm `icon` vào đây, giống VisualEditor cũ cũng
 * không cho sửa icon tự do). Bổ sung `companionLineOwned` (field thật đã
 * có trong DB nhưng VisualEditor cũ không có ô sửa) cho đúng "toàn bộ
 * field text". */
const HOME_CARD_FIELDS: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "description", label: "Mô tả", type: "textarea", full: true, required: true },
  { key: "href", label: "Đường dẫn", type: "text", required: true },
  { key: "ctaLabel", label: "Nhãn nút bấm", type: "text", required: true },
  { key: "companionLine", label: "Câu gợi ý Companion", type: "textarea", full: true, required: true },
  {
    key: "companionLineOwned",
    label: "Câu gợi ý Companion khi đã sở hữu (chỉ Premium dùng)",
    type: "textarea",
    full: true,
  },
  {
    key: "accent",
    label: "Màu chủ đạo",
    type: "select",
    options: ["violet", "blue", "slate", "emerald", "amber", "teal", "rose"],
    required: true,
  },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published"], required: true },
];

/**
 * 7 Pillar Entrance Card — đọc thật từ `home_cards` (nối dây, xem
 * CLAUDE.md mục "Nhóm 3 — Nối dây home_cards"). `seed` là dữ liệu đã
 * fetch server-side ở `GemHomePage` (`getLiveHomeCards()`) — với
 * `editMode=false` (Portal thật, mặc định), `useCollection(...,
 * {enabled: false})` KHÔNG fetch gì cả, chỉ pass-through đúng `seed` này
 * làm `items` — seed đã LÀ dữ liệu thật nên Portal vẫn hiển thị đúng
 * ngay, không có request mạng thừa nào.
 *
 * Nhóm 3, Live-edit: route `/admin/home-cards/live-edit` (bọc
 * `<EditModeProvider>`) khiến `useEditMode()` trả `true` — kích hoạt
 * `useCollection()` fetch/phản ứng thật + nhúng `EditableRegion` (qua
 * prop `editable` của `PillarEntranceCard`) + kéo-thả đổi thứ tự (dùng
 * đúng `reorder()`/`set()` đã có sẵn trong `useCollection()`, cùng cách
 * `VisualEditor.tsx` làm — không viết cơ chế reorder mới).
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
  const { items, update, reorder } = useCollection<LiveHomeCard>("home-cards", seed, { enabled: editMode });
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    reorder(next);
    setDragIndex(null);
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((card, i) => {
        const isPremium = card.id === "card_premium";
        const companionLine =
          isPremium && ownedCount > 0 && card.companionLineOwned ? card.companionLineOwned : card.companionLine;

        if (!editMode) {
          return (
            <PillarEntranceCard
              key={card.id}
              icon={card.icon as PillarIconKey}
              accent={card.accent as PillarAccent}
              title={card.title}
              what={card.description}
              href={card.href}
              startedMode={card.startedMode as "module" | "aggregate" | "recent" | undefined}
              module={card.module ?? undefined}
              startedOverride={isPremium ? premiumStarted : undefined}
              companionLine={companionLine}
              ctaLabel={card.ctaLabel}
            />
          );
        }

        return (
          <div
            key={card.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className="relative cursor-grab"
          >
            <GripVertical className="absolute -left-2 -top-2 z-10 h-5 w-5 rounded-full border border-gray-200 bg-white p-0.5 text-gray-400 shadow-sm" />
            <PillarEntranceCard
              icon={card.icon as PillarIconKey}
              accent={card.accent as PillarAccent}
              title={card.title}
              what={card.description}
              href={card.href}
              startedMode={card.startedMode as "module" | "aggregate" | "recent" | undefined}
              module={card.module ?? undefined}
              startedOverride={isPremium ? premiumStarted : undefined}
              companionLine={companionLine}
              ctaLabel={card.ctaLabel}
              editable={{ record: card, fields: HOME_CARD_FIELDS, update }}
            />
          </div>
        );
      })}
    </div>
  );
}
