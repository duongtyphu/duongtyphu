/**
 * Portal Brain (Sprint 12.1 — Nhiệm vụ 02). Mạch thần kinh đầu tiên của
 * Portal: nhận `PortalSignals` (tín hiệu về CON NGƯỜI, không phải về
 * module), quyết định Companion nên đồng hành như thế nào — KHÔNG trả
 * lời như chatbot, KHÔNG tạo văn bản AI tự do. Chỉ chọn giữa các trạng
 * thái/câu nói đã định nghĩa trước, dựa trên tín hiệu.
 *
 * Xem `docs/FIRST_INTELLIGENCE_CIRCUIT.md` cho triết lý đầy đủ:
 * Human Signals → Portal Brain → Companion, không nối module → module.
 */

import {
  getRouteGreeting,
  getStateForPath,
  states,
  type CompanionState,
  type CompanionStateKey,
} from "@/lib/portal/companion/companion-identity";
import type { GardenStage } from "@/lib/portal/living-garden/garden-model";
import type { PortalSignals } from "@/lib/portal/intelligence/portal-signals";

export type CompanionTone =
  | "warm-quiet"
  | "encouraging"
  | "celebratory"
  | "neutral";

export type CompanionDecision = {
  companionState: CompanionState;
  companionGreeting: string | null;
  companionInsight: string | null;
  recommendedTone: CompanionTone;
  shouldSpeak: boolean;
  silenceReason?: string;
};

/**
 * Nhiệm vụ 05 — copy theo từng GardenStage thật. Ngôn ngữ phát triển,
 * không điểm số/level/rank/leaderboard/lời khen sáo rỗng.
 */
const GARDEN_COPY: Record<GardenStage, { greeting: string; tone: CompanionTone }> = {
  dormant: {
    greeting:
      "Khu vườn của bạn đang chờ một hạt giống nhỏ. Không cần vội, mình ở đây cùng bạn.",
    tone: "warm-quiet",
  },
  sprouting: {
    greeting:
      "Mình thấy những bước đầu tiên đang xuất hiện. Một chút kiên trì hôm nay cũng rất đáng quý.",
    tone: "encouraging",
  },
  rooting: {
    greeting: "Có vẻ hành trình của bạn đang bắt đầu bén rễ.",
    tone: "encouraging",
  },
  rising: {
    greeting: "Mình thấy khu vườn của bạn đang lớn lên từ những bước nhỏ.",
    tone: "encouraging",
  },
  blooming: {
    greeting:
      "Một vài bông hoa đã nở. Không phải vì bạn chạy nhanh, mà vì bạn đã tiếp tục.",
    tone: "celebratory",
  },
  radiant: {
    greeting: "Khu vườn của bạn đang tỏa sáng theo cách rất riêng.",
    tone: "celebratory",
  },
};

const TONE_TO_STATE: Record<CompanionTone, CompanionStateKey> = {
  "warm-quiet": "listening",
  encouraging: "encouraging",
  celebratory: "celebrating",
  neutral: "idle",
};

export function getCompanionDecision(signals: PortalSignals): CompanionDecision {
  const routeState = getStateForPath(signals.pathname);
  const routeGreeting = getRouteGreeting(signals.pathname);

  if (!signals.gardenStage) {
    return {
      companionState: routeState,
      companionGreeting: routeGreeting,
      companionInsight: null,
      recommendedTone: "neutral",
      shouldSpeak: Boolean(routeGreeting),
      silenceReason: routeGreeting ? undefined : "no-signal",
    };
  }

  const gardenCopy = GARDEN_COPY[signals.gardenStage];
  const companionState = states[TONE_TO_STATE[gardenCopy.tone]];

  return {
    companionState,
    companionGreeting: gardenCopy.greeting,
    companionInsight: gardenCopy.greeting,
    recommendedTone: gardenCopy.tone,
    shouldSpeak: true,
  };
}
