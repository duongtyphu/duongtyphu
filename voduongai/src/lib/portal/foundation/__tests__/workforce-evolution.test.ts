import { describe, it, expect, beforeEach } from "vitest";
import { getCompanion, activateWave1Companions } from "@/lib/portal/foundation/workforce-registry";
import {
  recordPerformanceSnapshot,
  getPerformanceHistory,
  recordCompanionReflection,
  computeImprovementPlan,
  triggerRetraining,
  completeRetraining,
  getRetrainingHistory,
  maybeTriggerRetraining,
  getWorkforceEvolutionTimeline,
} from "@/lib/portal/foundation/workforce-evolution";

/**
 * SPRINT F1 — Workforce Evolution Loop.
 *
 * Test khoá 5 thành phần vào dữ liệu thật: Performance History thay đổi
 * điểm thật (không tĩnh 50), Reflection/Improvement Engine tổng hợp
 * đúng, Retraining Engine tận dụng đúng state "maintenance" đã khoá
 * trong Lifecycle (Sprint 002) — không thêm state mới.
 */
describe("SPRINT F1 — Workforce Evolution Loop", () => {
  const EMPLOYEE_ID = "EMP-R001";

  beforeEach(() => {
    window.localStorage.clear();
    activateWave1Companions();
  });

  it("Performance History: recordPerformanceSnapshot() cập nhật performanceScore thật, không còn tĩnh 50", () => {
    expect(getCompanion(EMPLOYEE_ID)?.performanceScore).toBe(50);

    const snap1 = recordPerformanceSnapshot(EMPLOYEE_ID, "mission-1", { accepted: true, qaIssueCount: 0 });
    expect(snap1.previousScore).toBe(50);
    expect(snap1.newScore).toBe(55);
    expect(getCompanion(EMPLOYEE_ID)?.performanceScore).toBe(55);

    const snap2 = recordPerformanceSnapshot(EMPLOYEE_ID, "mission-2", { accepted: false, qaIssueCount: 2 });
    expect(snap2.newScore).toBe(50); // 55 - 5
    expect(getPerformanceHistory(EMPLOYEE_ID)).toHaveLength(2);
  });

  it("Reflection + Improvement Engine: tổng hợp improvementArea lặp lại nhiều nhất lên đầu", () => {
    recordCompanionReflection(EMPLOYEE_ID, "mission-1", { strengths: ["Nguồn rõ ràng"], improvementAreas: ["Tốc độ phản hồi"] });
    recordCompanionReflection(EMPLOYEE_ID, "mission-2", { strengths: ["Đúng Definition of Done"], improvementAreas: ["Tốc độ phản hồi", "Độ chi tiết"] });

    const plan = computeImprovementPlan(EMPLOYEE_ID);
    expect(plan.basedOnReflections).toBe(2);
    expect(plan.actions[0]).toBe("Tốc độ phản hồi"); // lặp lại 2 lần, đứng đầu
    expect(plan.actions).toContain("Độ chi tiết");
  });

  it("Retraining Engine: dùng đúng state 'maintenance' đã có sẵn — không thêm state mới vào Lifecycle", () => {
    expect(getCompanion(EMPLOYEE_ID)?.workingStatus).toBe("active");

    const record = triggerRetraining(EMPLOYEE_ID, "performanceScore thấp sau nhiều Mission fail");
    expect(record.status).toBe("in_progress");
    expect(getCompanion(EMPLOYEE_ID)?.workingStatus).toBe("maintenance");

    const completed = completeRetraining(EMPLOYEE_ID)!;
    expect(completed.status).toBe("completed");
    expect(getCompanion(EMPLOYEE_ID)?.workingStatus).toBe("active");
    expect(getRetrainingHistory(EMPLOYEE_ID)).toHaveLength(1);
  });

  it("maybeTriggerRetraining(): tự kích hoạt tái đào tạo khi performanceScore dưới ngưỡng, không kích hoạt khi trên ngưỡng", () => {
    expect(maybeTriggerRetraining(EMPLOYEE_ID, 40)).toBeNull(); // 50 >= 40, chưa cần

    recordPerformanceSnapshot(EMPLOYEE_ID, "mission-fail-1", { accepted: false, qaIssueCount: 5 }); // 50 - 8 = 42
    expect(maybeTriggerRetraining(EMPLOYEE_ID, 40)).toBeNull(); // 42 >= 40, vẫn chưa cần

    recordPerformanceSnapshot(EMPLOYEE_ID, "mission-fail-2", { accepted: false, qaIssueCount: 5 }); // 42 - 8 = 34
    const triggered = maybeTriggerRetraining(EMPLOYEE_ID, 40);
    expect(triggered).not.toBeNull();
    expect(getCompanion(EMPLOYEE_ID)?.workingStatus).toBe("maintenance");
  });

  it("Workforce Evolution Timeline: gộp đúng thứ tự thời gian từ Performance + Reflection + Retraining", () => {
    recordPerformanceSnapshot(EMPLOYEE_ID, "mission-1", { accepted: true, qaIssueCount: 0 });
    recordCompanionReflection(EMPLOYEE_ID, "mission-1", { strengths: ["ok"], improvementAreas: [] });
    triggerRetraining(EMPLOYEE_ID, "test");
    completeRetraining(EMPLOYEE_ID);

    const timeline = getWorkforceEvolutionTimeline(EMPLOYEE_ID);
    expect(timeline.map((e) => e.kind)).toEqual(["performance", "reflection", "retraining_started", "retraining_completed"]);
    for (let i = 1; i < timeline.length; i++) {
      expect(new Date(timeline[i].at).getTime()).toBeGreaterThanOrEqual(new Date(timeline[i - 1].at).getTime());
    }
  });
});
