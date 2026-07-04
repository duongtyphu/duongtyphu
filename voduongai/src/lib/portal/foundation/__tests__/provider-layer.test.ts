import { describe, it, expect, beforeEach, vi } from "vitest";
import { listProviders, getProviderEntry } from "@/lib/portal/foundation/provider-registry";
import { getProviderForCapability } from "@/lib/portal/foundation/provider-manager";
import { listBenchmarkRuns, runBenchmarkCase } from "@/lib/portal/foundation/provider-benchmark";

/**
 * PHASE 4 EPIC 01 — AI Provider Layer.
 *
 * `global.fetch` được mock để giả lập `/api/ai/workforce` (ranh giới
 * mạng — không có ANTHROPIC_API_KEY/OPENAI_API_KEY thật trong môi
 * trường này) — toàn bộ logic Provider Registry/Manager/Benchmark là
 * code sản xuất thật, không mock.
 */
describe("PHASE 4 EPIC 01 — AI Provider Layer", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("AI Provider Registry: liệt kê đúng Provider đã đăng ký", () => {
    const providers = listProviders();
    expect(providers).toHaveLength(1);
    expect(providers[0].providerId).toBe("workforce-api-v1");
    expect(getProviderEntry("workforce-api-v1")).toBeDefined();
    expect(getProviderEntry("khong-ton-tai")).toBeUndefined();
  });

  it("AI Provider Manager: chọn đúng Provider cho capability đã đăng ký, ném lỗi cho capability chưa có", () => {
    const provider = getProviderForCapability("writing.draft");
    expect(provider.name).toBe("Workforce API Provider");
    expect(() => getProviderForCapability("legal.review")).toThrow();
  });

  it("AI Provider Benchmark: chạy 1 BenchmarkCase thật qua Provider Manager và lưu BenchmarkRun", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        result: { draftOutput: "Bản nháp benchmark", summary: "", suggestedTitle: "", notes: "", isMock: true },
      }),
    })) as unknown as typeof fetch;
    vi.stubGlobal("fetch", fetchMock);

    const run = await runBenchmarkCase("workforce-api-v1", {
      capabilityId: "writing.draft",
      caseId: "case-facebook-post",
      input: { goal: "Viết một bài Facebook giới thiệu VO DUONG AI", blueprintName: "Facebook Content Blueprint", taskName: "Draft", outputFormat: "markdown" },
      expectedCriteria: ["Đúng thông điệp", "Ngắn gọn"],
    });

    expect(run.providerId).toBe("workforce-api-v1");
    expect(run.capabilityId).toBe("writing.draft");
    expect(run.isMock).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/ai/workforce", expect.objectContaining({ method: "POST" }));

    const stored = listBenchmarkRuns("writing.draft");
    expect(stored).toHaveLength(1);
    expect(stored[0].runId).toBe(run.runId);
  });

  it("AI Provider Benchmark: ném lỗi khi capability chưa hỗ trợ Benchmark", async () => {
    await expect(
      runBenchmarkCase("workforce-api-v1", {
        capabilityId: "research.market-analysis",
        caseId: "case-x",
        input: {},
        expectedCriteria: [],
      })
    ).rejects.toThrow();
  });
});
