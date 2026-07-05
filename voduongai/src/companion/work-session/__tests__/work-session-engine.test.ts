import { describe, expect, it } from "vitest";
import { advanceWorkSession, celebrateWorkSession, createWorkSession, isWorkSessionSettled } from "../work-session-engine";

describe("companion work-session-engine", () => {
  it("returns null for routes with no orchestrated module", () => {
    expect(createWorkSession({ currentRoute: "/portal/tools" })).toBeNull();
  });

  it("starts a session in OBSERVING with the real goal quoted back", () => {
    const session = createWorkSession({ currentRoute: "/portal/hocvienai", userGoal: "Tạo Landing Page" });
    expect(session?.currentStatus).toBe("OBSERVING");
    expect(session?.companionMessages[0].text).toContain("Tạo Landing Page");
    expect(session?.plan[0]).toEqual({ id: "understand-goal", label: "Hiểu mục tiêu", status: "active" });
  });

  it("walks through every status in order, inviting each specialist one at a time, ending READY", () => {
    let session = createWorkSession({ currentRoute: "/portal/hocvienai", userGoal: "Tạo Landing Page" })!;
    const specialistCount = session.selectedSpecialists.length;
    expect(specialistCount).toBeGreaterThan(0);

    const statuses: string[] = [session.currentStatus];
    let guard = 0;
    while (!isWorkSessionSettled(session) && guard < 50) {
      session = advanceWorkSession(session);
      statuses.push(session.currentStatus);
      guard++;
    }

    expect(statuses[0]).toBe("OBSERVING");
    expect(statuses).toContain("THINKING");
    expect(statuses).toContain("PLANNING");
    expect(statuses.filter((s) => s === "INVITING_AGENT").length).toBe(specialistCount);
    expect(statuses.filter((s) => s === "WAITING_AGENT").length).toBe(specialistCount);
    expect(statuses).toContain("SYNTHESIZING");
    expect(statuses.at(-1)).toBe("READY");

    // Every plan step must be "done" by the time the session is READY.
    expect(session.plan.every((step) => step.status === "done")).toBe(true);
    expect(session.resultSummary).toBeTruthy();
  });

  it("names each invited specialist in the work language, in order", () => {
    let session = createWorkSession({ currentRoute: "/portal/hocvienai", userGoal: "Tạo Landing Page" })!;
    const expectedOrder = session.selectedSpecialists.map((a) => a.name.replace(/^AI /, ""));
    const inviteMessages: string[] = [];
    let guard = 0;
    while (!isWorkSessionSettled(session) && guard < 50) {
      session = advanceWorkSession(session);
      if (session.currentStatus === "WAITING_AGENT") {
        inviteMessages.push(session.companionMessages.at(-1)!.text);
      }
      guard++;
    }
    expectedOrder.forEach((name, i) => {
      expect(inviteMessages[i]).toContain(name);
    });
  });

  it("does not advance past READY on its own, but celebrate() moves it to CELEBRATING exactly once", () => {
    let session = createWorkSession({ currentRoute: "/portal/duan-cohoi", userGoal: "phân tích dự án SolarGroup" })!;
    let guard = 0;
    while (!isWorkSessionSettled(session) && guard < 50) {
      session = advanceWorkSession(session);
      guard++;
    }
    expect(session.currentStatus).toBe("READY");
    const stuck = advanceWorkSession(session);
    expect(stuck.currentStatus).toBe("READY");

    const celebrated = celebrateWorkSession(session);
    expect(celebrated.currentStatus).toBe("CELEBRATING");
    expect(celebrated.companionMessages.at(-1)?.text).toContain("phân tích dự án SolarGroup");

    const celebratedTwice = celebrateWorkSession(celebrated);
    expect(celebratedTwice).toBe(celebrated);
  });

  it("Companion Task Entry — an arbitrary free-text goal (not matching any keyword rule) still opens a real Work Session with a default specialist team", () => {
    const session = createWorkSession({
      currentRoute: "/portal/aiworkspace",
      currentModule: "khong-gian-ai",
      userGoal: "Mình muốn thử viết caption cho một sản phẩm bằng AI",
    })!;
    expect(session).not.toBeNull();
    expect(session.companionMessages[0].text).toContain("Mình muốn thử viết caption cho một sản phẩm bằng AI");
    expect(session.selectedSpecialists.length).toBeGreaterThan(0);

    let settled = session;
    let guard = 0;
    while (!isWorkSessionSettled(settled) && guard < 50) {
      settled = advanceWorkSession(settled);
      guard++;
    }
    expect(settled.currentStatus).toBe("READY");
  });

  it("skips specialist-invite ticks entirely for Learning Journal (no visible Agent, per Product Rule)", () => {
    let session = createWorkSession({ currentRoute: "/portal/nhatkyhoctap" })!;
    expect(session.selectedSpecialists).toEqual([]);
    let guard = 0;
    while (!isWorkSessionSettled(session) && guard < 50) {
      session = advanceWorkSession(session);
      guard++;
    }
    expect(session.currentStatus).toBe("READY");
    expect(session.plan.filter((s) => s.agentId).length).toBe(0);
  });
});
