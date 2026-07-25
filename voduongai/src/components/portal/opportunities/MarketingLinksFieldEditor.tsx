"use client";

import { Plus, X } from "lucide-react";
import { genId } from "@/lib/admin/store";
import type { MarketingLink } from "@/data/portal/ecosystems";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

/**
 * Danh sách link (nhãn + URL + hiển thị/ẩn) dạng thêm/sửa/xoá dòng — dùng
 * chung cho MỌI nơi cần sửa `MarketingLink[]` ("Đường link liên kết dự
 * án"): `EcosystemLinksBox.tsx` (cấp hệ sinh thái) và
 * `SubProjectsAdminPanel.tsx` (cấp dự án con) — tách ra đây để không viết
 * lại cùng 1 UI lần thứ 2.
 */
export function MarketingLinksFieldEditor({
  links,
  onChange,
  label = "Đường link liên kết",
}: {
  links: MarketingLink[];
  onChange: (next: MarketingLink[]) => void;
  label?: string;
}) {
  function update(i: number, patch: Partial<MarketingLink>) {
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }
  function remove(i: number) {
    onChange(links.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...links, { id: genId("link"), label: "", url: "", order: links.length, visible: true }]);
  }

  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <div className="space-y-2">
        {links.map((l, i) => (
          <div key={l.id} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50/60 p-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <input
                type="text"
                value={l.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="Nhãn hiển thị"
                className={inputClass}
              />
              <input
                type="text"
                value={l.url}
                onChange={(e) => update(i, { url: e.target.value })}
                placeholder="Đường link"
                className={inputClass}
              />
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={l.visible}
                  onChange={(e) => update(i, { visible: e.target.checked })}
                  className="h-3.5 w-3.5 rounded border-gray-300"
                />
                Hiển thị trên Portal
              </label>
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-1 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Xoá link"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-brand-blue hover:text-brand-blue"
      >
        <Plus className="h-3.5 w-3.5" />
        Thêm liên kết
      </button>
    </div>
  );
}
