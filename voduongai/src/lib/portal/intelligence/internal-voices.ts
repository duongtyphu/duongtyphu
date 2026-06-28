/**
 * Internal Voices (Sprint 12.2). Portal không phải tập hợp module —
 * mỗi OS/Engine là một "tiếng nói bên trong" của hành trình con người
 * (xem `docs/INTERNAL_VOICES_ARCHITECTURE.md`). File này chỉ định
 * NGÔN NGỮ và CẤU TRÚC cho các tiếng nói đó — không AI thật, không kết
 * nối dữ liệu mới ngoài `PortalSignals` đã có.
 */

import type { PortalSignals } from "@/lib/portal/intelligence/portal-signals";

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
  "gardenStage" | "pathname" | "reflectionDepth" | "learningFocus" | "storyMomentum"
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

function ReflectionVoice(signals: VoiceSignal): VoiceMessage | null {
  if (signals.reflectionDepth === undefined) return null;
  return {
    voice: "reflection",
    line: "Hôm nay mình thật sự nghĩ gì — câu hỏi đó vẫn đang chờ.",
    priority: "medium",
  };
}

function KnowledgeVoice(signals: VoiceSignal): VoiceMessage | null {
  if (!signals.pathname.startsWith("/portal/knowledge")) return null;
  return {
    voice: "knowledge",
    line: "Có lẽ hôm nay điều cần nhất là hiểu đúng trước khi làm nhanh.",
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
