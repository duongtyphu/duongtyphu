"use client";

import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "./EditModeContext";
import { ArticleTicker } from "./ArticleTicker";
import { ArticlesAdminPanel } from "./ArticlesAdminPanel";
import type { EcosystemArticleRow } from "@/lib/portal/live-ecosystem-articles";

/**
 * "Cập nhật thông tin mới" — 1 `useCollection()` DUY NHẤT chia sẻ giữa
 * `ArticleTicker` (hiển thị, mọi lúc) và `ArticlesAdminPanel` (CRUD, chỉ
 * khi `editMode=true`) — tránh 2 instance không đồng bộ sau khi Lưu/Xoá
 * (cùng lý do `PremiumChromeContext` chia sẻ 1 `useCollection()` cho nhiều
 * vị trí hiển thị).
 *
 * `seed` PHẢI là toàn bộ bảng `ecosystem_articles` (mọi hệ sinh thái/dự án
 * con) — đúng "seed IS the live data": khi `editMode=true`,
 * `useCollection()` fetch RAW qua route generic (trả về TẤT CẢ dòng, không
 * lọc theo scope), nên lọc theo `ecosystemId`/`subProjectId` PHẢI làm
 * trong chính component này (không phải ở lớp fetch server) để seed/fetch
 * luôn cùng shape.
 */
export function EcosystemArticlesSection({
  allSeed,
  ecosystemId,
  ecosystemSlug,
  subProjectId = "",
  sectionId,
  eyebrow,
  title,
}: {
  allSeed: EcosystemArticleRow[];
  ecosystemId: string;
  ecosystemSlug: string;
  subProjectId?: string;
  sectionId?: string;
  eyebrow?: string;
  title?: string;
}) {
  const editMode = useEditMode();
  const { items, add, update, remove } = useCollection<EcosystemArticleRow>("ecosystem-articles", allSeed, {
    enabled: editMode,
  });

  const scoped = items.filter((a) => a.ecosystemId === ecosystemId && a.subProjectId === subProjectId);
  const published = scoped.filter((a) => a.status === "Published").sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <ArticleTicker articles={published} ecosystemSlug={ecosystemSlug} sectionId={sectionId} eyebrow={eyebrow} title={title} />
      {editMode && (
        <ArticlesAdminPanel
          articles={scoped}
          ecosystemId={ecosystemId}
          subProjectId={subProjectId}
          add={add}
          update={update}
          remove={remove}
        />
      )}
    </div>
  );
}
