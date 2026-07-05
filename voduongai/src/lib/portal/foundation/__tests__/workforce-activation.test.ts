import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  listCompanions,
  listByDepartment,
  getCompanion,
  activateWave1Companions,
  setWorkingStatus,
} from "@/lib/portal/foundation/workforce-registry";
import { assignTask, toOutputContract } from "@/lib/portal/foundation/companion-manager";
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

  it("Workforce Registry: đủ 30/30 Companion (Wave 1 + Wave 2 + Wave 3), đúng 7 Department hoàn chỉnh", () => {
    const companions = listCompanions();
    expect(companions).toHaveLength(30);

    expect(listByDepartment("research-knowledge")).toHaveLength(5);
    expect(listByDepartment("content-communication")).toHaveLength(5);
    expect(listByDepartment("business-strategy")).toHaveLength(4);
    expect(listByDepartment("creative-design")).toHaveLength(4);
    expect(listByDepartment("technology-automation")).toHaveLength(4);
    expect(listByDepartment("office-productivity")).toHaveLength(5);
    expect(listByDepartment("personal-growth")).toHaveLength(3);

    // Không Companion nào trùng employeeId — Registry hoàn chỉnh, không lẫn dữ liệu.
    const ids = companions.map((c) => c.employeeId);
    expect(new Set(ids).size).toBe(30);

    // Capability Matrix hoàn chỉnh — mỗi Companion có capabilityId riêng, không trùng nhau.
    const capabilityIds = companions.map((c) => c.capability[0]);
    expect(new Set(capabilityIds).size).toBe(30);

    // Mỗi Companion đủ 19 trường hồ sơ theo brief + Output Contract (outputType).
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
      expect(c.outputType).toBeTruthy();
      expect(c.providerPreference).toBeTruthy();
      expect(c.fallbackProvider).toBeTruthy();
      expect(c.workingStatus).toBe("inactive");
      expect(c.trainingStatus).toBeTruthy();
      expect(c.certificationStatus).toBeTruthy();
      expect(typeof c.performanceScore).toBe("number");
    }
  });

  it("Companion Lifecycle: activateWave1Companions() đưa cả 30 Companion từ inactive -> active, ghi đủ 30 COMPANION_ACTIVATED", () => {
    const activated = activateWave1Companions();
    expect(activated).toHaveLength(30);
    expect(activated.every((c) => c.workingStatus === "active")).toBe(true);
    expect(listCompanions().every((c) => c.workingStatus === "active")).toBe(true);

    const events = readGrowthEvents().filter((e) => e.eventType === "COMPANION_ACTIVATED");
    expect(events).toHaveLength(30);
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
      // Wave 2
      ["EMP-R003", "Fact Checker Companion"],
      ["EMP-C003", "Copywriter Companion"],
      ["EMP-B002", "Sales Companion"],
      ["EMP-D001", "Designer Companion"],
      ["EMP-T003", "Automation Companion"],
      // Wave 3 (Sprint 002 — hoàn thành 30/30)
      ["EMP-R005", "Customer Research Companion"],
      ["EMP-C005", "Translator Companion"],
      ["EMP-B004", "Partnership Companion"],
      ["EMP-D002", "Presentation Companion"],
      ["EMP-O003", "Word Companion"],
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

    it("Output Contract: toOutputContract() map đúng CompanionTaskResult vào OutputType đã chuẩn hoá sẵn cho Workspace Integration", async () => {
      const companion = getCompanion("EMP-O003")!; // Word Companion — outputType: "word"
      const result = await assignTask("EMP-O003", { prompt: "Soạn công văn mẫu" });
      const contract = toOutputContract(companion, result);
      expect(contract.employeeId).toBe("EMP-O003");
      expect(contract.type).toBe("word");
      expect(contract.content).toBe(result.output);
    });

    it("Companion Manager điều phối được toàn bộ 30/30 Companion (không chỉ danh sách mẫu)", async () => {
      for (const companion of listCompanions()) {
        const result = await assignTask(companion.employeeId, { prompt: "Kiểm tra điều phối toàn Workforce." });
        expect(result.isMock).toBe(true);
        expect(getCompanion(companion.employeeId)?.workingStatus).toBe("active");
      }
    });
  });
});
