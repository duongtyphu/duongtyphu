"use client";

import { useEffect, useState } from "react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import { useEditMode } from "./EditModeContext";
import { useEcosystemChrome } from "./EcosystemChromeContext";
import { MarketingLinksFieldEditor } from "./MarketingLinksFieldEditor";
import type { MarketingLink } from "@/data/portal/ecosystems";

/**
 * "Các sàn giao dịch" (loại `structureType === "exchange-list"`, chỉ
 * `eco_trading`) — mở rộng riêng, "Lấy format DigiU làm chuẩn áp dụng cho
 * các dự án khác": THAY `ExchangesList` tĩnh cũ (đọc thẳng `eco.exchanges`,
 * không sửa được) bằng bản Admin-editable qua `chrome.exchanges`, cùng
 * pattern draft+nút "Lưu" đã dùng cho `EcosystemLinksBox`. Portal thật
 * (`editMode=false`) giữ NGUYÊN visual cũ — sàn chưa có URL thật vẫn hiện
 * tên + khung "Chưa có link tiếp thị thật" (đúng nguyên tắc no-fake-data),
 * KHÔNG lọc theo URL như `EcosystemLinksBox` (đó là lý do dùng
 * `toLinks(..., false)` ở lớp fetch — xem `live-ecosystem-chrome.ts`).
 */
export function EcosystemExchangesBox() {
  const editMode = useEditMode();
  const { chrome, update } = useEcosystemChrome();
  const exchanges = chrome.exchanges ?? [];
  const visible = exchanges.filter((x) => x.visible).sort((a, b) => a.order - b.order);

  const [draft, setDraft] = useState<MarketingLink[]>(exchanges);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(exchanges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrome.id, exchanges]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(exchanges);

  async function handleSave() {
    setSaveState("saving");
    try {
      await update(chrome.id, { exchanges: draft });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <section id="lien-ket-tiep-thi">
      <SectionHeader eyebrow="Danh sách" title="Các sàn giao dịch" />

      {!editMode ? (
        visible.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((x) =>
              x.url ? (
                <a
                  key={x.id}
                  href={x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-100 bg-white p-4 text-sm font-bold text-gray-900 shadow-token-sm transition hover:border-blue-300"
                >
                  {x.label}
                </a>
              ) : (
                <div key={x.id} className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
                  <p className="text-sm font-bold text-gray-900">{x.label}</p>
                  <p className="mt-1 text-xs text-gray-500">Chưa có link tiếp thị thật, sẽ cập nhật khi có.</p>
                </div>
              ),
            )}
          </div>
        ) : (
          <GemCard>
            <p className="text-sm text-gray-500">Chưa có sàn giao dịch nào ở đây, sẽ cập nhật khi có.</p>
          </GemCard>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/40 p-4">
          <MarketingLinksFieldEditor
            links={draft}
            onChange={setDraft}
            label="Các sàn giao dịch (bỏ trống URL nếu chưa có link tiếp thị thật)"
          />
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
