"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import { useEditMode } from "./EditModeContext";
import { useEcosystemChrome } from "./EcosystemChromeContext";
import { MarketingLinksFieldEditor } from "./MarketingLinksFieldEditor";
import type { MarketingLink } from "@/data/portal/ecosystems";

/**
 * "Đường link liên kết dự án" (mở rộng riêng, theo yêu cầu Founder) —
 * THAY THẾ `MarketingLinkBox` tĩnh cho cấp hệ sinh thái (loại
 * `structureType === "sub-projects"`, nơi `eco.marketingLinks` từng
 * render trực tiếp). Đọc/ghi qua `useEcosystemChrome()` (Context dùng
 * chung với `EcosystemOverview`, cùng 1 dòng `ecosystem_chrome`).
 *
 * Portal thật (`editMode=false`) — hiển thị Y HỆT `MarketingLinkBox` cũ
 * (chỉ đọc, lọc `visible`, sắp theo `order`). Live-edit
 * (`editMode=true`) — dùng `MarketingLinksFieldEditor` dùng chung (thêm/
 * sửa/xoá/ẩn-hiện từng link), LUÔN hiện (không cần EditableRegion vì đây
 * là danh sách cần thêm/xoá, không phải 1 record đơn).
 *
 * BUG ĐÃ SỬA (Founder báo thiếu nút "Lưu"): trước đó `MarketingLinksFieldEditor`'s
 * `onChange` gọi thẳng `update()` (PATCH mạng) trên MỖI LẦN gõ phím —
 * không có staging cục bộ, không có nút Lưu tường minh, dễ gây cảm giác
 * "không lưu được"/giật lag khi gõ nhanh. Đổi sang staging cục bộ (`draft`)
 * + nút "Lưu" tường minh + `SaveStateBadge` (cùng cơ chế `EditableRegion`
 * đã dùng) — chỉ thật sự PATCH khi bấm Lưu.
 */
export function EcosystemLinksBox({
  id = "lien-ket-tiep-thi",
  title = "Đường link liên kết dự án",
}: {
  id?: string;
  title?: string;
}) {
  const editMode = useEditMode();
  const { chrome, update } = useEcosystemChrome();
  const links = chrome.links;
  const visible = links.filter((l) => l.visible).sort((a, b) => a.order - b.order);

  const [draft, setDraft] = useState<MarketingLink[]>(links);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(links);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrome.id, links]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(links);

  async function handleSave() {
    setSaveState("saving");
    try {
      await update(chrome.id, { links: draft });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <section id={id}>
      <SectionHeader eyebrow="Liên kết" title={title} />

      {!editMode ? (
        visible.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {visible.map((l) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-4 text-sm font-semibold text-gray-900 shadow-token-sm transition hover:border-blue-300"
              >
                {l.label}
                <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
            <p className="text-sm text-gray-500">Chưa có đường link nào ở đây, sẽ cập nhật khi có.</p>
          </div>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/40 p-4">
          <MarketingLinksFieldEditor links={draft} onChange={setDraft} label="Các link (thêm/sửa/xoá)" />
          <div className="mt-3 flex items-center justify-end gap-2">
            <SaveStateBadge state={saveState} isDirty={isDirty} />
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === "saving" || !isDirty}
              className="rounded-lg bg-brand-blue px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {saveState === "saving" ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
