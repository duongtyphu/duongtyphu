/**
 * Portal 2.0, Giai đoạn 2, mục 2a — "ghi nhớ tự động phát hiện + xác nhận
 * 1 chạm". Cầu nối giữa 1 `CompanionMemorySuggestion` (projection hẹp của
 * `MemoryCandidate`, xem `public-chat-response.ts`) và 1 `MemoryCapsule`
 * trong My Story — CHỈ khi người dùng tự bấm "Lưu" (không bao giờ tự
 * động), đúng cam kết riêng tư "Companion chỉ ghi nhớ khi bạn đồng ý" đã
 * có từ trước (`story-memory.ts`'s `saveLivingStoryToMyStory()` — đây là
 * cầu nối THỨ HAI, cùng tinh thần, khác nguồn: nguồn kia là "Living Story"
 * (nội dung kể sẵn), nguồn này là "Memory Candidate" (trích trực tiếp từ
 * lượt chat vừa gửi) — 2 hệ thống riêng, không gộp.
 *
 * Chỉ giảm MA SÁT (Companion chủ động gợi ý ngay trong hội thoại, kèm nút
 * xác nhận 1 chạm) — KHÔNG chuyển sang ghi tự động không cần đồng ý.
 */

import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { isMissingTableError, warnMissingTableOnce } from "@/lib/portal/storyTableStatus";
import type { MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";
import type { CompanionMemorySuggestion } from "@/ai/runtime/public-chat-response";

/** `MemoryType` (`ai/memory/memory-model.ts`) → `MemoryCapsuleKind` gần
    nghĩa nhất trong 5 loại "tự thêm" đã có sẵn (milestone/lesson/decision/
    breakthrough/achievement) — không thêm giá trị enum mới. `session`
    trên thực tế không bao giờ đạt ngưỡng "keep" (confidence luôn < 0.4,
    xem `memory-candidate.ts`'s `classifyTurn()`), giữ fallback an toàn. */
const TYPE_TO_CAPSULE_KIND: Record<string, MemoryCapsuleKind> = {
  learning: "lesson",
  goal: "milestone",
  preference: "decision",
  reflection: "breakthrough",
  session: "milestone",
};

/** Nhãn hiển thị theo `type` — dùng làm tiêu đề Memory Capsule (không có
    tiêu đề nào khác đáng tin cậy hơn để tự sinh từ 1 câu chat ngắn). */
const TYPE_LABEL: Record<string, string> = {
  learning: "Điều bạn vừa học được",
  goal: "Mục tiêu bạn vừa chia sẻ",
  preference: "Sở thích bạn vừa chia sẻ",
  reflection: "Chiêm nghiệm bạn vừa chia sẻ",
  session: "Khoảnh khắc trò chuyện",
};

export function mapMemorySuggestionTypeToCapsuleKind(type: string): MemoryCapsuleKind {
  return TYPE_TO_CAPSULE_KIND[type] ?? "milestone";
}

export function memorySuggestionTitle(type: string): string {
  return TYPE_LABEL[type] ?? "Khoảnh khắc trò chuyện";
}

export type SaveMemorySuggestionResult = "saved" | "not-signed-in" | "error";

/**
 * Lưu 1 `CompanionMemorySuggestion` vào My Story — chỉ gọi khi người dùng
 * bấm "Lưu" trong khung chat. `description` = nguyên văn tin nhắn (đã hiện
 * sẵn cho người dùng xem trước khi bấm Lưu, không phải dữ liệu ẩn mới).
 */
export async function saveMemorySuggestion(suggestion: CompanionMemorySuggestion): Promise<SaveMemorySuggestionResult> {
  const supabase = getSupabaseBrowser();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return "not-signed-in";

  const { error } = await supabase.from("memory_capsules").insert({
    member_id: userId,
    kind: mapMemorySuggestionTypeToCapsuleKind(suggestion.type),
    title: memorySuggestionTitle(suggestion.type),
    description: suggestion.content,
    occurred_at: new Date().toISOString(),
    source: "companion_chat",
  });

  if (error) {
    if (isMissingTableError(error)) warnMissingTableOnce("memory_capsules");
    return "error";
  }
  return "saved";
}
