"use client";

import Link from "next/link";
import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "./EditModeContext";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { getSubProjectSurface } from "./subProjectPalette";
import { SubProjectsAdminPanel } from "./SubProjectsAdminPanel";
import type { SubProjectRow } from "@/lib/portal/live-subprojects";

/**
 * "Các dự án con" — THAY THẾ `SubProjectsGrid` tĩnh cũ (đọc `eco.subProjects`)
 * bằng bảng `ecosystem_subprojects` sống, cùng pattern
 * `EcosystemArticlesSection.tsx`: 1 `useCollection()` DUY NHẤT chia sẻ
 * giữa lưới hiển thị (mọi lúc) và `SubProjectsAdminPanel` (CRUD, chỉ khi
 * `editMode=true`).
 *
 * Màu mỗi thẻ suy ra từ VỊ TRÍ trong danh sách đã Published+sắp
 * `displayOrder` (`getSubProjectSurface(index)`) — không lưu `colorIndex`
 * riêng, xem `live-subprojects.ts`.
 */
export function SubProjectsSection({
  allSeed,
  ecosystemId,
  ecosystemSlug,
  ecosystemName,
}: {
  allSeed: SubProjectRow[];
  ecosystemId: string;
  ecosystemSlug: string;
  ecosystemName: string;
}) {
  const editMode = useEditMode();
  const { items, add, update, remove } = useCollection<SubProjectRow>("ecosystem-subprojects", allSeed, {
    enabled: editMode,
  });

  const scoped = items.filter((s) => s.ecosystemId === ecosystemId);
  const published = scoped.filter((s) => s.status === "Published").sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section id="du-an-con">
      <SectionHeader eyebrow="Dự án con" title="Các dự án con" />
      {published.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((p, i) => {
            const surface = getSubProjectSurface(i);
            return (
              <Link
                key={p.id}
                href={`/portal/duan-cohoi/${ecosystemSlug}/${p.slug}`}
                className={`block overflow-hidden rounded-2xl border p-5 shadow-token-sm transition hover:-translate-y-1 hover:shadow-token-lg ${surface.card}`}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-sm ${surface.chip}`}>
                  🧩
                </div>
                <p className="gemos-card-title text-sm font-bold text-gray-900">{p.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{p.shortDescription}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <GemCard>
          <p className="text-sm text-gray-500">
            Chưa có dự án con thật nào cho {ecosystemName} — mình chưa có nội dung thật đủ chi tiết để tách theo
            từng dự án con, nên chưa hiển thị mục này thay vì bịa tên dự án.
          </p>
        </GemCard>
      )}
      {editMode && (
        <SubProjectsAdminPanel subProjects={scoped} ecosystemId={ecosystemId} add={add} update={update} remove={remove} />
      )}
    </section>
  );
}
