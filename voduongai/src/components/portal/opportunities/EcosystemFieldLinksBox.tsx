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
 * "Đường link liên kết — {tên mảng}" (loại `structureType === "two-field"`,
 * chỉ `eco_crypto` — 2 mảng cố định Blockchain/Crypto) — mở rộng riêng,
 * "Lấy format DigiU làm chuẩn áp dụng cho các dự án khác": THAY
 * `MarketingLinkBox` tĩnh cũ (đọc thẳng `field.marketingLinks`, không sửa
 * được) bằng bản Admin-editable qua `chrome.fieldLinks[fieldId]`, cùng
 * pattern draft+nút "Lưu" đã dùng cho `EcosystemLinksBox`. `fieldId` khớp
 * đúng `EcosystemFieldBox.id` tĩnh (`field_blockchain`/`field_crypto`) —
 * `name`/`description` của mảng vẫn tĩnh (ngoài phạm vi việc này, chỉ
 * phần LINK cần đồng bộ tính năng với DigiU).
 */
export function EcosystemFieldLinksBox({ fieldId, title }: { fieldId: string; title: string }) {
  const editMode = useEditMode();
  const { chrome, update } = useEcosystemChrome();
  const links = chrome.fieldLinks?.[fieldId] ?? [];
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
      await update(chrome.id, { fieldLinks: { ...chrome.fieldLinks, [fieldId]: draft } });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <section id={`lien-ket-tiep-thi-${fieldId}`}>
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
