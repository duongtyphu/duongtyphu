"use client";

import { ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { useEditMode } from "./EditModeContext";
import { useSubProjectChrome } from "./SubProjectChromeContext";
import { MarketingLinksFieldEditor } from "./MarketingLinksFieldEditor";
import type { MarketingLink } from "@/data/portal/ecosystems";

/**
 * "Đường link liên kết dự án" (đăng ký...) cho DỰ ÁN CON — thay
 * `<MarketingLinkBox links={sub.links}/>` tĩnh cũ. Đọc/ghi qua
 * `useSubProjectChrome()` (Context dùng chung với `SubProjectOverview`,
 * cùng 1 dòng `ecosystem_subprojects`) — byte-for-byte cùng logic
 * `EcosystemLinksBox.tsx` (cấp hệ sinh thái chính), chỉ khác nguồn Context.
 */
export function SubProjectLinksBox({
  id = "lien-ket-tiep-thi",
  title = "Đường link liên kết / đăng ký",
}: {
  id?: string;
  title?: string;
}) {
  const editMode = useEditMode();
  const { sub, update } = useSubProjectChrome();
  const links = sub.links;
  const visible = links.filter((l) => l.visible).sort((a, b) => a.order - b.order);

  function save(next: MarketingLink[]) {
    update(sub.id, { links: next });
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
          <MarketingLinksFieldEditor links={links} onChange={save} label="Các link (thêm/sửa/xoá)" />
        </div>
      )}
    </section>
  );
}
