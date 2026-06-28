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
import { collectInternalVoices, type VoiceMessage } from "@/lib/portal/intelligence/internal-voices";
import type { ReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";

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
  /**
   * Các tiếng nội tâm Portal Brain đã lắng nghe trước khi ra quyết
   * định này (Sprint 12.2). Không phải để hiển thị trực tiếp ra UI
   * dưới dạng debug — chỉ để Companion/Product Team thấy "đời sống nội
   * tâm" nào đang lên tiếng. Xem `docs/INTERNAL_VOICES_ARCHITECTURE.md`.
   */
  voicesHeard: VoiceMessage[];
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

/**
 * Sprint 12.3 — Nhiệm vụ 05. Companion KHÔNG lặp lại nguyên văn câu nói
 * của Reflection Voice — Companion lắng nghe ý nghĩa đó rồi đồng hành
 * theo cách của riêng nó (ấm áp, "mình", không phân tích). Không có
 * dòng nào nói "Reflection của bạn thuộc nhóm X".
 */
const COMPANION_REFLECTION_RESPONSE: Record<ReflectionMeaning, string> = {
  persistence: "Mình rất vui vì hôm nay bạn đã quay lại.",
  curiosity: "Mình thích sự tò mò của bạn hôm nay.",
  courage: "Mình thấy điều bạn vừa chia sẻ không dễ nói ra — cảm ơn bạn đã tin tưởng.",
  humility: "Không phải ai cũng dám nhìn lại chính mình như vậy — mình trân trọng điều đó.",
  contribution: "Mình rất vui vì hôm nay bạn đã nghĩ đến người khác.",
  gratitude: "Mình cảm nhận được sự ấm áp trong điều bạn vừa viết.",
  recovery: "Nghỉ ngơi hôm nay cũng là một bước tiến — mình ở đây cùng bạn.",
  focus: "Mình thấy bạn đã thật sự ở đây, trọn vẹn, hôm nay.",
  discovery: "Mình mừng vì bạn vừa nhận ra điều đó.",
  responsibility: "Mình tin vào điều bạn vừa cam kết với chính mình.",
};

const PRIORITY_RANK: Record<VoiceMessage["priority"], number> = {
  high: 2,
  medium: 1,
  low: 0,
};

function loudestVoice(voices: VoiceMessage[]): VoiceMessage | null {
  if (voices.length === 0) return null;
  return voices.reduce((loudest, voice) =>
    PRIORITY_RANK[voice.priority] > PRIORITY_RANK[loudest.priority] ? voice : loudest
  );
}

/**
 * Sprint 12.2 — Nhiệm vụ 05. Portal Brain không còn quyết định trực
 * tiếp từ tín hiệu thô — nó LẮNG NGHE các tiếng nói nội tâm trước:
 *
 *   Human Signals → Internal Voices → Portal Brain Decision → Companion
 *
 * Companion không tự nói một mình; nó đồng hành dựa trên tiếng nói nội
 * tâm đang lên tiếng to nhất lúc này (`loudestVoice`), Garden vẫn là
 * nguồn copy chính cho `companionGreeting`/`companionState` (giữ đúng
 * API NV1.2 cũ — không phá tương thích).
 */
/**
 * Companion không lặp lại nguyên văn tiếng nói nội tâm to nhất — nếu đó
 * là Reflection Voice, Companion dùng cách nói riêng của mình
 * (`COMPANION_REFLECTION_RESPONSE`); với các tiếng nói khác, Companion
 * hiện tại chỉ chuyển tiếp nguyên văn (chưa có lớp "dịch" riêng).
 */
function companionResponseToVoice(voice: VoiceMessage, signals: PortalSignals): string {
  if (voice.voice === "reflection" && signals.reflectionMeaning) {
    return COMPANION_REFLECTION_RESPONSE[signals.reflectionMeaning];
  }
  return voice.line;
}

export function getCompanionDecision(signals: PortalSignals): CompanionDecision {
  const routeState = getStateForPath(signals.pathname);
  const routeGreeting = getRouteGreeting(signals.pathname);
  const voicesHeard = collectInternalVoices(signals);
  const loudest = loudestVoice(voicesHeard);
  const insightFromVoice = loudest ? companionResponseToVoice(loudest, signals) : null;

  if (!signals.gardenStage) {
    return {
      companionState: routeState,
      companionGreeting: routeGreeting,
      companionInsight: insightFromVoice,
      recommendedTone: "neutral",
      shouldSpeak: Boolean(routeGreeting) || Boolean(loudest),
      silenceReason: routeGreeting || loudest ? undefined : "no-signal",
      voicesHeard,
    };
  }

  const gardenCopy = GARDEN_COPY[signals.gardenStage];
  const companionState = states[TONE_TO_STATE[gardenCopy.tone]];

  return {
    companionState,
    companionGreeting: gardenCopy.greeting,
    companionInsight: insightFromVoice ?? gardenCopy.greeting,
    recommendedTone: gardenCopy.tone,
    shouldSpeak: true,
    voicesHeard,
  };
}
