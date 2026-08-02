/**
 * SPRINT R02 — CKOS & Platform Data Integration: Knowledge Catalog.
 *
 * `src/ai/catalog/` là namespace MỚI, đứng trên `src/ai/mentor/`/
 * `src/ai/platform/`/`src/ai/knowledge/` (A02-A05, "Companion Brain" —
 * KHÔNG sửa các file đó ở Sprint này). CHỈ định nghĩa SHAPE dữ liệu +
 * helper thuần cho `KnowledgeCatalog` — KHÔNG I/O, KHÔNG đọc
 * Supabase/Database, KHÔNG RAG/Embedding/Vector/Semantic Search.
 *
 * `KnowledgeCatalog` CHỈ chứa METADATA (đúng yêu cầu Phần 1) — KHÔNG bao
 * giờ chứa nội dung bài viết/markdown. Catalog PHẢI do nơi gọi
 * (route.ts/1 adapter riêng) cung cấp sẵn, đã lọc Published — namespace
 * này không tự đi lấy dữ liệu.
 *
 * Đính chính so với brief gốc (Phần 1 liệt kê cả `type` VÀ `knowledgeType`
 * làm 2 field riêng, có ghi "Ví dụ:" — coi là minh hoạ, không phải literal
 * spec bắt buộc 2 field trùng ý nghĩa): gộp thành ĐÚNG 1 field
 * `knowledgeType`, tái dùng NGUYÊN `KnowledgeType` đã có ở A05
 * (`ai/knowledge/knowledge-types.ts`) — tránh bịa thêm 1 taxonomy song
 * song không cần thiết, đúng nguyên tắc Reuse First.
 */

import type { KnowledgeType } from "../knowledge/knowledge-types";
import type { GoalCategory } from "../mentor/goal";

/**
 * "Workspace" — khu vực nền tảng chứa nội dung này. Giá trị TRÙNG ĐÚNG id
 * của `PlatformNode` tương ứng ở `ai/platform/platform-tree.ts` (không
 * bịa taxonomy song song) — 6 khu vực Companion "biết" theo đúng Phần 3.
 */
export type CatalogWorkspace = "ckos" | "hoc-vien-ai" | "premium" | "ai-workspace" | "du-an-co-hoi" | "cong-dong";

export const CATALOG_WORKSPACES: readonly CatalogWorkspace[] = [
  "ckos",
  "hoc-vien-ai",
  "premium",
  "ai-workspace",
  "du-an-co-hoi",
  "cong-dong",
];

export function isCatalogWorkspace(value: string): value is CatalogWorkspace {
  return (CATALOG_WORKSPACES as readonly string[]).includes(value);
}

/**
 * "Visibility" — đúng 3 giá trị cần cho Permission (Phần 7): `public`
 * (ai cũng xem được), `premium` (cần quyền — đã mua), `internal` (KHÔNG
 * BAO GIỜ lộ ra Companion dù có quyền gì — dữ liệu nội bộ Admin). "Draft"/
 * "Deleted" KHÔNG phải giá trị `visibility` — đó là trạng thái publish,
 * đã tách riêng thành field `published` (Catalog chỉ nên chứa dòng đã
 * Published ngay từ khâu dựng Catalog; `published` vẫn giữ lại làm lớp
 * phòng thủ thứ 2, xem `knowledge-resolver.ts`).
 */
export type CatalogVisibility = "public" | "premium" | "internal";

export const CATALOG_VISIBILITIES: readonly CatalogVisibility[] = ["public", "premium", "internal"];

export function isCatalogVisibility(value: string): value is CatalogVisibility {
  return (CATALOG_VISIBILITIES as readonly string[]).includes(value);
}

/**
 * 1 mục trong Knowledge Catalog — CHỈ metadata (đúng field Phần 1, đã gộp
 * `type`/`knowledgeType`, xem ghi chú đầu file): `id`, `title`,
 * `workspace`, `visibility`, `published`, `knowledgeType`,
 * `goalCategories`, `tags`, `url`.
 */
export type CatalogEntry = {
  id: string;
  title: string;
  workspace: CatalogWorkspace;
  visibility: CatalogVisibility;
  published: boolean;
  knowledgeType: KnowledgeType;
  /** Nhóm mục tiêu nội dung này phục vụ — mảng rỗng nghĩa là nội dung
      chung, không gắn riêng 1 nhóm mục tiêu nào (vd. tài liệu tổng quan). */
  goalCategories: GoalCategory[];
  tags: string[];
  /** Đường dẫn Portal thật — KHÔNG phải nội dung, chỉ là điểm điều hướng. */
  url: string;
};

export type KnowledgeCatalog = CatalogEntry[];

/** Helper thuần dựng 1 `CatalogEntry` — không side-effect, không lưu trữ,
    tiện cho test/adapter tương lai. `goalCategories`/`tags` mặc định mảng
    rỗng nếu không truyền. */
export function createCatalogEntry(input: {
  id: string;
  title: string;
  workspace: CatalogWorkspace;
  visibility: CatalogVisibility;
  published: boolean;
  knowledgeType: KnowledgeType;
  goalCategories?: GoalCategory[];
  tags?: string[];
  url: string;
}): CatalogEntry {
  return {
    id: input.id,
    title: input.title,
    workspace: input.workspace,
    visibility: input.visibility,
    published: input.published,
    knowledgeType: input.knowledgeType,
    goalCategories: input.goalCategories ?? [],
    tags: input.tags ?? [],
    url: input.url,
  };
}
