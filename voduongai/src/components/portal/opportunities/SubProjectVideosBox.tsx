"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import { toYouTubeEmbedUrl } from "@/lib/portal/videoEmbed";
import { useEditMode } from "./EditModeContext";
import { useSubProjectChrome } from "./SubProjectChromeContext";
import { MarketingLinksFieldEditor } from "./MarketingLinksFieldEditor";
import type { MarketingLink } from "@/data/portal/ecosystems";

/**
 * "Video dự án" cho DỰ ÁN CON — byte-for-byte cùng logic
 * `EcosystemVideosBox.tsx` (cấp hệ sinh thái chính), chỉ khác nguồn
 * Context (`useSubProjectChrome()`).
 */
export function SubProjectVideosBox({
  id = "video-du-an",
  title = "Video dự án",
}: {
  id?: string;
  title?: string;
}) {
  const editMode = useEditMode();
  const { sub, update } = useSubProjectChrome();
  // `?? []` — cùng bug/lý do đã sửa ở EcosystemVideosBox.tsx: raw jsonb
  // fetch trả `undefined` cho dòng chưa có key `videos`, không phải mảng
  // rỗng — `.filter()` trên `undefined` crash trang.
  const videos = sub.videos ?? [];
  const visible = videos.filter((v) => v.visible).sort((a, b) => a.order - b.order);

  const [draft, setDraft] = useState<MarketingLink[]>(videos);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(videos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub.id, videos]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(videos);

  async function handleSave() {
    setSaveState("saving");
    try {
      await update(sub.id, { videos: draft });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <section id={id}>
      <SectionHeader eyebrow="Video" title={title} />

      {!editMode ? (
        visible.length > 0 ? (
          <div className="space-y-4">
            {visible.map((v) => {
              const embedUrl = toYouTubeEmbedUrl(v.url);
              return (
                <div
                  key={v.id}
                  className="mx-auto w-[90%] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-token-sm"
                >
                  {embedUrl ? (
                    <div className="aspect-video w-full">
                      <iframe
                        src={embedUrl}
                        title={v.label || title}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex aspect-video w-full items-center justify-center bg-gray-50 text-sm font-semibold text-brand-blue hover:underline"
                    >
                      Mở video ↗
                    </a>
                  )}
                  {v.label && <p className="px-4 py-3 text-sm font-semibold text-gray-900">{v.label}</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <GemCard>
            <p className="text-sm text-gray-500">Chưa có video nào ở đây, sẽ cập nhật khi có.</p>
          </GemCard>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/40 p-4">
          <MarketingLinksFieldEditor links={draft} onChange={setDraft} label="Các video (nhãn tuỳ chọn + link YouTube)" />
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
