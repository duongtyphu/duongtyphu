/**
 * Story Becomes Memory (Sprint 13.4 — Nhiệm vụ 01/02). Cầu nối giữa một
 * `LivingStory` đang được kể và một `MemoryCapsule` trong My Story —
 * chỉ khi người dùng tự nguyện chọn lưu. Xem
 * `docs/LIVING_STORIES_ENGINE.md` (Privacy & Consent) và
 * `docs/product-bible/BOOK_LIVING_STORIES.md` ("Từ câu chuyện đến ký ức").
 */

import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { isMissingTableError, warnMissingTableOnce } from "@/lib/portal/storyTableStatus";
import type { LivingStory, StoryType } from "@/lib/portal/companion/living-stories";
import type { MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";

const STORY_TYPE_TO_CAPSULE_KIND: Record<StoryType, MemoryCapsuleKind> = {
  "companion-story": "companion_story",
  "wisdom-story": "wisdom_story",
  "garden-story": "garden_story",
  "anonymous-human-story": "living_story",
  "quiet-story": "living_story",
  "resilience-story": "living_story",
  "legacy-story": "living_story",
};

export function mapStoryTypeToCapsuleKind(type: StoryType): MemoryCapsuleKind {
  return STORY_TYPE_TO_CAPSULE_KIND[type] ?? "living_story";
}

export type SaveLivingStoryResult = "saved" | "not-signed-in" | "error";

/**
 * Lưu một Living Story vào My Story dưới dạng Memory Capsule — chỉ gọi
 * khi người dùng bấm "Lưu vào My Story" (không bao giờ tự động). Chỉ
 * lưu title/storyId/storyType (qua `kind`)/meaningTags/closingLine/
 * timestamp — không lưu nội dung cá nhân nào của người dùng.
 */
export async function saveLivingStoryToMyStory(story: LivingStory): Promise<SaveLivingStoryResult> {
  const supabase = getSupabaseBrowser();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return "not-signed-in";

  const { error } = await supabase.from("memory_capsules").insert({
    member_id: userId,
    kind: mapStoryTypeToCapsuleKind(story.type),
    title: story.title,
    description: story.closingLine,
    occurred_at: new Date().toISOString(),
    source: "companion_living_story",
    story_id: story.id,
    meaning_tags: story.meaningTags.length > 0 ? story.meaningTags : null,
  });

  if (error) {
    if (isMissingTableError(error)) warnMissingTableOnce("memory_capsules");
    return "error";
  }
  return "saved";
}
