import { describe, it, expect, beforeEach } from "vitest";
import {
  createGoal,
  createEpic,
  createGoalMission,
  createGoalDraft,
  launchGoal,
  listGoals,
  listEpics,
  listGoalMissions,
  linkMissionToSession,
  completeGoalMission,
  getMissionProgress,
  getEpicProgress,
  getGoalProgress,
  seedLandingPageProductionGoal,
} from "@/lib/portal/foundation/goal-runtime";
import { readGrowthEvents } from "@/lib/portal/foundation/growth-event-bus";

/**
 * GOAL 001 — Goal Runtime. Generic Goal → Epic → Mission — Landing Page
 * Production chỉ là 1 ví dụ gieo dữ liệu (`seedLandingPageProductionGoal`),
 * không phải logic hard-code riêng.
 */
describe("GOAL 001 — Goal Runtime", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("Generic: tạo Goal → Epic → Mission bất kỳ, không liên quan Landing Page", () => {
    const goal = createGoal("Ra mắt Podcast VO DUONG AI");
    const epic = createEpic(goal.goalId, "Podcast Season 1");
    const mission = createGoalMission({
      epicId: epic.epicId,
      title: "Viết kịch bản tập 1",
      owner: "Owner",
      department: "content-communication",
      companionEmployeeId: "EMP-C001",
      input: ["Chủ đề tập 1"],
      output: ["Kịch bản hoàn chỉnh"],
      deliverables: ["Script.md"],
      definitionOfDone: ["Kịch bản đủ 10 phút nói"],
    });

    expect(listGoals()).toHaveLength(1);
    expect(listEpics(goal.goalId)).toHaveLength(1);
    expect(listGoalMissions(epic.epicId)).toHaveLength(1);
    expect(mission.status).toBe("not_started");
    expect(getMissionProgress(mission)).toBe(0);
    expect(getEpicProgress(epic.epicId)).toBe(0);
    expect(getGoalProgress(goal.goalId)).toBe(0);
  });

  it("Mission Lifecycle: not_started -> in_progress (link Session) -> completed, Epic/Goal progress tính đúng", () => {
    const goal = createGoal("Test Goal");
    const epic = createEpic(goal.goalId, "Test Epic");
    const mission = createGoalMission({
      epicId: epic.epicId,
      title: "Test Mission",
      owner: "Owner",
      department: "technology-automation",
      companionEmployeeId: "EMP-T001",
      input: [],
      output: [],
      deliverables: [],
      definitionOfDone: [],
    });

    const linked = linkMissionToSession(mission.missionId, "session-abc")!;
    expect(linked.status).toBe("in_progress");
    expect(linked.sessionId).toBe("session-abc");
    expect(getMissionProgress(linked)).toBe(25);
    expect(getEpicProgress(epic.epicId)).toBe(25);

    // Link lại lần 2 (Owner Resume Session) không đổi status đã "in_progress" thành "not_started" lùi lại.
    const relinkedSameSession = linkMissionToSession(mission.missionId, "session-abc")!;
    expect(relinkedSameSession.status).toBe("in_progress");

    const completed = completeGoalMission(mission.missionId)!;
    expect(completed.status).toBe("completed");
    expect(getMissionProgress(completed)).toBe(100);
    expect(getEpicProgress(epic.epicId)).toBe(100);
    expect(getGoalProgress(goal.goalId)).toBe(100);

    const eventTypes = readGrowthEvents().map((e) => e.eventType);
    expect(eventTypes).toContain("MISSION_STARTED");
    expect(eventTypes).toContain("MISSION_COMPLETED");
  });

  it("seedLandingPageProductionGoal(): tạo đúng 1 Goal, 1 Epic, 6 Mission theo đúng brief — mỗi Mission đủ Owner/Department/Companion/Input/Output/Deliverables/DoD", () => {
    const seeded = seedLandingPageProductionGoal()!;
    expect(seeded.goal.title).toBe("Landing Page Production");
    expect(seeded.epic.title).toBe("Landing Page");
    expect(seeded.missions).toHaveLength(6);
    expect(seeded.missions.map((m) => m.title)).toEqual([
      "Research & Planning",
      "Content Blueprint",
      "UI/UX Design",
      "Development",
      "QA",
      "Production Review",
    ]);

    for (const mission of seeded.missions) {
      expect(mission.owner).toBeTruthy();
      expect(mission.department).toBeTruthy();
      expect(mission.companionEmployeeId).toBeTruthy();
      expect(mission.input.length).toBeGreaterThan(0);
      expect(mission.output.length).toBeGreaterThan(0);
      expect(mission.deliverables.length).toBeGreaterThan(0);
      expect(mission.definitionOfDone.length).toBeGreaterThan(0);
      expect(mission.status).toBe("not_started");
    }

    // Idempotent — gọi lại không tạo thêm Goal/Epic/Mission trùng.
    const seededAgain = seedLandingPageProductionGoal()!;
    expect(seededAgain.goal.goalId).toBe(seeded.goal.goalId);
    expect(listGoals().filter((g) => g.title === "Landing Page Production")).toHaveLength(1);
    expect(listGoalMissions(seeded.epic.epicId)).toHaveLength(6);
  });

  it("Mỗi Companion gán cho Mission đều tồn tại thật trong Workforce Registry", async () => {
    const { getCompanion } = await import("@/lib/portal/foundation/workforce-registry");
    const seeded = seedLandingPageProductionGoal()!;
    for (const mission of seeded.missions) {
      expect(getCompanion(mission.companionEmployeeId)).toBeDefined();
    }
  });

  it("P0 Goal Creation: createGoalDraft() tạo Goal status draft, chưa có Epic/Mission nào", () => {
    const goal = createGoalDraft({
      title: "Ra mắt Kênh YouTube VO DUONG AI",
      description: "Xây kênh YouTube dạy AI cho người mới bắt đầu",
      goalType: "Nội dung",
      priority: "high",
      expectedDeliverable: "10 video đầu tiên",
      dueDate: "2026-12-31",
    });

    expect(goal.status).toBe("draft");
    expect(goal.description).toBe("Xây kênh YouTube dạy AI cho người mới bắt đầu");
    expect(goal.priority).toBe("high");
    expect(listGoals().map((g) => g.goalId)).toContain(goal.goalId);
    expect(listEpics(goal.goalId)).toHaveLength(0);
    expect(getGoalProgress(goal.goalId)).toBe(0);
  });

  it("P0 Goal Creation: launchGoal() draft -> active, tự tạo 1 Epic + 1 Mission Phân tích & Lập kế hoạch — generic, không hard-code nội dung Goal", () => {
    const goal = createGoalDraft({ title: "Ra mắt Kênh YouTube VO DUONG AI", expectedDeliverable: "10 video đầu tiên" });

    const launched = launchGoal(goal.goalId)!;
    expect(launched.goal.status).toBe("active");
    expect(launched.epic.goalId).toBe(goal.goalId);
    expect(launched.mission.title).toBe("Phân tích & Lập kế hoạch");
    expect(launched.mission.deliverables).toContain("10 video đầu tiên");
    expect(launched.mission.companionEmployeeId).toBeTruthy();

    // Idempotent — gọi lại trên Goal đã active trả về đúng Epic/Mission đã tạo, không tạo trùng.
    const launchedAgain = launchGoal(goal.goalId)!;
    expect(launchedAgain.epic.epicId).toBe(launched.epic.epicId);
    expect(launchedAgain.mission.missionId).toBe(launched.mission.missionId);
    expect(listEpics(goal.goalId)).toHaveLength(1);
    expect(listGoalMissions(launched.epic.epicId)).toHaveLength(1);
  });

  it("launchGoal() trả về null cho goalId không tồn tại", () => {
    expect(launchGoal("khong-ton-tai")).toBeNull();
  });
});
