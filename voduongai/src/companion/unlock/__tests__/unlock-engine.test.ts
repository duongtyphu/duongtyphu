import { describe, expect, it } from "vitest";
import {
  isMissionConditionMet,
  markUsed,
  markViewed,
  nextAssetRuntimeStatus,
  withRuntimeStatus,
} from "../unlock-engine";
import { UNLOCK_ASSETS, LANDING_PAGE_MISSION_ID, getAssetsForMission } from "../unlock-assets";

describe("unlock-engine", () => {
  it("mission condition requires BOTH evidence and reflection", () => {
    expect(isMissionConditionMet({ evidenceLogged: false, reflectionWritten: false })).toBe(false);
    expect(isMissionConditionMet({ evidenceLogged: true, reflectionWritten: false })).toBe(false);
    expect(isMissionConditionMet({ evidenceLogged: false, reflectionWritten: true })).toBe(false);
    expect(isMissionConditionMet({ evidenceLogged: true, reflectionWritten: true })).toBe(true);
  });

  it("an asset starts locked and only becomes available once the condition is met", () => {
    const locked = nextAssetRuntimeStatus(undefined, false, 1000);
    expect(locked.status).toBe("locked");

    const stillLocked = nextAssetRuntimeStatus(locked, false, 2000);
    expect(stillLocked).toBe(locked);

    const nowAvailable = nextAssetRuntimeStatus(locked, true, 3000);
    expect(nowAvailable.status).toBe("available");
    expect(nowAvailable.unlockedAt).toBe(3000);
  });

  it("never downgrades an asset once available/unlocked/completed, even if condition is re-evaluated as false", () => {
    const available = nextAssetRuntimeStatus(undefined, true, 1000);
    const reEvaluated = nextAssetRuntimeStatus(available, false, 2000);
    expect(reEvaluated).toBe(available);
    expect(reEvaluated.status).toBe("available");
  });

  it("markViewed only transitions available -> unlocked, not locked -> unlocked", () => {
    const stillLocked = markViewed({ status: "locked" }, 1000);
    expect(stillLocked.status).toBe("locked");

    const unlocked = markViewed({ status: "available", unlockedAt: 500 }, 1000);
    expect(unlocked.status).toBe("unlocked");
    expect(unlocked.viewedAt).toBe(1000);
  });

  it("markUsed only transitions unlocked -> completed", () => {
    const stillAvailable = markUsed({ status: "available" }, 1000);
    expect(stillAvailable.status).toBe("available");

    const completed = markUsed({ status: "unlocked", viewedAt: 500 }, 1000);
    expect(completed.status).toBe("completed");
    expect(completed.usedAt).toBe(1000);
  });

  it("pilot registry has exactly one Prompt Pack, one Checklist, one Template for the Landing Page mission", () => {
    const assets = getAssetsForMission(LANDING_PAGE_MISSION_ID);
    expect(assets.map((a) => a.type).sort()).toEqual(["checklist", "prompt_pack", "template"]);
  });

  it("Prompt Pack has 5 real prompts, Checklist has 5 real items, Template has 3 real templates — no placeholders", () => {
    const promptPack = UNLOCK_ASSETS.find((a) => a.type === "prompt_pack")!;
    const checklist = UNLOCK_ASSETS.find((a) => a.type === "checklist")!;
    const template = UNLOCK_ASSETS.find((a) => a.type === "template")!;

    expect("prompts" in promptPack.content && promptPack.content.prompts.length).toBe(5);
    expect("items" in checklist.content && checklist.content.items.length).toBe(5);
    expect("templates" in template.content && template.content.templates.length).toBe(3);

    if ("prompts" in promptPack.content) {
      promptPack.content.prompts.forEach((p) => {
        expect(p.prompt.length).toBeGreaterThan(20);
        expect(p.prompt.toLowerCase()).not.toContain("placeholder");
      });
    }
  });

  it("withRuntimeStatus reflects locked before condition met, and unlocked assets stay unlocked across re-evaluation", () => {
    const before = withRuntimeStatus(UNLOCK_ASSETS, {}, {});
    expect(before.every((a) => a.runtimeStatus === "locked")).toBe(true);

    const met = withRuntimeStatus(
      UNLOCK_ASSETS,
      {},
      { [LANDING_PAGE_MISSION_ID]: { evidenceLogged: true, reflectionWritten: true } }
    );
    expect(met.every((a) => a.runtimeStatus === "available")).toBe(true);
  });
});
