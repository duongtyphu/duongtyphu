"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import { useEditMode } from "./EditModeContext";
import { useEcosystemChrome } from "./EcosystemChromeContext";
import { MarketingLinksFieldEditor } from "./MarketingLinksFieldEditor";
import type { MarketingLink } from "@/data/portal/ecosystems";

/**
 * "Link tải tài liệu" (mở rộng riêng, theo yêu cầu Founder — nằm dưới
 * "Video dự án") — đọc/ghi `chrome.documents` qua `useEcosystemChrome()`.
 * Byte-for-byte cùng cơ chế `EcosystemLinksBox.tsx`/`EcosystemVideosBox.tsx`
 * (staging cục bộ + nút "Lưu" tường minh), chỉ khác cách hiển thị (nút
 * tải xuống thay vì nút điều hướng thường/nhúng video).
 */
export function EcosystemDocumentsBox({
  id = "link-tai-tai-lieu",
  title = "Link tải tài liệu",
}: {
  id?: string;
  title?: string;
}) {
  const editMode = useEditMode();
  const { chrome, update } = useEcosystemChrome();
  const documents = chrome.documents;
  const visible = documents.filter((d) => d.visible).sort((a, b) => a.order - b.order);

  const [draft, setDraft] = useState<MarketingLink[]>(documents);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(documents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrome.id, documents]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(documents);

  async function handleSave() {
    setSaveState("saving");
    try {
      await update(chrome.id, { documents: draft });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <section id={id}>
      <SectionHeader eyebrow="Tài liệu" title={title} />

      {!editMode ? (
        visible.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {visible.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-4 text-sm font-semibold text-gray-900 shadow-token-sm transition hover:border-blue-300"
              >
                {d.label || "Tải tài liệu"}
                <Download className="h-4 w-4 shrink-0 text-gray-400" />
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
            <p className="text-sm text-gray-500">Chưa có tài liệu nào ở đây, sẽ cập nhật khi có.</p>
          </div>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/40 p-4">
          <MarketingLinksFieldEditor links={draft} onChange={setDraft} label="Các tài liệu (nhãn + link tải)" />
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
