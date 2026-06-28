import { describe, it, expect, beforeEach, vi } from "vitest";
import type { LivingStory } from "@/lib/portal/companion/living-stories";

const { LIVING_STORIES } = vi.hoisted(() => {
  const HOUR = 1000 * 60 * 60;
  const base = {
    body: "thân bài",
    closingLine: "câu kết",
    boundaryNote: "test fixture — không phải dữ liệu người dùng thật",
  };
  const stories: LivingStory[] = [
    {
      ...base,
      id: "fixture-idle",
      title: "Companion Story nền",
      type: "companion-story",
      meaningTags: [],
      gardenStages: [],
      suitableRoutes: [],
      tone: "warm-quiet",
      trigger: "idle-presence",
      cooldownMs: HOUR,
    },
    {
      ...base,
      id: "fixture-quiet",
      title: "Quiet Story nền",
      type: "quiet-story",
      meaningTags: [],
      gardenStages: [],
      suitableRoutes: [],
      tone: "reflective",
      trigger: "idle-presence",
      cooldownMs: HOUR,
    },
    {
      ...base,
      id: "fixture-reflection",
      title: "Story theo ReflectionMeaning",
      type: "wisdom-story",
      meaningTags: ["gratitude"],
      gardenStages: [],
      suitableRoutes: [],
      tone: "reflective",
      trigger: "reflection-meaning",
      cooldownMs: HOUR,
    },
    {
      ...base,
      id: "fixture-garden",
      title: "Story theo GardenStage",
      type: "garden-story",
      meaningTags: [],
      gardenStages: ["blooming"],
      suitableRoutes: [],
      tone: "encouraging",
      trigger: "garden-signal",
      cooldownMs: HOUR,
    },
  ];
  return { LIVING_STORIES: stories };
});

vi.mock("@/lib/portal/companion/living-stories", async () => {
  const actual = await vi.importActual<typeof import("@/lib/portal/companion/living-stories")>(
    "@/lib/portal/companion/living-stories"
  );
  return { ...actual, LIVING_STORIES };
});

import { pickLivingStory, markStoryShown } from "@/lib/portal/companion/story-matching-engine";
import { pauseProactiveThoughtsForSession } from "@/lib/portal/companion/proactive-thought-engine";

const baseSession = {
  isSpaceOpen: false,
  isMinimized: false,
  isTypingInput: false,
  timeOnPageMs: 20000,
};

const baseSignals = {
  pathname: "/portal",
};

beforeEach(() => {
  window.sessionStorage.clear();
});

describe("pickLivingStory", () => {
  it("không trả story khi cooldown đang active", () => {
    const now = 1_000_000;
    const first = pickLivingStory(baseSignals, baseSession, now);
    expect(first).not.toBeNull();
    if (first) markStoryShown(first, now);

    const second = pickLivingStory(baseSignals, baseSession, now + 1000);
    expect(second).toBeNull();
  });

  it("ưu tiên story khớp ReflectionMeaning hơn story nền", () => {
    const now = 2_000_000;
    const picked = pickLivingStory({ ...baseSignals, reflectionMeaning: "gratitude" }, baseSession, now);
    expect(picked?.id).toBe("fixture-reflection");
  });

  it("ưu tiên story khớp GardenStage hơn story nền", () => {
    const now = 3_000_000;
    const picked = pickLivingStory({ ...baseSignals, gardenStage: "blooming" }, baseSession, now);
    expect(picked?.id).toBe("fixture-garden");
  });

  it("không lặp lại cùng một story trong session", () => {
    const now = 4_000_000;
    const shownIds = new Set<string>();
    for (let i = 0; i < 2; i++) {
      const picked = pickLivingStory(baseSignals, baseSession, now + i * 10_000_000);
      expect(picked).not.toBeNull();
      if (!picked) continue;
      expect(shownIds.has(picked.id)).toBe(false);
      shownIds.add(picked.id);
      markStoryShown(picked, now + i * 10_000_000);
    }
    // Sau khi cả 2 story nền (idle-presence) đã được kể trong session, không còn gì để trả.
    const third = pickLivingStory(baseSignals, baseSession, now + 2 * 10_000_000);
    expect(third).toBeNull();
  });

  it("fallback về Companion/Quiet Story (idle-presence) khi thiếu mọi tín hiệu", () => {
    const now = 5_000_000;
    const picked = pickLivingStory(baseSignals, baseSession, now);
    expect(picked).not.toBeNull();
    expect(["fixture-idle", "fixture-quiet"]).toContain(picked?.id);
  });

  it("không trả story nếu user đã tắt proactive/story moments trong session", () => {
    pauseProactiveThoughtsForSession();
    const now = 6_000_000;
    const picked = pickLivingStory(baseSignals, baseSession, now);
    expect(picked).toBeNull();
  });
});
