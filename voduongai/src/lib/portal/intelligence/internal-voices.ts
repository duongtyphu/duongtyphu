/**
 * Internal Voices (Sprint 12.2). Portal không phải tập hợp module —
 * mỗi OS/Engine là một "tiếng nói bên trong" của hành trình con người
 * (xem `docs/INTERNAL_VOICES_ARCHITECTURE.md`). File này chỉ định
 * NGÔN NGỮ và CẤU TRÚC cho các tiếng nói đó — không AI thật, không kết
 * nối dữ liệu mới ngoài `PortalSignals` đã có.
 */

import type { PortalSignals } from "@/lib/portal/intelligence/portal-signals";
import type { ReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";

export type InternalVoiceKey =
  | "companion"
  | "garden"
  | "story"
  | "reflection"
  | "knowledge"
  | "journey"
  | "build"
  | "connect"
  | "legacy";

export type VoicePriority = "low" | "medium" | "high";

/**
 * Một tiếng nói bên trong — KHÔNG phải module. Companion (`role`) là
 * "Người bạn", Garden là "Ý chí / sự trưởng thành", v.v.
 */
export type InternalVoice = {
  key: InternalVoiceKey;
  role: string;
};

export type VoiceSignal = Pick<
  PortalSignals,
  "gardenStage" | "pathname" | "reflectionMeaning" | "learningFocus" | "storyMomentum"
>;

export type VoiceMessage = {
  voice: InternalVoiceKey;
  line: string;
  priority: VoicePriority;
};

export const INTERNAL_VOICES: Record<InternalVoiceKey, InternalVoice> = {
  companion: { key: "companion", role: "Người bạn đồng hành" },
  garden: { key: "garden", role: "Ý chí / sự trưởng thành" },
  story: { key: "story", role: "Ký ức" },
  reflection: { key: "reflection", role: "Nội tâm" },
  knowledge: { key: "knowledge", role: "Trí tuệ" },
  journey: { key: "journey", role: "Con đường" },
  build: { key: "build", role: "Năng lực kiến tạo" },
  connect: { key: "connect", role: "Mối quan hệ" },
  legacy: { key: "legacy", role: "Di sản" },
};

const GARDEN_VOICE_LINES: Partial<Record<NonNullable<PortalSignals["gardenStage"]>, string>> = {
  dormant: "Khu vườn đang chờ một hạt giống nhỏ.",
  sprouting: "Mình đang lớn lên từng chút — những bước đầu tiên đã xuất hiện.",
  rooting: "Mình đang bén rễ, dù chưa thấy rõ trên mặt đất.",
  rising: "Mình đang lớn lên từng chút, từ những bước nhỏ.",
  blooming: "Một vài bông hoa đã nở, vì mình đã tiếp tục.",
  radiant: "Mình đang tỏa sáng theo cách rất riêng của mình.",
};

function GardenVoice(signals: VoiceSignal): VoiceMessage | null {
  if (!signals.gardenStage) return null;
  const line = GARDEN_VOICE_LINES[signals.gardenStage];
  if (!line) return null;
  return { voice: "garden", line, priority: "medium" };
}

function StoryVoice(signals: VoiceSignal): VoiceMessage | null {
  if (!signals.pathname.startsWith("/portal/story")) return null;
  return {
    voice: "story",
    line: "Đây là nơi những dấu chân được giữ lại.",
    priority: "low",
  };
}

/**
 * Sprint 12.3 — Reflection Meaning Engine. Reflection không nói "depth
 * cao/thấp" — nó chỉ nói ý nghĩa nó nhận ra ở người dùng. Không có
 * tốt/xấu giữa các nhánh dưới đây — `recovery` (nghỉ ngơi) được lắng
 * nghe với cùng sự trân trọng như `persistence` (kiên trì).
 */
const REFLECTION_VOICE_LINES: Record<ReflectionMeaning, string> = {
  persistence: "Hôm nay mình nghe thấy sự kiên trì.",
  curiosity: "Hôm nay mình nghe thấy một sự tò mò muốn hiểu thêm.",
  courage: "Mình nghe thấy một chút can đảm trong điều bạn vừa chia sẻ.",
  humility: "Mình nghe thấy một sự can đảm khi dám nhìn lại chính mình.",
  contribution: "Mình nghe thấy bạn đã nghĩ đến người khác hôm nay.",
  gratitude: "Mình nghe thấy một lòng biết ơn trong điều bạn vừa viết.",
  recovery: "Có lẽ hôm nay điều quan trọng nhất không phải tiến lên, mà là nghỉ ngơi.",
  focus: "Mình nghe thấy một sự tập trung rất rõ trong điều bạn vừa chia sẻ.",
  discovery: "Mình nghe thấy bạn vừa nhận ra một điều mới về chính mình.",
  responsibility: "Mình nghe thấy một sự trách nhiệm trong điều bạn vừa chia sẻ.",
};

function ReflectionVoice(signals: VoiceSignal): VoiceMessage | null {
  if (!signals.reflectionMeaning) return null;
  return {
    voice: "reflection",
    line: REFLECTION_VOICE_LINES[signals.reflectionMeaning],
    priority: "high",
  };
}

function KnowledgeVoice(signals: VoiceSignal): VoiceMessage | null {
  if (!signals.pathname.startsWith("/portal/knowledge")) return null;
  return {
    voice: "knowledge",
    line: "Mình đang ở đây — nếu muốn hiểu kỹ hơn trước khi bắt tay vào làm, mình sẵn sàng cùng bạn.",
    priority: "low",
  };
}

/**
 * Sprint 12.2 — Nhiệm vụ 04. Rule-based thuần (không AI), nhận
 * `PortalSignals` (qua `VoiceSignal`), trả về danh sách tiếng nói đang
 * "lên tiếng" ngay lúc này. Tiếng nói không có gì để nói thì im lặng —
 * không ép ra một câu mặc định (đúng nguyên tắc Companion đã giữ).
 */
export function collectInternalVoices(signals: VoiceSignal): VoiceMessage[] {
  return [GardenVoice, StoryVoice, ReflectionVoice, KnowledgeVoice]
    .map((voiceFn) => voiceFn(signals))
    .filter((message): message is VoiceMessage => message !== null);
}

/**
 * Sprint 22.6 — "The First Language Behavior"
 * (`docs/THE_FIRST_LANGUAGE_BEHAVIOR.md`).
 *
 * Khi Companion biết người dùng này (Character Memory đã chuyển hoá) nhưng
 * không có voice nào nổi lên ở khoảnh khắc này, im lặng tuyệt đối không
 * phải câu trả lời đúng — im lặng tuyệt đối của một người ĐÃ biết nhau
 * có thể cảm thấy như bị bỏ qua. Ba biến thể nói lên điều thật: mình ở
 * đây, chỉ chưa có gì thật sự hữu ích để nói ngay lúc này.
 *
 * `seed` phải là số nguyên dương, xác định từ context thực tế (không
 * dùng `Math.random()` để đảm bảo tính nhất quán trong cùng một session).
 * Caller phù hợp nhất: `getCompanionDecision()` — dùng
 * `characterMemory.length` làm seed.
 */
const COMPANION_UNCERTAINTY_LINES: readonly string[] = [
  "Mình đang ở đây, chỉ chưa có gì thật sự rõ để nói ngay lúc này.",
  "Mình chưa chắc điều gì là cần nhất lúc này — mình vẫn ở đây cùng bạn.",
  "Mình muốn ở đây cùng bạn. Mình chỉ chưa biết nên bắt đầu từ đâu.",
];

export function getCompanionUncertaintyLine(seed: number): string {
  return COMPANION_UNCERTAINTY_LINES[Math.abs(seed) % COMPANION_UNCERTAINTY_LINES.length];
}
