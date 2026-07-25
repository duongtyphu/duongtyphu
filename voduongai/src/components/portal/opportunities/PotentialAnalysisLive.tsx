"use client";

import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";
import { useEditMode } from "./EditModeContext";
import { EditableRegion } from "./EditableRegion";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { DEFAULT_POTENTIAL_ANALYSIS } from "@/data/portal/ecosystems";
import type { EcosystemRatingRow } from "@/lib/portal/live-ecosystem-ratings";
import { STATUS_STYLE, STATUS_ICON, statusBadgeLabel } from "./PotentialAnalysisTable";

/**
 * "Đánh giá" (Phân tích tiềm năng) — bản LIVE-EDIT, thay `PotentialAnalysisTable`
 * (bản đọc tĩnh, giữ lại làm fallback) trên trang chi tiết hệ sinh thái VÀ
 * dự án con thật. 6 tiêu chí GIỮ NGUYÊN cố định (Founder chọn "chỉ đổi
 * trạng thái, không tự thêm/sửa/xoá tiêu chí") — chỉ trạng thái/sao/lý
 * do/ghi chú mỗi tiêu chí sửa được, qua đúng `EditableRegion` (pattern Cách
 * A đã dùng cho `name`/`shortDescription` ở `EcosystemOverview.tsx`).
 *
 * `entityId` = `eco.id` (hệ sinh thái) hoặc `sub.id` (dự án con) — bảng
 * `ecosystem_ratings` dùng CHUNG cho cả 2 cấp, lọc theo field này.
 *
 * Mọi dòng đã được pre-seed sẵn (migration supabase-phase20) cho 10 thực
 * thể hiện có, nên `update()` luôn tìm thấy dòng có sẵn. Với hệ sinh thái/
 * dự án con MỚI thêm sau này (chưa có dòng seed) — `saveCriterion()` tự
 * `add()` dòng mới thay vì `update()`, để tính năng vẫn hoạt động đúng
 * khi mở rộng hệ sinh thái 6, 7, 8... mà không cần chạy lại migration.
 */
const RATING_FIELDS: FieldConfig[] = [
  {
    key: "ratingStatus",
    label: "Trạng thái",
    type: "select",
    options: ["not-assessed", "met", "not-met"],
    required: true,
  },
  { key: "stars", label: "Mức sao (chỉ dùng khi Đạt) — nhập 1 đến 5", type: "number" },
  {
    key: "notMetReason",
    label: "Lý do chưa đạt (chỉ dùng khi Chưa đạt)",
    type: "select",
    options: ["", "thieu-thong-tin", "dang-tham-dinh"],
  },
  { key: "note", label: "Ghi chú thêm", type: "textarea", full: true },
];

export function PotentialAnalysisLive({
  entityId,
  seedRows,
  id = "phan-tich-tiem-nang",
  title = "Phân tích tiềm năng",
}: {
  entityId: string;
  seedRows: EcosystemRatingRow[];
  id?: string;
  title?: string;
}) {
  const editMode = useEditMode();
  const { items, update, add } = useCollection<EcosystemRatingRow>("ecosystem-ratings", seedRows, {
    enabled: editMode,
  });
  const myRows = items.filter((r) => r.entityId === entityId);

  async function saveCriterion(rowId: string, patch: Partial<EcosystemRatingRow>) {
    const existing = myRows.find((r) => r.id === rowId);
    if (existing) {
      await update(rowId, patch);
      return;
    }
    const criterionId = rowId.slice(entityId.length + 2);
    await add({
      id: rowId,
      status: "Published",
      entityId,
      criterionId,
      ratingStatus: "not-assessed",
      ...patch,
    } as EcosystemRatingRow);
  }

  return (
    <section id={id}>
      <SectionHeader
        eyebrow="Đánh giá"
        title={title}
        description="Bảng tiêu chí đánh giá chung — mọi dòng hiện 'Chưa đánh giá' cho tới khi có đánh giá thật cụ thể."
      />
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-token-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 font-semibold text-gray-900">Tiêu chí</th>
              <th className="px-4 py-3 font-semibold text-gray-900">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_POTENTIAL_ANALYSIS.map((criterion) => {
              const rowId = `${entityId}__${criterion.id}`;
              const row = myRows.find((r) => r.id === rowId);
              const display = row
                ? { status: row.ratingStatus, stars: row.stars, notMetReason: row.notMetReason, note: row.note }
                : { status: criterion.status, stars: criterion.stars, notMetReason: criterion.notMetReason, note: criterion.note };
              const Icon = STATUS_ICON[display.status];
              const badge = (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[display.status]}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {statusBadgeLabel(display)}
                </span>
              );
              const editRecord: EcosystemRatingRow =
                row ?? {
                  id: rowId,
                  status: "Published",
                  entityId,
                  criterionId: criterion.id,
                  ratingStatus: "not-assessed",
                };
              return (
                <tr key={criterion.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 align-top text-gray-700">
                    {criterion.criterion}
                    {display.note ? <p className="mt-1 text-xs text-gray-400">{display.note}</p> : null}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <EditableRegion record={editRecord} fields={RATING_FIELDS} update={saveCriterion} as="span">
                      {badge}
                    </EditableRegion>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
