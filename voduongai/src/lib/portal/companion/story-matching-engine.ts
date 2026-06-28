/**
 * Story Matching Engine (Sprint 13.2 — Living Stories Engine, Nhiệm vụ
 * 04). Chọn một `LivingStory` phù hợp tại thời điểm hiện tại, hoặc
 * `null` — rule-based, không AI, cùng triết lý với
 * `proactive-thought-engine.ts` (Sprint 13.1). Xem
 * `docs/LIVING_STORIES_ENGINE.md`.
 */

import { LIVING_STORIES, type LivingStory, type StoryTrigger } from "@/lib/portal/companion/living-stories";
import { isProactiveThoughtsPaused } from "@/lib/portal/companion/proactive-thought-engine";

const STORY_COOLDOWN_KEY = "companion-story-last-shown-at";
const STORY_SESSION_SHOWN_IDS_KEY = "companion-story-session-shown-ids";

/** Story ưu tiên ngữ cảnh hơn story "nền" (Companion Story/Quiet Story luôn dùng được). */
const TRIGGER_CONTEXT_WEIGHT: Record<StoryTrigger, number> = {
  "garden-signal": 5,
  "reflection-meaning": 5,
  knowledge: 3,
  build: 3,
  story: 3,
  comeback: 2,
  "idle-presence": 1,
};

export type StoryMatchSessionState = {
  isSpaceOpen: boolean;
  isMinimized: boolean;
  isTypingInput: boolean;
  timeOnPageMs: number;
  isComeback?: boolean;
};

export type StoryMatchSignals = {
  pathname: string;
  gardenStage?: string;
  reflectionMeaning?: string;
};

/** Không kể chuyện ngay khi vừa vào trang — cần một khoảng ổn định trước. */
const MIN_IDLE_MS = 10000;

function readSessionShownIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(STORY_SESSION_SHOWN_IDS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function readLastShownAt(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.sessionStorage.getItem(STORY_COOLDOWN_KEY) ?? 0);
  } catch {
    return 0;
  }
}

/** Ghi nhận một story vừa được kể — dùng cooldown + chống lặp trong session. */
export function markStoryShown(story: LivingStory, now: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORY_COOLDOWN_KEY, String(now));
    const shown = readSessionShownIds();
    shown.add(story.id);
    window.sessionStorage.setItem(STORY_SESSION_SHOWN_IDS_KEY, JSON.stringify(Array.from(shown)));
  } catch {
    // bỏ qua nếu sessionStorage không khả dụng
  }
}

function weightedPick(candidates: LivingStory[], now: number): LivingStory | null {
  if (candidates.length === 0) return null;
  const weighted = candidates.flatMap((story) => {
    const weight = TRIGGER_CONTEXT_WEIGHT[story.trigger] ?? 1;
    return Array.from({ length: weight }, () => story);
  });
  const index = now % weighted.length;
  return weighted[index];
}

/**
 * Chọn một story phù hợp, hoặc `null` nếu chưa đến lúc/không có gì phù
 * hợp. `now` nên là `Date.now()` tại nơi gọi.
 */
export function pickLivingStory(
  signals: StoryMatchSignals,
  session: StoryMatchSessionState,
  now: number
): LivingStory | null {
  if (session.isSpaceOpen) return null;
  if (session.isMinimized) return null;
  if (session.isTypingInput) return null;
  if (isProactiveThoughtsPaused()) return null;
  if (session.timeOnPageMs < MIN_IDLE_MS) return null;

  const lastShownAt = readLastShownAt();
  const sessionShownIds = readSessionShownIds();

  const eligible = LIVING_STORIES.filter((story) => {
    if (sessionShownIds.has(story.id)) return false;
    if (lastShownAt > 0 && now - lastShownAt < story.cooldownMs) return false;
    if (story.trigger === "comeback" && !session.isComeback) return false;
    if (story.gardenStages.length > 0 && (!signals.gardenStage || !story.gardenStages.includes(signals.gardenStage))) {
      return false;
    }
    if (story.trigger === "reflection-meaning" && !signals.reflectionMeaning) return false;
    if (
      story.meaningTags.length > 0 &&
      signals.reflectionMeaning &&
      !story.meaningTags.includes(signals.reflectionMeaning) &&
      story.gardenStages.length === 0
    ) {
      return false;
    }
    if (story.suitableRoutes.length > 0 && !story.suitableRoutes.some((prefix) => signals.pathname.startsWith(prefix))) {
      return false;
    }
    if (story.shouldShow && !story.shouldShow(signals)) return false;
    return true;
  });

  if (eligible.length === 0) return null;

  // Nếu có tín hiệu mạnh (Garden/Reflection), ưu tiên story ngữ cảnh hơn Companion/Quiet Story nền.
  const contextual = eligible.filter((s) => s.trigger !== "idle-presence");
  const pool = contextual.length > 0 ? contextual : eligible;

  return weightedPick(pool, now);
}
