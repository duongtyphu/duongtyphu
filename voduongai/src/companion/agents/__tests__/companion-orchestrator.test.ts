import { describe, expect, it } from "vitest";
import { orchestrate } from "../companion-orchestrator";
import { getAgentsByModule } from "../agent-registry";
import { getModuleForRoute } from "../module-agent-map";

describe("companion-orchestrator", () => {
  it("returns null for routes outside the 8 orchestrated modules", () => {
    expect(orchestrate({ currentRoute: "/portal/tools" })).toBeNull();
  });

  it("maps routes to the correct module", () => {
    expect(getModuleForRoute("/portal/academy/mission-1")).toBe("academy");
    expect(getModuleForRoute("/portal/khu-vuon-cua-ban")).toBe("living-garden");
    expect(getModuleForRoute("/portal/news")).toBe("learning-journal");
  });

  it("selects the Landing Page mission team from the amendment example", () => {
    const plan = orchestrate({ currentRoute: "/portal/academy", userGoal: "Tạo Landing Page" });
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
    const plan = orchestrate({ currentRoute: "/portal/news" });
    expect(plan?.selectedAgents).toEqual([]);
    expect(plan?.actionPlan.map((s) => s.label)).not.toContain(expect.stringContaining("Mời"));
  });

  it("builds an action plan with a done step per invited agent and a pending synthesis step", () => {
    const plan = orchestrate({ currentRoute: "/portal/opportunities", userGoal: "đánh giá rủi ro" });
    expect(plan?.actionPlan[0]).toEqual({ id: "understand-goal", label: "Hiểu mục tiêu", status: "done" });
    expect(plan?.actionPlan.at(-1)?.status).toBe("pending");
    expect(plan?.actionPlan.filter((s) => s.status === "done").length).toBe(
      1 + (plan?.selectedAgents.length ?? 0)
    );
  });
});
