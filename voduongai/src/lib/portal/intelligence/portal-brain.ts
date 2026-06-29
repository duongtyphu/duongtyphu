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
import { applyCharacterReview, applyIntegrityCheck } from "@/lib/portal/intelligence/character-engine";
import type { ReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";
import { getCoreMemories, type CoreMemory } from "@/lib/portal/companion/core-memory";
import { getCharacterMemory } from "@/lib/portal/companion/character-memory";
import { generateInnerThought } from "@/lib/portal/companion/inner-thought-engine";

/**
 * Sprint 13.2 — gợi ý nhẹ, chỉ khi GardenStage cho thấy rõ một story
 * Garden phù hợp. Không phải toàn bộ thư viện Living Stories — chỉ map
 * tối thiểu để Portal Brain "biết" có gợi ý hay không, việc chọn thật
 * (cooldown, đã kể chưa, ngữ cảnh khác) vẫn do `story-matching-engine.ts` quyết định.
 */
const GARDEN_STORY_SUGGESTION: Partial<Record<GardenStage, { id: string; reason: string }>> = {
  sprouting: { id: "garden-the-first-leaf", reason: "Khu vườn vừa có dấu hiệu nảy mầm." },
  rooting: { id: "garden-roots-before-flowers", reason: "Khu vườn đang ở giai đoạn bén rễ, chưa thấy hoa." },
};

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
  /**
   * Sprint 18.9 — Core Memory Engine (NV03). Companion Decision đọc Core
   * Memory như một tầng ký ức nền — KHÔNG để hiển thị thành câu nói (đó
   * vẫn là việc riêng của Origin Line ở 5 ngữ cảnh hẹp, xem
   * `core-memory.ts`), chỉ để Portal Brain "mang theo" điều không bao giờ
   * được quên khi ra quyết định. Hôm nay chưa có nhánh rẽ hành vi cụ thể
   * dựa trên trường này — đây là nền tảng đọc được, không phải hành vi
   * mới; việc thật sự đổi nhánh quyết định theo Core Memory là bước tiếp
   * theo, không làm trong sprint này để tránh suy đoán hành vi trước khi
   * có nhu cầu thật.
   */
  coreMemoryHeard: CoreMemory[];
  /**
   * Sprint 19.0 — Living Wisdom System (Reflection → Lesson). Bài học
   * Companion TỰ RÚT RA cho mình từ Reflection — KHÔNG phải câu nó nói
   * với người dùng (đó là `companionInsight`). Tách biệt rõ Lesson
   * (nhận thức nội tâm, hướng về Companion) khỏi Action (câu nói,
   * hướng về người dùng), đúng chuỗi 8 bước ở
   * `docs/THE_LIVING_WISDOM_SYSTEM.md`. `null` khi không có
   * `reflectionMeaning` — không suy đoán Lesson khi không có Reflection
   * thật. Không lưu trữ lại sau khi tính toán xong.
   */
  lessonObserved: string | null;
  /**
   * Sprint 13.2 — Living Stories Engine. KHÔNG bắt buộc: chỉ có giá trị
   * khi tín hiệu đủ rõ để gợi ý một story cụ thể (hiện tại: có
   * GardenStage). Companion chỉ thực sự kể chuyện qua
   * `story-matching-engine.ts` (áp thêm cooldown/session rule riêng) —
   * trường này chỉ là một gợi ý nhẹ, không phải lệnh "phải kể".
   */
  suggestedStoryId?: string;
  storyReason?: string;
  /**
   * Sprint 20.4 — The Inner Life. KHÁC `lessonObserved` (rút ra từ một
   * Reflection đơn lẻ, mất đi ngay sau lần tính đó) — Inner Thought chỉ
   * tồn tại khi Lesson đã lặp lại đủ để chuyển hoá thành Character
   * (`getCharacterMemory()`, Sprint 20.3). `null` khi Character Memory
   * rỗng — không có Character thật, không có Inner Thought, đúng
   * `docs/INNER_LIFE.md`.
   */
  innerThought: string | null;
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

/**
 * Sprint 19.0 — Living Wisdom System (Reflection → Lesson). Câu Lesson
 * Companion tự nói với CHÍNH NÓ, khác hẳn câu nó nói với người dùng ở
 * `COMPANION_REFLECTION_RESPONSE` — không xếp hạng, không đánh giá
 * người dùng (đúng ràng buộc Immutable ở `reflection-meaning.ts`),
 * không bao giờ hiển thị ra UI.
 */
const LESSON_FROM_REFLECTION: Record<ReflectionMeaning, string> = {
  persistence: "Sự quay lại, không phải kết quả, là điều đáng được công nhận trước tiên.",
  curiosity: "Một câu hỏi thật lòng quan trọng hơn một câu trả lời sẵn có.",
  courage: "Điều khó nói ra thường là điều đáng được lắng nghe kỹ nhất.",
  humility: "Nhìn thấy giới hạn của chính mình là một bước trưởng thành, không phải một thất bại.",
  contribution: "Khi một người nghĩ đến người khác, đó là lúc Companion nên lùi lại, không cần thêm gì.",
  gratitude: "Biết ơn không cần được xác nhận lại bằng lời khen.",
  recovery: "Nghỉ ngơi là một quyết định, không phải một sự dừng lại.",
  focus: "Sự có mặt trọn vẹn trong một khoảnh khắc không cần được đo bằng thời lượng.",
  discovery: "Một nhận ra mới luôn cần không gian, không cần được vội vàng diễn giải thêm.",
  responsibility: "Một lời cam kết với chính mình quan trọng hơn một lời cam kết được tuyên bố.",
};

/**
 * Sprint 19.1 — The First Experience Verification. Trước Sprint này,
 * Meaning chỉ đổi CÂU CHỮ (`COMPANION_REFLECTION_RESPONSE`) — không hề
 * ảnh hưởng tới `companionState`/`recommendedTone` (phần thật sự là
 * QUYẾT ĐỊNH của Portal Brain). Theo đúng phân biệt "Meaning chỉ đổi
 * Copy = chưa đủ, Meaning phải đổi Decision" — bảng này là lần đầu
 * Meaning có quyền với Decision, không chỉ với lời nói.
 */
const MEANING_TO_TONE: Record<ReflectionMeaning, CompanionTone> = {
  persistence: "encouraging",
  curiosity: "encouraging",
  courage: "warm-quiet",
  humility: "warm-quiet",
  contribution: "celebratory",
  gratitude: "warm-quiet",
  recovery: "warm-quiet",
  focus: "encouraging",
  discovery: "celebratory",
  responsibility: "encouraging",
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
 *
 * Sprint 19.0 (Verification Era) — Nhiệm vụ 3: Lesson → Meaning. Câu
 * trả lời theo Meaning (`COMPANION_REFLECTION_RESPONSE`) giờ CHỈ được
 * nói ra khi Companion đã tự rút được một `lessonObserved` trước đó —
 * nếu không có Lesson, Companion không dùng câu trả lời riêng theo ý
 * nghĩa, nó lùi về câu nói chung của tiếng nói nội tâm
 * (`voice.line`). Đây là một ràng buộc thật trong code, không chỉ một
 * comment mô tả thứ tự — Meaning không còn được phép tự đứng một mình
 * trước người dùng mà không đi qua Lesson trước.
 */
function companionResponseToVoice(
  voice: VoiceMessage,
  signals: PortalSignals,
  lessonObserved: string | null
): string {
  if (voice.voice === "reflection" && signals.reflectionMeaning && lessonObserved) {
    return COMPANION_REFLECTION_RESPONSE[signals.reflectionMeaning];
  }
  return voice.line;
}

export function getCompanionDecision(signals: PortalSignals): CompanionDecision {
  const routeState = getStateForPath(signals.pathname);
  const routeGreeting = getRouteGreeting(signals.pathname);
  const voicesHeard = collectInternalVoices(signals);
  // Sprint 20.1 — Character Engine. Character không thay thế Decision —
  // nó chỉ xem lại các Decision Candidate trước khi cái to nhất được
  // chọn, và chỉ đổi thứ tự giữa các candidate cùng priority (xem
  // `character-engine.ts`). `voicesHeard` trả về vẫn là danh sách gốc,
  // chưa qua Character Review — chỉ ảnh hưởng tới việc chọn `loudest`.
  // Sprint 20.3 — Integrity Check. Sau Character Review (đổi thứ tự),
  // trước khi `loudestVoice()` chọn, Integrity Check được quyền CHẶN
  // một candidate mâu thuẫn với Character Memory đã chuyển hoá của
  // CHÍNH người dùng này — `docs/CHARACTER_MEMORY.md`. Đây là nơi
  // Integrity từ một phẩm chất khai báo (`CHARACTER_PROFILE`) trở thành
  // một thay đổi Decision thật.
  const characterMemory = getCharacterMemory();
  const loudest = loudestVoice(
    applyIntegrityCheck(applyCharacterReview(voicesHeard), characterMemory)
  );
  // Sprint 19.0 — Lesson được rút ra TRƯỚC khi Meaning được phép trở
  // thành một câu nói công khai (Reflection → Lesson → Meaning).
  const lessonObserved = signals.reflectionMeaning
    ? LESSON_FROM_REFLECTION[signals.reflectionMeaning]
    : null;
  const insightFromVoice = loudest ? companionResponseToVoice(loudest, signals, lessonObserved) : null;
  const coreMemoryHeard = getCoreMemories();
  // Sprint 20.4 — The Inner Life. Đọc Character Memory THẬT (đã tính ở
  // trên cho Integrity Check), không tính lại — Inner Thought chỉ ra
  // đời khi chuỗi Experience→...→Character đã thật sự xảy ra.
  const innerThought = generateInnerThought(characterMemory)?.line ?? null;

  if (!signals.gardenStage) {
    // Sprint 19.1 — Meaning chỉ được tính là một Decision thật khi nó
    // đổi companionState/recommendedTone, không chỉ câu nói. Cùng điều
    // kiện gate với Lesson (`lessonObserved`) ở NHIỆM VỤ 3 Sprint 19.0.
    const meaningTone = signals.reflectionMeaning && lessonObserved
      ? MEANING_TO_TONE[signals.reflectionMeaning]
      : null;
    const recommendedTone = meaningTone ?? "neutral";
    const companionState = meaningTone ? states[TONE_TO_STATE[meaningTone]] : routeState;
    return {
      companionState,
      companionGreeting: routeGreeting,
      companionInsight: insightFromVoice,
      recommendedTone,
      shouldSpeak: Boolean(routeGreeting) || Boolean(loudest),
      silenceReason: routeGreeting || loudest ? undefined : "no-signal",
      voicesHeard,
      coreMemoryHeard,
      lessonObserved,
      innerThought,
    };
  }

  const gardenCopy = GARDEN_COPY[signals.gardenStage];
  const companionState = states[TONE_TO_STATE[gardenCopy.tone]];
  const storySuggestion = GARDEN_STORY_SUGGESTION[signals.gardenStage];

  return {
    companionState,
    companionGreeting: gardenCopy.greeting,
    companionInsight: insightFromVoice ?? gardenCopy.greeting,
    recommendedTone: gardenCopy.tone,
    shouldSpeak: true,
    voicesHeard,
    coreMemoryHeard,
    lessonObserved,
    innerThought,
    suggestedStoryId: storySuggestion?.id,
    storyReason: storySuggestion?.reason,
  };
}
