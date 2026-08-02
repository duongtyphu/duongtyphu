/**
 * SPRINT R02 — CKOS & Platform Data Integration: Knowledge Resolver (Phần 2).
 *
 * `resolveKnowledgeNeed()` — Input: `KnowledgeNeed` (A05,
 * `ai/knowledge/knowledge-need.ts`) + `KnowledgeCatalog` (Phần 1) +
 * quyền truy cập của người dùng hiện tại. Output: `KnowledgeResolution`.
 *
 * Đính chính đặt tên: brief gọi output của Resolver là "KnowledgePackage"
 * — đặt tên `KnowledgeResolution` ở đây để KHÔNG trùng với type
 * `KnowledgePackage` (Phần 5, `knowledge-package.ts`) — đó mới là type
 * cuối cùng `CompanionPromptBuilder` thực sự đọc (Phần 6). Resolver chỉ
 * dựng phần "thô": các mục khớp + khu vực + nguồn + phần chưa giải quyết
 * được — `buildKnowledgePackage()` (Phần 5) mới gộp/phân loại thành hình
 * dạng cuối.
 *
 * TUYỆT ĐỐI THUẦN — chỉ đọc `catalog` (mảng đã có sẵn, do nơi gọi cung
 * cấp) + `knowledgeNeed`/`permissions` truyền vào. KHÔNG đọc Supabase/
 * Database, KHÔNG RAG/Embedding/Vector DB/Semantic Search, KHÔNG tự tìm
 * Internet, KHÔNG gọi AI/LLM nào.
 *
 * RULE PERMISSION (Phần 7, bắt buộc — không bypass):
 * - Chỉ lấy `published === true`.
 * - `visibility === "internal"` → LOẠI BỎ TUYỆT ĐỐI, không có `permissions`
 *   nào mở khoá được (đúng "Không đọc Internal").
 * - `visibility === "premium"` → chỉ lấy nếu `permissions.hasPremiumAccess`.
 * - `visibility === "public"` → luôn lấy (nếu khớp nhu cầu).
 */

import type { KnowledgeNeed } from "../knowledge/knowledge-need";
import { type KnowledgeSource, sortSourcesByPriority } from "../knowledge/knowledge-source";
import type { CatalogEntry, CatalogWorkspace, KnowledgeCatalog } from "./knowledge-catalog";
import { selectByPriority } from "./content-selection";

export type KnowledgeResolverPermissions = {
  /** Người dùng hiện tại có quyền xem nội dung Premium hay không — do nơi
      gọi xác định (Resolver không tự kiểm tra quyền/đọc DB nào). */
  hasPremiumAccess: boolean;
};

export type KnowledgeResolution = {
  matchedItems: CatalogEntry[];
  /** `CatalogWorkspace` (= id `PlatformNode` tương ứng) của các mục đã
      khớp — mảng rỗng nếu không có mục nào khớp. */
  matchedAreas: CatalogWorkspace[];
  matchedSources: KnowledgeSource[];
  /** Lý do/câu hỏi chưa giải quyết được — kế thừa
      `KnowledgeNeed.missingInformation` (A05) + ghi chú trung thực nếu
      Catalog không có mục nào khớp. */
  unresolvedNeed: string[];
  /** Số mục khớp nhu cầu nhưng bị loại vì thiếu quyền Premium — dùng để
      dựng cảnh báo minh bạch ở `warnings` (Phần 5), KHÔNG lộ nội dung. */
  excludedByPermissionCount: number;
  /** FIX-R02 (Phần 3, phục vụ `MentorContext.confidence`) — kế thừa trực
      tiếp `knowledgeNeed.confidence` (A05); `0` khi `knowledgeNeed = null`
      (chưa có Goal). Không tự tính lại. */
  confidence: number;
};

const WORKSPACE_TO_SOURCE: Record<CatalogWorkspace, KnowledgeSource> = {
  ckos: "ckos",
  "hoc-vien-ai": "academy",
  premium: "premium",
  "ai-workspace": "workspace",
  "du-an-co-hoi": "projects",
  "cong-dong": "community",
};

function isAccessible(entry: CatalogEntry, permissions: KnowledgeResolverPermissions): boolean {
  if (!entry.published) return false;
  if (entry.visibility === "internal") return false;
  if (entry.visibility === "premium") return permissions.hasPremiumAccess;
  return true; // "public"
}

/**
 * Khớp nhu cầu: `knowledgeType` phải nằm trong `knowledgeNeed.knowledgeTypes`;
 * nếu `knowledgeNeed.requiredPlatformAreas` không rỗng, `workspace` phải
 * nằm trong danh sách đó (A05 đã suy khu vực từ Goal — tái dùng nguyên,
 * không tính lại); nếu `entry.goalCategories` không rỗng, phải chứa đúng
 * `knowledgeNeed.goal.category` (field vốn có sẵn nhưng chưa dùng ở A05 —
 * cho nó ý nghĩa thật thay vì chỉ lưu trữ, không mở rộng logic mới nào
 * ngoài so khớp trực tiếp).
 */
function matchesNeed(entry: CatalogEntry, knowledgeNeed: KnowledgeNeed): boolean {
  if (!knowledgeNeed.knowledgeTypes.includes(entry.knowledgeType)) return false;
  if (knowledgeNeed.requiredPlatformAreas.length > 0 && !knowledgeNeed.requiredPlatformAreas.includes(entry.workspace)) {
    return false;
  }
  if (entry.goalCategories.length > 0 && !entry.goalCategories.includes(knowledgeNeed.goal.category)) {
    return false;
  }
  return true;
}

/**
 * Helper thuần — dựng `KnowledgeResolution` từ Catalog + nhu cầu + quyền
 * truy cập. `knowledgeNeed = null` (chưa có Goal → A05 không tính được nhu
 * cầu) → trả về resolution rỗng trung thực, KHÔNG đoán nhu cầu chung
 * chung. Không mutate `catalog` truyền vào, deterministic.
 */
export function resolveKnowledgeNeed(
  catalog: KnowledgeCatalog,
  knowledgeNeed: KnowledgeNeed | null,
  permissions: KnowledgeResolverPermissions
): KnowledgeResolution {
  if (!knowledgeNeed) {
    return {
      matchedItems: [],
      matchedAreas: [],
      matchedSources: [],
      unresolvedNeed: ["Chưa xác định được mục tiêu — chưa có nhu cầu tri thức cụ thể để tra cứu Catalog."],
      excludedByPermissionCount: 0,
      confidence: 0,
    };
  }

  let excludedByPermissionCount = 0;
  const candidates: CatalogEntry[] = [];

  for (const entry of catalog) {
    if (!matchesNeed(entry, knowledgeNeed)) continue;
    if (!isAccessible(entry, permissions)) {
      if (entry.published && entry.visibility === "premium") excludedByPermissionCount += 1;
      continue;
    }
    candidates.push(entry);
  }

  const matchedItems = selectByPriority(candidates);
  const matchedAreas = Array.from(new Set(matchedItems.map((entry) => entry.workspace)));
  const matchedSources = sortSourcesByPriority(matchedAreas.map((workspace) => WORKSPACE_TO_SOURCE[workspace]));

  const unresolvedNeed = [...knowledgeNeed.missingInformation];
  if (matchedItems.length === 0) {
    unresolvedNeed.push("Không tìm thấy tri thức đã Publish nào khớp trong Catalog cho nhu cầu này.");
  }

  return {
    matchedItems,
    matchedAreas,
    matchedSources,
    unresolvedNeed,
    excludedByPermissionCount,
    confidence: knowledgeNeed.confidence,
  };
}
