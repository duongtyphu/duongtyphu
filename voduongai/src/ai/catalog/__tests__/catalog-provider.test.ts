import { describe, it, expect, vi } from "vitest";

/** `catalog-provider`/`published-catalog-adapter` import "server-only" —
    cần mock dưới Vitest, cùng kỹ thuật đã dùng ở `provider-layer.test.ts`. */
vi.mock("server-only", () => ({}));

import { publishedCatalogProvider } from "../catalog-provider";
import { getPublishedCatalog } from "../published-catalog-adapter";

describe("SPRINT FIX-R02 — Catalog Provider (Phần 2): Runtime chỉ gọi CatalogProvider ↓ CatalogEntry[]", () => {
  it("publishedCatalogProvider.getCatalog là 1 hàm, gọi được, trả về Promise<KnowledgeCatalog>", async () => {
    expect(typeof publishedCatalogProvider.getCatalog).toBe("function");
    const catalog = await publishedCatalogProvider.getCatalog();
    expect(Array.isArray(catalog)).toBe(true);
  });

  it("publishedCatalogProvider được nối đúng vào getPublishedCatalog (Published Adapter) — nguồn dữ liệu THẬT duy nhất", () => {
    expect(publishedCatalogProvider.getCatalog).toBe(getPublishedCatalog);
  });
});
