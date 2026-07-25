"use client";

import { Layers, Building2, Bitcoin, Link2, LineChart, type LucideIcon } from "lucide-react";
import type { Ecosystem } from "@/data/portal/ecosystems";
import { EditableRegion } from "@/components/portal/opportunities/EditableRegion";
import { useEditMode } from "@/components/portal/opportunities/EditModeContext";
import { useEcosystemChrome } from "@/components/portal/opportunities/EcosystemChromeContext";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Nhóm 3, Phần D (mở rộng) — tách khỏi hàm `Overview()` cũ (Server-rendered,
 * nằm trong `[ecosystemSlug]/page.tsx`) thành Client Component riêng, bọc
 * các field an toàn qua `EditableRegion` — cùng pattern Cách A đã dùng cho
 * 5 Cửa Hành trình.
 *
 * Mở rộng riêng (theo yêu cầu Founder): `fullIntro` (giới thiệu hệ sinh
 * thái) giờ CŨNG sửa được qua Admin — chuyển từ đọc `eco.fullIntro` (tĩnh)
 * sang `chrome.fullIntro` (live). `chrome`/`update` giờ lấy qua
 * `useEcosystemChrome()` (Context dùng chung với `EcosystemLinksBox`, xem
 * `EcosystemChromeContext.tsx`) thay vì tự gọi `useCollection()` riêng.
 *
 * Mở rộng thêm lần nữa (Founder: "chỉnh sửa được tất cả các trường có
 * nội dung chữ ở session đầu tiên và... Phù hợp - Chưa tham gia nếu - Kỳ
 * vọng thực tế"): `statusBadge`/`highlights`/`whoFor`/`whoNotReady`/
 * `expectedOutcome` giờ CŨNG đọc/ghi qua `chrome.*` thay vì `eco.*` tĩnh.
 * `eco` (prop) vẫn giữ — vài field khác (`icon` đã resolve qua `iconSlug`)
 * và dùng làm FALLBACK hiển thị khi `chrome.*` rỗng (tránh crash/trống
 * nếu 1 dòng `ecosystem_chrome` nào đó thiếu key mới — đúng bài học từ
 * bug "trang Admin 4 hệ sinh thái khác bị crash" vừa sửa).
 * `highlights` dùng `transform: "newline-list"` (không phải `type:
 * "tags"`) vì mỗi câu ghi chú có thể chứa dấu phẩy bên trong — tags tách
 * theo dấu phẩy sẽ cắt sai vị trí giữa câu.
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
const INTRO_FIELDS: FieldConfig[] = [
  { key: "fullIntro", label: "Giới thiệu hệ sinh thái", type: "textarea", full: true, required: true },
];
const BADGE_FIELDS: FieldConfig[] = [
  {
    key: "statusBadge",
    label: "Nhãn trạng thái",
    type: "select",
    options: ["Đang theo dõi", "Đang nghiên cứu", "Chia sẻ trải nghiệm", "Đang tham gia", "Chia sẻ kiến thức"],
    required: true,
  },
];
const HIGHLIGHTS_FIELDS: FieldConfig[] = [
  {
    key: "highlights",
    label: "Ghi chú/lưu ý (mỗi dòng 1 ghi chú)",
    type: "textarea",
    full: true,
    transform: "newline-list",
  },
];
const CRITERIA_FIELDS: FieldConfig[] = [
  { key: "whoFor", label: "Phù hợp với ai", type: "textarea", full: true, required: true },
  { key: "whoNotReady", label: "Chưa nên tham gia nếu", type: "textarea", full: true, required: true },
  { key: "expectedOutcome", label: "Kỳ vọng thực tế", type: "textarea", full: true, required: true },
];

export function EcosystemOverview({
  eco,
  iconSlug,
  surface,
}: {
  eco: Omit<Ecosystem, "icon">;
  iconSlug: string;
  surface: { chip: string; badge: string; strip: string };
}) {
  const editMode = useEditMode();
  const { chrome, update: updateChrome } = useEcosystemChrome();
  const Icon = ICON_BY_SLUG[iconSlug] ?? Layers;

  // Fallback về `eco.*` tĩnh nếu `chrome.*` rỗng (dòng chưa migrate) —
  // tránh trống trắng/crash, đúng bài học từ bug "Admin 4 hệ sinh thái
  // khác crash" vừa sửa (không chỉ dựa vào backfill dữ liệu).
  const statusBadge = chrome.statusBadge || eco.statusBadge;
  const highlights = chrome.highlights.length > 0 ? chrome.highlights : eco.highlights;
  const whoFor = chrome.whoFor || eco.whoFor;
  const whoNotReady = chrome.whoNotReady || eco.whoNotReady;
  const expectedOutcome = chrome.expectedOutcome || eco.expectedOutcome;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-token-sm">
      <div className={`h-1.5 ${surface.strip}`} aria-hidden />
      <div className="bg-white p-6 sm:p-8">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${surface.chip}`}>
            <Icon className="h-6 w-6" />
          </div>
          <EditableRegion record={{ ...chrome, statusBadge }} fields={BADGE_FIELDS} update={updateChrome} as="span">
            <span className={`gemos-badge ${surface.badge}`}>{statusBadge}</span>
          </EditableRegion>
        </div>

        <EditableRegion record={chrome} fields={NAME_FIELDS} update={updateChrome}>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{chrome.name}</h1>
        </EditableRegion>
        <EditableRegion record={chrome} fields={DESCRIPTION_FIELDS} update={updateChrome} className="mt-2">
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{chrome.shortDescription}</p>
        </EditableRegion>

        <EditableRegion record={chrome} fields={INTRO_FIELDS} update={updateChrome} className="mt-4">
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{chrome.fullIntro}</p>
        </EditableRegion>

        {(highlights.length > 0 || editMode) && (
          <EditableRegion record={{ ...chrome, highlights }} fields={HIGHLIGHTS_FIELDS} update={updateChrome}>
            <ul className="mt-4 space-y-1.5">
              {highlights.length > 0 ? (
                highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                    {h}
                  </li>
                ))
              ) : (
                <li className="text-xs text-gray-400">Chưa có ghi chú — bấm để thêm.</li>
              )}
            </ul>
          </EditableRegion>
        )}

        <EditableRegion
          record={{ ...chrome, whoFor, whoNotReady, expectedOutcome }}
          fields={CRITERIA_FIELDS}
          update={updateChrome}
        >
          <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold text-emerald-700">Phù hợp</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{whoFor}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700">Chưa nên tham gia nếu</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{whoNotReady}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Kỳ vọng thực tế</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{expectedOutcome}</p>
            </div>
          </div>
        </EditableRegion>
      </div>
    </div>
  );
}
