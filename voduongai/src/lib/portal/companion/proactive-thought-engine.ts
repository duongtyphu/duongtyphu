/**
 * Proactive Thought Engine (Sprint 13.1 — Companion Proactive Thoughts,
 * Nhiệm vụ 03/05/06/07). Chọn một `CompanionThought` (hoặc không chọn gì)
 * dựa trên `PortalSignals` hiện tại + trạng thái phiên — KHÔNG phải AI,
 * chỉ rule-based + weighted random có chủ đích (xem
 * `docs/COMPANION_PROACTIVE_THOUGHTS.md`).
 *
 * Quy tắc cứng (không thay đổi bởi context):
 * - Không hiện nhiều hơn 1 thought mỗi vài phút (`GLOBAL_COOLDOWN_MS`).
 * - Không hiện lại cùng thought trong cùng session.
 * - Không hiện khi CompanionSpace đang mở, khi user đang nhập input, khi
 *   Companion đã bị minimize, hoặc khi người dùng đã tạm ẩn proactive
 *   thoughts trong session này.
 */

import {
  PROACTIVE_THOUGHTS,
  type CompanionThought,
  type ThoughtTrigger,
} from "@/lib/portal/companion/proactive-thoughts";
import { DAILY_THOUGHTS, type DailyThought } from "@/lib/portal/companion/daily-thought-library";
import {
  mapContextToSource,
  shouldShowDailyThoughtToday,
  type ThoughtContext,
} from "@/lib/portal/companion/daily-thought-source";

/**
 * Sprint 18.5 — The Daily Thought đăng ký vào đây như MỘT Thought Source
 * bổ sung, không phải một Delivery Engine khác. `ALL_THOUGHTS` là danh
 * sách engine thực sự đọc — Proactive Thoughts (13.1) và Daily Thought
 * (18.5) cùng đi qua một cơ chế cooldown/storage/silence duy nhất.
 */
const ALL_THOUGHTS: CompanionThought[] = [...PROACTIVE_THOUGHTS, ...DAILY_THOUGHTS];

const GLOBAL_COOLDOWN_MS = 1000 * 60 * 3; // không hiện thought nào sớm hơn 3 phút sau thought trước
const LAST_SHOWN_AT_KEY = "companion-proactive-last-shown-at";
const LAST_SHOWN_TRIGGER_KEY = "companion-proactive-last-shown-trigger";
const SESSION_SHOWN_IDS_KEY = "companion-proactive-session-shown-ids";
const SESSION_PAUSED_KEY = "companion-proactive-session-paused";

/** Trigger nào được ưu tiên hơn idle khi nhiều thought cùng đủ điều kiện (NV06). */
const TRIGGER_CONTEXT_WEIGHT: Record<ThoughtTrigger, number> = {
  "garden-signal": 5,
  "reflection-meaning": 5,
  comeback: 4,
  knowledge: 3,
  build: 3,
  story: 3,
  "next-small-step": 2,
  "quiet-presence": 2,
  hope: 2,
  "idle-presence": 1,
  "daily-thought": 4,
};

export type ProactiveSessionState = {
  isSpaceOpen: boolean;
  isMinimized: boolean;
  isTypingInput: boolean;
  /** Trang hiện tại đã ổn định (route không vừa đổi) bao lâu, tính bằng ms. */
  timeOnPageMs: number;
  /** Phiên người dùng vừa quay lại sau một khoảng vắng (đọc từ comeback gap đã có ở CompanionGreetingBubble). */
  isComeback?: boolean;
  reducedMotion?: boolean;
};

export type ProactiveSignals = {
  pathname: string;
  gardenStage?: string;
  reflectionMeaning?: string;
  /** Sprint 18.5 — ngữ cảnh để Thought Selector xét nguồn Daily Thought nào phù hợp. */
  dailyThoughtContext?: ThoughtContext;
};

/** NV05 — Natural Timing: chờ ít nhất một khoảng lặng (8-15s) sau khi route ổn định trước khi nói. */
const MIN_IDLE_MS = 8000;

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

/** NV07 — Người dùng tạm ẩn proactive thoughts cho session hiện tại. */
export function isProactiveThoughtsPaused(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SESSION_PAUSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function pauseProactiveThoughtsForSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_PAUSED_KEY, "1");
  } catch {
    // bỏ qua nếu sessionStorage không khả dụng
  }
}

/** Ghi nhận một thought vừa được hiển thị — dùng cooldown + chống lặp trong session. */
export function markThoughtShown(thought: CompanionThought, now: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(LAST_SHOWN_AT_KEY, String(now));
    window.sessionStorage.setItem(LAST_SHOWN_TRIGGER_KEY, thought.trigger);
    const shown = readSessionShownIds();
    shown.add(thought.id);
    window.sessionStorage.setItem(SESSION_SHOWN_IDS_KEY, JSON.stringify(Array.from(shown)));
  } catch {
    // bỏ qua nếu sessionStorage không khả dụng
  }
}

function weightedPick(candidates: CompanionThought[], now: number): CompanionThought | null {
  if (candidates.length === 0) return null;
  const weighted = candidates.flatMap((thought) => {
    const priorityWeight = thought.priority === "high" ? 3 : thought.priority === "medium" ? 2 : 1;
    const contextWeight = TRIGGER_CONTEXT_WEIGHT[thought.trigger] ?? 1;
    const weight = priorityWeight * contextWeight;
    return Array.from({ length: weight }, () => thought);
  });
  // Chỉ số giả-ngẫu nhiên có chủ đích: phụ thuộc `now` để khác nhau mỗi lần gọi
  // mà không cần Math.random() ở mọi nơi gọi engine (engine vẫn có thể nhận seed riêng nếu cần test).
  const index = now % weighted.length;
  return weighted[index];
}

/**
 * Chọn một thought phù hợp tại thời điểm hiện tại, hoặc null nếu chưa đến
 * lúc/không có gì phù hợp. `now` nên là `Date.now()` tại nơi gọi (không gọi
 * Date.now() bên trong để engine vẫn test được dễ dàng).
 */
export function pickProactiveThought(
  signals: ProactiveSignals,
  session: ProactiveSessionState,
  now: number
): CompanionThought | null {
  if (session.isSpaceOpen) return null;
  if (session.isMinimized) return null;
  if (session.isTypingInput) return null;
  if (isProactiveThoughtsPaused()) return null;

  // NV05 — Natural Timing: không nói ngay khi vừa vào trang, không nói khi route vừa đổi liên tục.
  if (session.timeOnPageMs < MIN_IDLE_MS) return null;

  const lastShownAt = readLastShownAt();
  if (lastShownAt && now - lastShownAt < GLOBAL_COOLDOWN_MS) return null;

  const sessionShownIds = readSessionShownIds();

  const dailyThoughtContext = signals.dailyThoughtContext ?? {};

  const eligible = ALL_THOUGHTS.filter((thought) => {
    if (sessionShownIds.has(thought.id)) return false;
    if (now - lastShownAt < thought.cooldownMs && lastShownAt > 0) return false;
    if (thought.trigger === "comeback" && !session.isComeback) return false;
    if (thought.trigger === "garden-signal" && !signals.gardenStage) return false;
    if (thought.trigger === "reflection-meaning" && !signals.reflectionMeaning) return false;
    if (thought.trigger === "daily-thought") {
      // Sprint 18.5 — Soulful Silence: phần lớn các lần engine chạy, Daily
      // Thought không đủ điều kiện gì cả (NV08), kể cả khi có tín hiệu.
      //
      // Sprint 18.7 — Living Experiences: câu hỏi ở đây KHÔNG phải "hôm nay
      // nói gì?" (chọn một câu rồi đi tìm lý do) — `mapContextToSource` hỏi
      // "Companion vừa trải qua điều gì?" trước (tín hiệu thật từ context),
      // rồi mới tìm câu khớp đúng nguồn trải nghiệm đó. Mỗi câu khớp được
      // còn truy ngược tiếp được về một `LivingExperience` cụ thể qua
      // `experienceId` (xem `daily-thought-library.ts`, `living-experience.ts`).
      if (!shouldShowDailyThoughtToday(dailyThoughtContext, now)) return false;
      const source = mapContextToSource(dailyThoughtContext);
      const thoughtSource = (thought as DailyThought).source;
      if (!source || thoughtSource !== source) return false;
    }
    if (thought.shouldShow && !thought.shouldShow(signals)) return false;
    return true;
  });

  if (eligible.length === 0) return null;

  // NV06 — Purposeful Randomness: ưu tiên context-relevant trước idle, không chọn câu tạo áp lực
  // (mọi câu trong thư viện đã được viết theo ranh giới này — engine chỉ cần ưu tiên trigger đúng context).
  const contextual = eligible.filter((t) => t.trigger !== "idle-presence" && t.trigger !== "next-small-step");
  const pool = contextual.length > 0 ? contextual : eligible;

  return weightedPick(pool, now);
}
