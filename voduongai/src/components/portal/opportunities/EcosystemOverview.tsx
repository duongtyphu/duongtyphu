"use client";

import { Layers, Building2, Bitcoin, Link2, LineChart, type LucideIcon } from "lucide-react";
import type { Ecosystem } from "@/data/portal/ecosystems";
import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "@/components/portal/opportunities/EditModeContext";
import { EditableRegion } from "@/components/portal/opportunities/EditableRegion";
import type { EcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Nhóm 3, Phần D (mở rộng) — tách khỏi hàm `Overview()` cũ (Server-rendered,
 * nằm trong `[ecosystemSlug]/page.tsx`) thành Client Component riêng, CHỈ
 * để bọc 2 field an toàn (`name`/`shortDescription`) qua `useCollection` +
 * `EditableRegion` — cùng pattern Cách A đã dùng cho 5 Cửa Hành trình.
 *
 * Mọi field khác (`fullIntro`/`highlights`/`whoFor`/`whoNotReady`/
 * `expectedOutcome`/`statusBadge`) vẫn đọc thẳng từ `eco` (tĩnh, KHÔNG qua
 * useCollection) — giữ nguyên 100% như cũ.
 *
 * BUG ĐÃ SỬA: `eco.icon` (kiểu `LucideIcon`, tức 1 function/component
 * reference) KHÔNG serialize được qua ranh giới Server→Client Component —
 * truyền thẳng `eco` (chứa `icon`) từ `[ecosystemSlug]/page.tsx` (Server)
 * vào Client Component này gây crash thật ("Functions cannot be passed
 * directly to Client Components") trên cả 5 trang chi tiết hệ sinh thái.
 * Đã sửa: nhận `iconSlug: string` (tính từ `eco.slug` ở Server Component,
 * chuỗi thuần serialize được) thay vì `eco.icon`, resolve về component
 * Lucide thật NGAY TRONG file client này — cùng kỹ thuật/lý do đã áp dụng
 * cho `PillarEntranceCard.tsx` (`home_cards`) từ trước.
 */
const ICON_BY_SLUG: Record<string, LucideIcon> = {
  digiu: Layers,
  solargroup: Building2,
  "blockchain-crypto": Bitcoin,
  "lam-affilate": Link2,
  sangiaodich: LineChart,
};

const NAME_FIELDS: FieldConfig[] = [{ key: "name", label: "Tiêu đề", type: "text", required: true }];
const DESCRIPTION_FIELDS: FieldConfig[] = [
  { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", full: true, required: true },
];

export function EcosystemOverview({
  eco,
  iconSlug,
  surface,
  seedChrome,
}: {
  eco: Omit<Ecosystem, "icon">;
  iconSlug: string;
  surface: { chip: string; badge: string; strip: string };
  seedChrome: EcosystemChrome;
}) {
  const editMode = useEditMode();
  const { items: chromeItems, update: updateChrome } = useCollection<EcosystemChrome>(
    "ecosystem-chrome",
    [seedChrome],
    { enabled: editMode },
  );
  const chrome = chromeItems.find((c) => c.id === seedChrome.id) ?? seedChrome;
  const Icon = ICON_BY_SLUG[iconSlug] ?? Layers;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-token-sm">
      <div className={`h-1.5 ${surface.strip}`} aria-hidden />
      <div className="bg-white p-6 sm:p-8">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${surface.chip}`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className={`gemos-badge ${surface.badge}`}>{eco.statusBadge}</span>
        </div>

        <EditableRegion record={chrome} fields={NAME_FIELDS} update={updateChrome}>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{chrome.name}</h1>
        </EditableRegion>
        <EditableRegion record={chrome} fields={DESCRIPTION_FIELDS} update={updateChrome} className="mt-2">
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{chrome.shortDescription}</p>
        </EditableRegion>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600">{eco.fullIntro}</p>

        {eco.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {eco.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-emerald-700">Phù hợp</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{eco.whoFor}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-700">Chưa nên tham gia nếu</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{eco.whoNotReady}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">Kỳ vọng thực tế</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{eco.expectedOutcome}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
