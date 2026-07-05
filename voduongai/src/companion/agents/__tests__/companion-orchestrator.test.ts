import { describe, expect, it } from "vitest";
import { orchestrate } from "../companion-orchestrator";
import { getAgentsByModule } from "../agent-registry";
import { getModuleForRoute } from "../module-agent-map";

describe("companion-orchestrator", () => {
  it("returns null for routes outside the 8 orchestrated modules", () => {
    expect(orchestrate({ currentRoute: "/portal/tools" })).toBeNull();
  });

  it("maps routes to the correct module", () => {
    expect(getModuleForRoute("/portal/hocvienai/mission-1")).toBe("academy");
    expect(getModuleForRoute("/portal/khuvuoncuaban")).toBe("living-garden");
    expect(getModuleForRoute("/portal/nhatkyhoctap")).toBe("learning-journal");
  });

  it("selects the Landing Page mission team from the amendment example", () => {
    const plan = orchestrate({ currentRoute: "/portal/hocvienai", userGoal: "Tạo Landing Page" });
    expect(plan).not.toBeNull();
    expect(plan?.module).toBe("academy");
    expect(plan?.selectedAgents.map((a) => a.id)).toEqual([
      "mission-planner",
      "ckos-writer",
      "ckos-summary",
      "ckos-reviewer",
    ]);
    expect(plan?.companionMessage).toContain("mời Writer, Designer và SEO");
  });

  it("falls back to the module's default agent pair when no rule matches", () => {
    const plan = orchestrate({ currentRoute: "/portal/premium" });
    expect(plan?.selectedAgents.map((a) => a.id)).toEqual(
      getAgentsByModule("premium")
        .slice(0, 2)
        .map((a) => a.id)
    );
  });

  it("never exposes an Agent team for the Learning Journal module", () => {
    const plan = orchestrate({ currentRoute: "/portal/nhatkyhoctap" });
    expect(plan?.selectedAgents).toEqual([]);
    expect(plan?.actionPlan.map((s) => s.label)).not.toContain(expect.stringContaining("Mời"));
  });

  it("Sprint A.2 — Academy 'Bắt đầu Mission' click changes the Companion message with the real mission title", () => {
    const plan = orchestrate({ currentRoute: "/portal/hocvienai", userGoal: "Xây kênh TikTok đầu tiên" });
    expect(plan?.companionMessage).toContain("Xây kênh TikTok đầu tiên");
    expect(plan?.selectedAgents.length).toBeGreaterThan(0);
  });

  it("Sprint A.2 — CKOS 'Thực hành' click selects the practice agent team", () => {
    const plan = orchestrate({ currentRoute: "/portal/hetrithucai/slug", userGoal: "thực hành Prompt cơ bản" });
    expect(plan?.selectedAgents.map((a) => a.id)).toEqual(["ckos-prompt-agent", "ckos-reviewer"]);
    expect(plan?.companionMessage).toContain("Prompt cơ bản");
  });

  it("Sprint A.2 — Opportunities 'Phân tích dự án' vs 'Lập kế hoạch áp dụng' select different agent teams", () => {
    const analysisPlan = orchestrate({ currentRoute: "/portal/duan-cohoi", userGoal: "phân tích dự án SolarGroup" });
    const planPlan = orchestrate({ currentRoute: "/portal/duan-cohoi", userGoal: "lập kế hoạch áp dụng SolarGroup" });
    expect(analysisPlan?.selectedAgents.map((a) => a.id)).toEqual(["project-analyst", "risk-analyst"]);
    expect(planPlan?.selectedAgents.map((a) => a.id)).toEqual(["strategy-agent", "action-planner"]);
    expect(analysisPlan?.companionMessage).not.toBe(planPlan?.companionMessage);
  });

  it("builds an action plan with a done step per invited agent and a pending synthesis step", () => {
    const plan = orchestrate({ currentRoute: "/portal/duan-cohoi", userGoal: "đánh giá rủi ro" });
    expect(plan?.actionPlan[0]).toEqual({ id: "understand-goal", label: "Hiểu mục tiêu", status: "done" });
    expect(plan?.actionPlan.at(-1)?.status).toBe("pending");
    expect(plan?.actionPlan.filter((s) => s.status === "done").length).toBe(
      1 + (plan?.selectedAgents.length ?? 0)
    );
  });
});
