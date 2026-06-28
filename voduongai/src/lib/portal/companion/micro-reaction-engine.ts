/**
 * Micro-Reaction Engine (Sprint 13.3 — Soulful Micro-Reactions, Nhiệm
 * vụ 03/06/07). Quyết định Companion có nói một micro-line khi bị
 * chạm/click hay không — KHÔNG phải mọi cú chạm đều có lời (Soulful
 * Silence: ~30% chỉ phản ứng hình ảnh, không lời). Rule-based, không
 * AI. Xem `docs/COMPANION_SOULFUL_REACTIONS.md`.
 */

import { MICRO_REACTIONS, type MicroReactionGroup } from "@/lib/portal/companion/micro-reactions";
import type { CompanionMoodKey } from "@/lib/portal/companion/companion-mood";

const MICRO_REACTION_COOLDOWN_MS = 10000;
const LAST_SHOWN_AT_KEY = "companion-micro-last-shown-at";
const SESSION_SHOWN_IDS_KEY = "companion-micro-session-shown-ids";

/** Mood hiện diện hiện tại quyết định nhóm micro-line nào phù hợp nhất (Nhiệm vụ 02 + 05). */
const MOOD_TO_GROUP: Record<CompanionMoodKey, MicroReactionGroup> = {
  quiet: "quiet-presence",
  curious: "curious",
  welcoming: "comeback",
  reflecting: "garden-aware",
  happy: "touch-greeting",
  thoughtful: "encouragement",
  waiting: "waiting",
  "story-ready": "story-ready",
};

export type MicroReactionSession = {
  isSpaceOpen: boolean;
  isMinimized: boolean;
  isTypingInput: boolean;
};

function readSessionShownIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(SESSION_SHOWN_IDS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function readLastShownAt(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.sessionStorage.getItem(LAST_SHOWN_AT_KEY) ?? 0);
  } catch {
    return 0;
  }
}

function markReactionTurn(now: number, reactionId?: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(LAST_SHOWN_AT_KEY, String(now));
    if (reactionId) {
      const shown = readSessionShownIds();
      shown.add(reactionId);
      window.sessionStorage.setItem(SESSION_SHOWN_IDS_KEY, JSON.stringify(Array.from(shown)));
    }
  } catch {
    // bỏ qua nếu sessionStorage không khả dụng
  }
}

/**
 * Gọi mỗi khi người dùng chạm/click Companion. Trả về một câu micro-line
 * phù hợp với mood hiện tại, hoặc `null` nếu: đang trong cooldown, hoặc
 * đây là một trong số lần "im lặng có chủ đích" (Soulful Silence — Nhiệm
 * vụ 07, ~30%), hoặc bị chặn bởi quy tắc anti-spam (Nhiệm vụ 06).
 * `now` nên là `Date.now()` tại nơi gọi.
 */
export function pickTouchMicroLine(
  mood: CompanionMoodKey,
  session: MicroReactionSession,
  now: number
): string | null {
  if (session.isSpaceOpen) return null;
  if (session.isMinimized) return null;
  if (session.isTypingInput) return null;

  const lastShownAt = readLastShownAt();
  if (lastShownAt && now - lastShownAt < MICRO_REACTION_COOLDOWN_MS) return null;

  // Soulful Silence — khoảng 30% các lần chạm chỉ phản ứng hình ảnh, không lời.
  const isSilentTurn = now % 10 < 3;
  if (isSilentTurn) {
    markReactionTurn(now);
    return null;
  }

  const sessionShownIds = readSessionShownIds();
  const targetGroup = MOOD_TO_GROUP[mood];
  const inGroup = MICRO_REACTIONS.filter((r) => r.group === targetGroup && !sessionShownIds.has(r.id));
  const pool = inGroup.length > 0 ? inGroup : MICRO_REACTIONS.filter((r) => !sessionShownIds.has(r.id));

  if (pool.length === 0) {
    markReactionTurn(now);
    return null;
  }

  const picked = pool[now % pool.length];
  markReactionTurn(now, picked.id);
  return picked.text;
}
