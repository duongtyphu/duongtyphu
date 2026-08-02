/**
 * SPRINT FIX-R02 — Catalog Provider (Phần 2).
 *
 * Runtime (route.ts) CHỈ gọi `CatalogProvider ↓ CatalogEntry[]` — không
 * biết/không quan tâm dữ liệu đến từ đâu (Published Adapter hôm nay, có
 * thể là nguồn khác sau này mà không cần đổi gì ở Runtime). Đây là lớp
 * trừu tượng mỏng, KHÔNG business logic — chỉ định nghĩa contract +
 * export 1 instance mặc định dùng `PublishedCatalogAdapter`.
 */
import "server-only";
import type { KnowledgeCatalog } from "./knowledge-catalog";
import { getPublishedCatalog } from "./published-catalog-adapter";

export type CatalogProvider = {
  getCatalog(): Promise<KnowledgeCatalog>;
};

/** Instance mặc định — nguồn dữ liệu THẬT duy nhất hiện có (Published
    Adapter). route.ts import đúng biến này, không tự dựng provider khác. */
export const publishedCatalogProvider: CatalogProvider = {
  getCatalog: getPublishedCatalog,
};
