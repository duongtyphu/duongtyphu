import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { PotentialAnalysisStatus, NotMetReason } from "@/data/portal/ecosystems";

/**
 * "Đánh giá" (Phân tích tiềm năng) — trạng thái theo tiêu chí, dùng chung
 * cho MỌI hệ sinh thái/dự án con (bảng `ecosystem_ratings`, khoá theo
 * `${entityId}__${criterionId}`, 6 tiêu chí cố định trong
 * `DEFAULT_POTENTIAL_ANALYSIS`, ecosystems.ts). Founder chốt: Admin CHỈ
 * đổi trạng thái, không tự thêm/sửa/xoá tiêu chí — nên mọi dòng đã được
 * pre-seed sẵn (migration supabase-phase20), `update()` luôn tìm thấy
 * dòng có sẵn, không cần add()/upsert.
 *
 * QUAN TRỌNG: field tri-state đặt tên "ratingStatus" bên trong `data`
 * (KHÔNG phải "status") — xem chú thích trong file migration để biết vì
 * sao (tránh trùng tên với cột `status` Draft/Published ngoài `data`).
 */
export type EcosystemRatingRow = {
  id: string;
  /** Draft/Published/Hidden của route generic — dòng rating luôn giữ
   * "Published" (Admin không thao tác trường này qua UI rating). */
  status: string;
  entityId: string;
  criterionId: string;
  ratingStatus: PotentialAnalysisStatus;
  stars?: number;
  notMetReason?: NotMetReason;
  note?: string;
};

function toRow(row: { id: string; data: unknown; status: string }): EcosystemRatingRow {
  const d = (row.data ?? {}) as Record<string, unknown>;
  const ratingStatus: PotentialAnalysisStatus =
    d.ratingStatus === "met" || d.ratingStatus === "not-met" ? d.ratingStatus : "not-assessed";
  const stars = typeof d.stars === "number" && d.stars >= 1 && d.stars <= 5 ? d.stars : undefined;
  const notMetReason =
    d.notMetReason === "thieu-thong-tin" || d.notMetReason === "dang-tham-dinh" ? d.notMetReason : undefined;
  return {
    id: row.id,
    status: row.status,
    entityId: typeof d.entityId === "string" ? d.entityId : "",
    criterionId: typeof d.criterionId === "string" ? d.criterionId : "",
    ratingStatus,
    stars,
    notMetReason,
    note: typeof d.note === "string" ? d.note : undefined,
  };
}

/** Toàn bộ bảng (mọi thực thể) — dùng làm `seed` cho
 * `useCollection("ecosystem-ratings", ...)` (đúng "seed IS the live
 * data": raw shape khớp y hệt dữ liệu route generic sẽ fetch). */
export const getAllLiveEcosystemRatings = cache(async (): Promise<EcosystemRatingRow[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase.from("ecosystem_ratings").select("id, data, status");
  if (error || !data) return [];
  return data.map(toRow);
});

/** 6 dòng rating (khớp 6 tiêu chí cố định) của đúng 1 thực thể
 * (ecosystem.id hoặc subProject.id) — dùng làm `seed` truyền xuống Client
 * Component `PotentialAnalysisLive`. */
export async function getLiveEcosystemRatingRows(entityId: string): Promise<EcosystemRatingRow[]> {
  const all = await getAllLiveEcosystemRatings();
  return all.filter((r) => r.entityId === entityId);
}
