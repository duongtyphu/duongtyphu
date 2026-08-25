import { describe, it, expect } from "vitest";

/** `live-companion-mission` import "server-only" — cần mock dưới Vitest,
    cùng kỹ thuật đã dùng ở `catalog-provider.test.ts`. */
import { vi } from "vitest";
vi.mock("server-only", () => ({}));

import { getCompanionMissionContext } from "../live-companion-mission";

describe("GIAI ĐOẠN 2 — getCompanionMissionContext(): honest khi Supabase chưa cấu hình", () => {
  it("không có Supabase (env test) → trả về chuỗi rỗng, không throw, không bịa nội dung", async () => {
    const result = await getCompanionMissionContext();
    expect(typeof result).toBe("string");
    expect(result).toBe("");
  });
});
