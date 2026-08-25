import { describe, it, expect, beforeEach } from "vitest";
import { createGoal, createEpic, createGoalMission, getGoalMission, linkMissionToSession, __resetGoalRuntimeCacheForTest} from "@/lib/portal/foundation/goal-runtime";
import {
  recordMissionAnalysis,
  recordMissionResearch,
  addMissionDecision,
  recordMissionReview,
  recordMissionQA,
  recordMissionOwnerApproval,
  recordMissionLessonsLearned,
  buildMissionPackage,
  extractMissionTemplate,
  listMissionTemplates,
} from "@/lib/portal/foundation/mission-runtime";

/**
 * MISSION 01 — Golden Reference Mission — Mission Runtime.
 *
 * Test này khoá Mission Runtime vào tính GENERIC: chạy trọn Pipeline
 * (Analysis → Research → Planning → Review → QA → Owner Approval →
 * Package → Template) trên 1 Mission "Podcast" hoàn toàn không liên
 * quan Landing Page, chứng minh không có nhánh logic hard-code Goal cụ
 * thể nào trong engine.
 */
describe("MISSION 01 — Mission Runtime (generic pipeline)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    __resetGoalRuntimeCacheForTest();
  });

  function seedGenericMission() {
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
    return mission;
  }

  it("buildMissionPackage() trả về null khi Mission chưa qua đủ các bước bắt buộc", () => {
    const mission = seedGenericMission();
    expect(buildMissionPackage(mission.missionId)).toBeNull();
  });

  it("Chạy trọn Pipeline trên 1 Mission KHÔNG liên quan Landing Page — Mission Package đầy đủ, Mission chuyển waiting_review rồi completed", () => {
    const mission = seedGenericMission();
    linkMissionToSession(mission.missionId, "session-podcast-01");

    recordMissionAnalysis(mission.missionId, {
      problem: "Chưa có kịch bản tập 1",
      scope: ["Viết outline", "Viết lời thoại"],
      risks: ["Chủ đề chưa rõ ràng"],
    });
    recordMissionResearch(mission.missionId, {
      findings: ["Khán giả thích format hỏi-đáp"],
      sources: ["Khảo sát nội bộ"],
      recommendations: ["Dùng format hỏi-đáp cho tập 1"],
    });
    addMissionDecision(mission.missionId, "Chọn format hỏi-đáp", "Khớp với finding nghiên cứu");
    recordMissionReview(mission.missionId, { reviewer: "Reviewer Companion", notes: ["Đạt yêu cầu"], approved: true });
    recordMissionQA(mission.missionId, { checks: [{ label: "Đủ 10 phút nói", passed: true }], issues: [] });

    // Sau QA pass + Review approved — Mission phải tự chuyển waiting_review (không phải completed).
    expect(getGoalMission(mission.missionId)?.status).toBe("waiting_review");

    recordMissionLessonsLearned(mission.missionId, { lessons: ["Nên khảo sát khán giả trước khi viết outline"] });

    // Owner Approval CHƯA gọi — Package vẫn build được (đủ Research/QA/LessonsLearned) nhưng ownerReview.approved=false.
    const pkgBeforeApproval = buildMissionPackage(mission.missionId);
    expect(pkgBeforeApproval).toBeNull(); // ownerReview chưa có bản ghi nào

    recordMissionOwnerApproval(mission.missionId, { approved: true, notes: ["Owner duyệt"] });
    expect(getGoalMission(mission.missionId)?.status).toBe("completed");

    const pkg = buildMissionPackage(mission.missionId)!;
    expect(pkg).not.toBeNull();
    expect(pkg.researchReport.findings.length).toBeGreaterThan(0);
    expect(pkg.decisionLog.length).toBe(1);
    expect(pkg.acceptanceReport.accepted).toBe(true);
    expect(pkg.qaReport.issues).toHaveLength(0);
    expect(pkg.ownerReview.approved).toBe(true);
    expect(pkg.lessonsLearned.lessons.length).toBeGreaterThan(0);
    expect(pkg.runtimeEvents.map((e) => e.eventType)).toEqual(expect.arrayContaining(["MISSION_STARTED", "MISSION_COMPLETED"]));
  });

  it("extractMissionTemplate() sinh Mission Template CHỈ chứa cấu trúc chung — không có từ khoá Goal cụ thể nào", () => {
    const mission = seedGenericMission();
    recordMissionAnalysis(mission.missionId, { problem: "x", scope: ["a"], risks: ["b"] });
    recordMissionResearch(mission.missionId, { findings: ["f"], sources: ["s"], recommendations: ["r"] });
    addMissionDecision(mission.missionId, "d", "r");
    recordMissionReview(mission.missionId, { reviewer: "Reviewer Companion", notes: [], approved: true });
    recordMissionQA(mission.missionId, { checks: [{ label: "check1", passed: true }], issues: [] });
    recordMissionLessonsLearned(mission.missionId, { lessons: ["l"] });
    recordMissionOwnerApproval(mission.missionId, { approved: true, notes: [] });

    const template = extractMissionTemplate(mission.missionId)!;
    expect(template).not.toBeNull();
    expect(template.pipeline).toEqual([
      "analysis", "research", "planning", "review", "qa", "owner_approval", "package", "template",
    ]);
    expect(template.missionChecklist).toEqual([
      "Owner", "Department", "Companion", "Input", "Output", "Deliverables", "Definition of Done",
    ]);
    expect(template.outputContract).toEqual([
      "researchReport", "decisionLog", "acceptanceReport", "runtimeEvents", "qaReport", "ownerReview", "lessonsLearned",
    ]);
    // qaChecklist/reviewChecklist là cấu trúc chung — không copy nguyên văn "check1" (nội dung QA của Mission nguồn).
    expect(template.qaChecklist.join(" ")).not.toMatch(/check1/i);

    const serialized = JSON.stringify(template);
    expect(serialized).not.toMatch(/Landing Page/i);
    expect(serialized).not.toMatch(/Podcast/i);

    expect(listMissionTemplates().map((t) => t.templateId)).toContain(template.templateId);
  });
});
