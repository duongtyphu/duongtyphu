/**
 * SPRINT A05 — Platform Intelligence Foundation: Platform Context.
 *
 * `PlatformContext` mô tả Companion đang "đứng ở đâu" trong Knowledge Tree
 * và khu vực nào liên quan/nên khám phá tiếp — CHỈ suy từ cấu trúc tree
 * tĩnh (`platform-tree.ts`), KHÔNG đọc Portal/Database/CKOS nào.
 */

import { ROOT_PLATFORM_NODE_ID, getPlatformChildren, getPlatformNode, getPlatformSiblings } from "./platform-tree";
import type { PlatformNode } from "./platform-model";

export type PlatformContext = {
  /** Khu vực hiện tại — `null` nếu chưa xác định được/id không hợp lệ. */
  currentArea: PlatformNode | null;
  /** Các khu vực "anh em" (cùng cấp) có ít nhất 1 tag chung với khu vực
      hiện tại — mô hình liên tưởng đơn giản, không phải gợi ý hành động. */
  relatedAreas: PlatformNode[];
  /** Toàn bộ khu vực cấp 1 khả dụng trong nền tảng — KHÔNG phụ thuộc
      `currentArea` (luôn đủ 10 khu vực, kể cả khi `currentArea` là
      `null`) — dùng cho "danh sách đầy đủ có thể đi tới", khác
      `suggestedAreas` (chỉ con trực tiếp của khu vực hiện tại). */
  availableAreas: PlatformNode[];
  /** Các khu vực con trực tiếp của khu vực hiện tại — mảng rỗng nếu khu
      vực hiện tại không có con (trung thực, không tự suy diễn thêm). */
  suggestedAreas: PlatformNode[];
};

function sortById(nodes: PlatformNode[]): PlatformNode[] {
  return [...nodes].sort((a, b) => a.id.localeCompare(b.id));
}

/** Alias thuần của `getPlatformNode()` — tên khớp đúng yêu cầu SPRINT A05
    Phần 2 (`findPlatformNode()`), tái dùng nguyên logic tra cứu ở
    `platform-tree.ts`, không viết lại. */
export function findPlatformNode(id: string): PlatformNode | null {
  return getPlatformNode(id);
}

/** Alias thuần của `getPlatformChildren()` — tên khớp yêu cầu
    `findChildren()`. */
export function findChildren(id: string): PlatformNode[] {
  return getPlatformChildren(id);
}

/** Các khu vực "anh em" (cùng `parentId`) có ít nhất 1 tag chung với khu
    vực `id` — logic dùng chung giữa `buildPlatformContext()` và bất kỳ
    nơi gọi nào khác cần riêng "khu vực liên quan". Sắp theo `id` để
    deterministic. */
export function findRelatedAreas(id: string): PlatformNode[] {
  const node = getPlatformNode(id);
  if (!node) return [];
  return sortById(getPlatformSiblings(id).filter((sibling) => sibling.tags.some((tag) => node.tags.includes(tag))));
}

/** Helper thuần dựng `PlatformContext` từ 1 `currentAreaId` — không mutate
    tree, không I/O. Cùng input luôn cho cùng output. */
export function buildPlatformContext(currentAreaId: string | null): PlatformContext {
  const currentArea = currentAreaId ? findPlatformNode(currentAreaId) : null;
  const availableAreas = findChildren(ROOT_PLATFORM_NODE_ID);

  if (!currentArea) {
    return { currentArea: null, relatedAreas: [], availableAreas, suggestedAreas: [] };
  }

  const relatedAreas = findRelatedAreas(currentArea.id);
  const suggestedAreas = findChildren(currentArea.id);

  return { currentArea, relatedAreas, availableAreas, suggestedAreas };
}
