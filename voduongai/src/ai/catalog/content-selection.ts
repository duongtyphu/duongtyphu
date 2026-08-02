/**
 * SPRINT R02 — CKOS & Platform Data Integration: Content Selection (Phần 4).
 *
 * Thứ tự ưu tiên CỐ ĐỊNH khi chọn nội dung giữa nhiều `CatalogEntry` khớp
 * cùng 1 nhu cầu: CKOS → Academy (Học viện AI) → Premium → Workspace (AI
 * Workspace) → Community → General Knowledge. "Không đảo thứ tự" — thứ tự
 * này là hằng số, không nơi nào khác được tự sắp xếp lại.
 *
 * Đính chính: brief liệt kê đúng 5 workspace có tên (CKOS/Academy/Premium/
 * Workspace/Community) — "Dự án & Cơ hội" (`du-an-co-hoi`, Phần 3 Companion
 * có biết tới) KHÔNG xuất hiện trong danh sách ưu tiên Phần 4. Xếp
 * `du-an-co-hoi` vào cùng bậc thấp nhất với "General Knowledge" (sau
 * Community) — không tự bịa thêm 1 bậc ưu tiên riêng không có trong brief.
 *
 * KHÔNG phải RAG/ranking theo độ liên quan (semantic score...) — chỉ sắp
 * xếp lại theo NHÓM workspace cố định, dùng `Array.prototype.sort` (stable
 * từ ES2019+) nên thứ tự gốc trong cùng 1 nhóm được giữ nguyên,
 * deterministic.
 */

import type { CatalogEntry, CatalogWorkspace } from "./knowledge-catalog";

/** Đúng thứ tự đã chốt ở Phần 4 — index nhỏ hơn = ưu tiên cao hơn. */
export const CONTENT_SELECTION_ORDER: readonly CatalogWorkspace[] = [
  "ckos",
  "hoc-vien-ai",
  "premium",
  "ai-workspace",
  "cong-dong",
];

function priorityRank(workspace: CatalogWorkspace): number {
  const index = CONTENT_SELECTION_ORDER.indexOf(workspace);
  // `du-an-co-hoi` (và bất kỳ workspace nào không có trong thứ tự đã chốt)
  // rơi vào bậc cuối cùng — cùng mức "General Knowledge".
  return index === -1 ? CONTENT_SELECTION_ORDER.length : index;
}

/** Sắp `entries` theo đúng Content Selection Order — trả mảng MỚI, không
    mutate input, deterministic (stable sort giữ nguyên thứ tự gốc trong
    cùng 1 bậc ưu tiên). */
export function selectByPriority(entries: readonly CatalogEntry[]): CatalogEntry[] {
  return [...entries].sort((a, b) => priorityRank(a.workspace) - priorityRank(b.workspace));
}
