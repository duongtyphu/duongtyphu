import { describe, it, expect, beforeEach } from "vitest";
import { seedLandingPageProductionGoal, listGoalMissions, linkMissionToSession } from "@/lib/portal/foundation/goal-runtime";
import { recordMissionQA, buildMissionPackage, recordMissionAnalysis, recordMissionResearch, addMissionDecision, recordMissionReview, recordMissionLessonsLearned, recordMissionOwnerApproval } from "@/lib/portal/foundation/mission-runtime";
import { activateWave1Companions, getCompanion } from "@/lib/portal/foundation/workforce-registry";
import { recordPerformanceSnapshot, recordCompanionReflection, computeImprovementPlan, getWorkforceEvolutionTimeline } from "@/lib/portal/foundation/workforce-evolution";
import { promoteBestPractice, suggestBlueprintImprovement, getOrganizationalMemoryTimeline } from "@/lib/portal/foundation/organizational-learning";

/**
 * PHASE 3 FINALIZATION — Runtime Demo E2E (Sprint F1 + F2).
 *
 * Chạy trọn: Mission 01 hoàn thành thật (mission-runtime.ts, đã verify ở
 * Sprint Golden Reference) → Companion điều phối tự đánh giá + Performance
 * cập nhật thật (F1) → tổ chức rút Best Practice + đề xuất cải thiện
 * Blueprint từ chính Mission đó (F2). Đây là Runtime Flow nối liền EPIC 05
 * trước khi đóng PHASE 3.
 */
describe("PHASE 3 FINALIZATION — F1 + F2 Runtime Demo (nối tiếp Mission 01 thật)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    activateWave1Companions();
  });

  it("Mission 01 hoàn thành → Workforce Evolution (F1) → Organizational Learning (F2) chạy liền mạch", () => {
    const seeded = seedLandingPageProductionGoal()!;
    const mission01 = listGoalMissions(seeded.epic.epicId).find((m) => m.title === "Research & Planning")!;
    const companionId = mission01.companionEmployeeId; // EMP-R001

    linkMissionToSession(mission01.missionId, "session-phase3-e2e");
    recordMissionAnalysis(mission01.missionId, { problem: "p", scope: ["s"], risks: ["r"] });
    recordMissionResearch(mission01.missionId, { findings: ["f"], sources: ["Workforce Registry thật"], recommendations: ["r"] });
    addMissionDecision(mission01.missionId, "d", "vì lý do thật");
    recordMissionReview(mission01.missionId, { reviewer: "Reviewer Companion", notes: ["ok"], approved: true });
    recordMissionQA(mission01.missionId, { checks: [{ label: "check", passed: true }], issues: [] });
    recordMissionLessonsLearned(mission01.missionId, { lessons: ["luôn ghi rõ nguồn"] });
    recordMissionOwnerApproval(mission01.missionId, { approved: true, notes: ["Founder approve"] });

    const pkg = buildMissionPackage(mission01.missionId)!;
    expect(pkg.acceptanceReport.accepted).toBe(true);

    // ---- F1: Workforce Evolution Loop ----
    const before = getCompanion(companionId)!.performanceScore;
    const snapshot = recordPerformanceSnapshot(companionId, mission01.missionId, {
      accepted: pkg.acceptanceReport.accepted,
      qaIssueCount: pkg.qaReport.issues.length,
    });
    expect(snapshot.newScore).toBeGreaterThan(before);
    expect(getCompanion(companionId)!.performanceScore).toBe(snapshot.newScore);

    recordCompanionReflection(companionId, mission01.missionId, {
      strengths: pkg.qaReport.checks.filter((c) => c.passed).map((c) => c.label),
      improvementAreas: pkg.lessonsLearned.lessons,
    });
    const plan = computeImprovementPlan(companionId);
    expect(plan.basedOnReflections).toBe(1);

    const evolutionTimeline = getWorkforceEvolutionTimeline(companionId);
    expect(evolutionTimeline.length).toBeGreaterThanOrEqual(2); // performance + reflection

    // ---- F2: Organizational Learning Engine ----
    const bestPractice = promoteBestPractice(
      pkg.researchReport.recommendations[0],
      [mission01.missionId],
      mission01.department
    );
    const improvement = suggestBlueprintImprovement("viet-landing-page", pkg.lessonsLearned.lessons[0], mission01.missionId);

    const orgTimeline = getOrganizationalMemoryTimeline();
    expect(orgTimeline.map((e) => e.kind)).toEqual(expect.arrayContaining(["best_practice", "blueprint_improvement"]));
    expect(bestPractice.evidenceMissionIds).toContain(mission01.missionId);
    expect(improvement.basedOnMissionId).toBe(mission01.missionId);
  });
});
