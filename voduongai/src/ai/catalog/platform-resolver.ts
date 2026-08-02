/**
 * SPRINT R02 — CKOS & Platform Data Integration: Platform Resolver (Phần 3).
 *
 * Companion "biết" 6 khu vực nền tảng (Học viện AI, CKOS, Premium, AI
 * Workspace, Dự án & Cơ hội, Community) nhưng KHÔNG tự đọc Database —
 * `summarizePlatformAreas()` CHỈ làm việc với `KnowledgeCatalog` đã có
 * sẵn (do nơi gọi cung cấp), tương tự Resolver ở Phần 2. Tên khu vực tái
 * dùng NGUYÊN `PlatformNode.name` đã có ở A05 (`ai/platform/platform-tree.ts`)
 * — không đặt tên hiển thị mới.
 */

import { getPlatformNode } from "../platform/platform-tree";
import type { KnowledgeType } from "../knowledge/knowledge-types";
import { CATALOG_WORKSPACES, type CatalogWorkspace, type KnowledgeCatalog } from "./knowledge-catalog";

export type PlatformAreaSummary = {
  areaId: CatalogWorkspace;
  areaName: string;
  /** Chỉ đếm mục `published === true` — đúng nguyên tắc Companion chỉ
      "biết" tới nội dung đã Publish. */
  itemCount: number;
  knowledgeTypes: KnowledgeType[];
};

/** Helper thuần — tổng hợp Catalog theo từng khu vực nền tảng Companion
    biết tới. Không đọc DB, không mutate `catalog` truyền vào,
    deterministic. */
export function summarizePlatformAreas(catalog: KnowledgeCatalog): PlatformAreaSummary[] {
  return CATALOG_WORKSPACES.map((areaId) => {
    const publishedItems = catalog.filter((entry) => entry.workspace === areaId && entry.published);
    return {
      areaId,
      areaName: getPlatformNode(areaId)?.name ?? areaId,
      itemCount: publishedItems.length,
      knowledgeTypes: Array.from(new Set(publishedItems.map((entry) => entry.knowledgeType))),
    };
  });
}
