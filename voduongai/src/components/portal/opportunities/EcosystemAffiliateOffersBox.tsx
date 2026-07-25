"use client";

import { useEffect, useState } from "react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import { useEditMode } from "./EditModeContext";
import { useEcosystemChrome } from "./EcosystemChromeContext";
import { MarketingLinksFieldEditor } from "./MarketingLinksFieldEditor";
import type { MarketingLink } from "@/data/portal/ecosystems";

const CATEGORIES = ["Sàn TMĐT", "Khoá học", "Khác"] as const;

/**
 * "Các chương trình tiếp thị liên kết" (loại `structureType ===
 * "affiliate-list"`, chỉ `eco_blockchain`) — mở rộng riêng, "Lấy format
 * DigiU làm chuẩn áp dụng cho các dự án khác": THAY `AffiliateOffersList`
 * tĩnh cũ (đọc thẳng `eco.affiliateOffers`, không sửa được) bằng bản
 * Admin-editable qua `chrome.affiliateOffers`, cùng pattern draft+nút
 * "Lưu" đã dùng cho `EcosystemLinksBox`. Dùng chung shape `MarketingLink`
 * (không phải `AffiliateOffer` riêng) + `category` để tái dùng
 * `MarketingLinksFieldEditor` (prop `categories`) — xem comment ở
 * `live-ecosystem-chrome.ts`. Portal thật giữ NGUYÊN visual cũ — mục chưa
 * có URL thật vẫn hiện tên+category + khung "Chưa có link tiếp thị thật"
 * (đúng nguyên tắc no-fake-data).
 */
export function EcosystemAffiliateOffersBox() {
  const editMode = useEditMode();
  const { chrome, update } = useEcosystemChrome();
  const offers = chrome.affiliateOffers ?? [];
  const visible = offers.filter((o) => o.visible).sort((a, b) => a.order - b.order);

  const [draft, setDraft] = useState<MarketingLink[]>(offers);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(offers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrome.id, offers]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(offers);

  async function handleSave() {
    setSaveState("saving");
    try {
      await update(chrome.id, { affiliateOffers: draft });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <section id="lien-ket-tiep-thi">
      <SectionHeader eyebrow="Danh sách" title="Các chương trình tiếp thị liên kết" />

      {!editMode ? (
        visible.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {visible.map((o) =>
              o.url ? (
                <a
                  key={o.id}
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-token-sm transition hover:border-blue-300"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{o.category}</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{o.label}</p>
                </a>
              ) : (
                <div key={o.id} className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{o.category}</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{o.label}</p>
                  <p className="mt-1 text-xs text-gray-500">Chưa có link tiếp thị thật cho mục này, sẽ cập nhật khi có.</p>
                </div>
              ),
            )}
          </div>
        ) : (
          <GemCard>
            <p className="text-sm text-gray-500">Chưa có chương trình tiếp thị liên kết nào ở đây, sẽ cập nhật khi có.</p>
          </GemCard>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/40 p-4">
          <MarketingLinksFieldEditor
            links={draft}
            onChange={setDraft}
            categories={CATEGORIES}
            label="Các chương trình (bỏ trống URL nếu chưa có link tiếp thị thật)"
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
