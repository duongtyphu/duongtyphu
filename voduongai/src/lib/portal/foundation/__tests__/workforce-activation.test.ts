import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  listCompanions,
  listByDepartment,
  getCompanion,
  activateWave1Companions,
  setWorkingStatus,
} from "@/lib/portal/foundation/workforce-registry";
import { assignTask } from "@/lib/portal/foundation/companion-manager";
import { readGrowthEvents } from "@/lib/portal/foundation/growth-event-bus";

/**
 * PHASE 4 EPIC 02 — Activate Core AI Companion Team (Wave 1).
 *
 * `global.fetch` mock giả lập `/api/ai/workforce` (agentRole
 * "companion-task") — ranh giới mạng duy nhất, giống
 * `agent-integration-mvp.test.ts`. Toàn bộ logic Workforce Registry/
 * Companion Manager/Lifecycle là code sản xuất thật, không mock.
 */
describe("PHASE 4 EPIC 02 — Activate Core AI Companion Team (Wave 1)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("Workforce Registry: đủ 10 Companion, đúng 6 Department theo brief", () => {
    const companions = listCompanions();
    expect(companions).toHaveLength(10);

    expect(listByDepartment("research-knowledge")).toHaveLength(2);
    expect(listByDepartment("content-communication")).toHaveLength(2);
    expect(listByDepartment("business-strategy")).toHaveLength(1);
    expect(listByDepartment("technology-automation")).toHaveLength(2);
    expect(listByDepartment("office-productivity")).toHaveLength(1);
    expect(listByDepartment("personal-growth")).toHaveLength(2);

    // Mỗi Companion đủ 19 trường hồ sơ theo brief.
    for (const c of companions) {
      expect(c.employeeId).toBeTruthy();
      expect(c.department).toBeTruthy();
      expect(c.position).toBeTruthy();
      expect(c.mission).toBeTruthy();
      expect(c.responsibilities.length).toBeGreaterThan(0);
      expect(c.capability.length).toBeGreaterThan(0);
      expect(Array.isArray(c.supportedBlueprint)).toBe(true);
      expect(c.supportedTasks.length).toBeGreaterThan(0);
      expect(c.inputContract.length).toBeGreaterThan(0);
      expect(c.outputContract.length).toBeGreaterThan(0);
      expect(c.qaChecklist.length).toBeGreaterThan(0);
      expect(c.evidenceStandard.length).toBeGreaterThan(0);
      expect(c.portfolioMapping.primaryCompetencyId).toBeTruthy();
      expect(c.providerPreference).toBeTruthy();
      expect(c.fallbackProvider).toBeTruthy();
      expect(c.workingStatus).toBe("inactive");
      expect(c.trainingStatus).toBeTruthy();
      expect(c.certificationStatus).toBeTruthy();
      expect(typeof c.performanceScore).toBe("number");
    }
  });

  it("Companion Lifecycle: activateWave1Companions() đưa cả 10 Companion từ inactive -> active, ghi đủ 10 COMPANION_ACTIVATED", () => {
    const activated = activateWave1Companions();
    expect(activated).toHaveLength(10);
    expect(activated.every((c) => c.workingStatus === "active")).toBe(true);
    expect(listCompanions().every((c) => c.workingStatus === "active")).toBe(true);

    const events = readGrowthEvents().filter((e) => e.eventType === "COMPANION_ACTIVATED");
    expect(events).toHaveLength(10);
  });

  it("Companion Lifecycle: từ chối chuyển trạng thái sai thứ tự (vd inactive -> active thẳng)", () => {
    expect(() => setWorkingStatus("EMP-R001", "active")).toThrow();
  });

  it("Companion Lifecycle: retired là trạng thái cuối, không nhận Task", async () => {
    activateWave1Companions();
    setWorkingStatus("EMP-R001", "retired");
    await expect(assignTask("EMP-R001", { prompt: "Nghiên cứu thị trường AI Agent tại VN" })).rejects.toThrow();
  });

  describe("Task Assignment — 5 Companion nêu trong brief đều nhận được Task qua Mock Provider", () => {
    const fetchMock = vi.fn(async (_url: string, options: RequestInit) => {
      const body = JSON.parse(options.body as string) as { agentRole: string; capabilityId: string };
      expect(body.agentRole).toBe("companion-task");
      return {
        ok: true,
        json: async () => ({
          ok: true,
          result: { raw: `[MOCK output cho ${body.capabilityId}]`, model: "mock-model", providerId: "mock", isMock: true },
        }),
      } as Response;
    });

    beforeEach(() => {
      activateWave1Companions();
      vi.stubGlobal("fetch", fetchMock);
    });

    it.each([
      ["EMP-R001", "Market Research Companion"],
      ["EMP-C001", "Writer Companion"],
      ["EMP-T001", "Coding Companion"],
      ["EMP-O001", "Excel Companion"],
      ["EMP-G001", "Goal Coach Companion"],
    ])("%s (%s) nhận Task và trả Output đúng cấu trúc", async (employeeId, expectedPosition) => {
      const result = await assignTask(employeeId, { prompt: "Task kiểm thử Sprint Activation." });
      expect(result.position).toBe(expectedPosition);
      expect(result.isMock).toBe(true);
      expect(result.providerId).toBe("mock");
      expect(typeof result.output).toBe("string");
      expect(fetchMock).toHaveBeenCalledWith("/api/ai/workforce", expect.objectContaining({ method: "POST" }));

      // Companion không kẹt ở "busy" sau khi Task hoàn thành.
      expect(getCompanion(employeeId)?.workingStatus).toBe("active");
    });

    it("Companion Manager truyền đúng providerPreference/fallbackProvider của từng Companion, không tự chọn Provider", async () => {
      await assignTask("EMP-R001", { prompt: "x" });
      const [, options] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
      const body = JSON.parse((options as RequestInit).body as string);
      expect(body.preferredProvider).toBe("anthropic");
      expect(body.fallbackProvider).toBe("openai");
      expect(body.capabilityId).toBe("research.market-analysis");
    });

    it("Growth Event Bus ghi đủ COMPANION_TASK_ASSIGNED + COMPANION_TASK_COMPLETED cho mỗi Task", async () => {
      await assignTask("EMP-C001", { prompt: "x" });
      const eventTypes = readGrowthEvents().map((e) => e.eventType);
      expect(eventTypes).toContain("COMPANION_TASK_ASSIGNED");
      expect(eventTypes).toContain("COMPANION_TASK_COMPLETED");
    });
  });
});
