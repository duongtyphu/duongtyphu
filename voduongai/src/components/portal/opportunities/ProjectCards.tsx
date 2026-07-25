"use client";

import { useState } from "react";
import Link from "next/link";
import { GripVertical, Layers, Building2, Bitcoin, Link2, LineChart, type LucideIcon } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";
import { useEditMode } from "./EditModeContext";
import { EditableRegion } from "./EditableRegion";
import type { LiveProject } from "@/lib/portal/live-projects";

/** Y hệt map/bảng màu đã có trong `/portal/duan-cohoi/page.tsx` trước khi
 * tách ra đây — không đổi bất kỳ giá trị nào, chỉ chuyển vị trí để
 * `ProjectCards` (Client Component, cần `useCollection`/`useState`) tự
 * chứa toàn bộ phần render card, `page.tsx` (Server Component) không cần
 * biết các map này nữa. */
const ICON_MAP: Record<string, LucideIcon> = {
  layers: Layers,
  "building-2": Building2,
  bitcoin: Bitcoin,
  "link-2": Link2,
  "line-chart": LineChart,
};

const DEFAULT_SURFACE = {
  card: "border-gray-200 bg-white hover:border-gray-400 hover:shadow-token-lg hover:-translate-y-1",
  strip: "bg-gray-400",
  chip: "bg-gray-500 text-white",
  badge: "bg-gray-100 text-gray-700",
};

const ECOSYSTEM_SURFACE: Record<string, { card: string; strip: string; chip: string; badge: string }> = {
  digiu: {
    card: "border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white hover:border-blue-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-blue-600 to-indigo-600",
    chip: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
    badge: "bg-blue-100 text-blue-700",
  },
  solargroup: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white hover:border-amber-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-amber-500 to-orange-500",
    chip: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
    badge: "bg-amber-100 text-amber-800",
  },
  crypto: {
    card: "border-slate-300 bg-gradient-to-br from-slate-100 via-slate-50 to-white hover:border-emerald-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-slate-800 to-emerald-600",
    chip: "bg-gradient-to-br from-slate-800 to-emerald-600 text-white",
    badge: "bg-slate-200 text-slate-700",
  },
  blockchain: {
    card: "border-violet-200 bg-gradient-to-br from-violet-50 via-blue-50/50 to-white hover:border-violet-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-violet-600 to-blue-500",
    chip: "bg-gradient-to-br from-violet-600 to-blue-500 text-white",
    badge: "bg-violet-100 text-violet-700",
  },
  trading: {
    card: "border-emerald-300 bg-gradient-to-br from-emerald-50 via-green-50/50 to-white hover:border-emerald-500 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-emerald-700 to-green-600",
    chip: "bg-gradient-to-br from-emerald-700 to-green-600 text-white",
    badge: "bg-emerald-100 text-emerald-800",
  },
};

const PROJECT_FIELDS: FieldConfig[] = [
  { key: "key", label: "Key nội bộ (khớp key trong ECOSYSTEM_SURFACE, không đổi trừ khi chắc chắn)", type: "text", required: true },
  { key: "name", label: "Tên hệ sinh thái", type: "text", required: true },
  { key: "description", label: "Mô tả ngắn", type: "textarea", full: true, required: true },
  {
    key: "href",
    label: "Đường dẫn trang chi tiết (phải khớp đúng route tĩnh có sẵn ở /portal/duan-cohoi/[ecosystemSlug])",
    type: "text",
    required: true,
  },
  { key: "icon", label: "Icon", type: "select", options: ["layers", "building-2", "bitcoin", "link-2", "line-chart"], required: true },
  { key: "statusLabel", label: "Nhãn trạng thái hiển thị (vd. \"Đang theo dõi\")", type: "text", required: true },
  { key: "status", label: "Trạng thái xuất bản", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

/**
 * Nhóm 3 — Live-edit hub Dự án & Cơ hội (Cách A), thay thế hẳn
 * `/admin/projects` (DataTable). Tách từ khối JSX render lưới ecosystem
 * cũ (`/portal/duan-cohoi/page.tsx`) sang Client Component riêng — cùng
 * lý do/kỹ thuật đã dùng cho `HomePillarCards.tsx` (`home_cards`):
 * `page.tsx` (Server Component) fetch `getLiveProjects()` truyền xuống
 * làm `seed`; `useCollection("projects", seed, {enabled: useEditMode()})`
 * — Portal thật (`editMode=false`) pass-through đúng `seed`, 0 request
 * mạng thừa; qua `/admin/duan-cohoi` (`editMode=true`) mới thật sự fetch/
 * phản ứng để sửa + kéo-thả đổi thứ tự (dùng `reorder()` có sẵn, cùng cơ
 * chế `HomePillarCards.tsx` đã dùng).
 */
export function ProjectCards({ seed }: { seed: LiveProject[] }) {
  const editMode = useEditMode();
  const { items, update, reorder } = useCollection<LiveProject>("projects", seed, { enabled: editMode });
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const surface = ECOSYSTEM_SURFACE[item.key] ?? DEFAULT_SURFACE;
        const Icon = ICON_MAP[item.icon] ?? Layers;

        const cardBody = (
          <div
            className={`overflow-hidden rounded-2xl border p-5 shadow-token-sm transition duration-200 sm:p-6 ${surface.card}`}
          >
            <div className={`-mx-5 -mt-5 mb-4 h-1.5 sm:-mx-6 sm:-mt-6 ${surface.strip}`} aria-hidden />

            {editMode ? (
              <EditableRegion record={item} fields={PROJECT_FIELDS} update={update}>
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${surface.chip}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`gemos-badge ${surface.badge}`}>{item.statusLabel}</span>
                </div>
                <h3 className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{item.name}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
              </EditableRegion>
            ) : (
              <Link href={item.href} className="block">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${surface.chip}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`gemos-badge ${surface.badge}`}>{item.statusLabel}</span>
                </div>
                <h3 className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{item.name}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
              </Link>
            )}

            {/* Rule #2 restructure: 2 real anchor-scroll links staying
             * entirely within this ecosystem's own page — no more
             * Companion-intent buttons. Giữ nguyên luôn cả trong edit
             * mode (không phải phần sửa được, chỉ là link điều hướng). */}
            <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-900/10 pt-3">
              <Link
                href={`${item.href}#phan-tich-tiem-nang`}
                className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                Phân tích dự án
              </Link>
              <Link
                href={`${item.href}#lien-ket-tiep-thi`}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
              >
                Đường link liên kết dự án
              </Link>
            </div>
          </div>
        );

        if (!editMode) {
          return <div key={item.id}>{cardBody}</div>;
        }

        return (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className="relative cursor-grab"
          >
            <GripVertical className="absolute -left-2 -top-2 z-10 h-5 w-5 rounded-full border border-gray-200 bg-white p-0.5 text-gray-400 shadow-sm" />
            {cardBody}
          </div>
        );
      })}
    </div>
  );
}
