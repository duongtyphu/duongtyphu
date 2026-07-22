import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { StoryChrome } from "@/components/portal/story/MyStoryBook";

/**
 * Việc 9 — "Hành trình của tôi", cửa My Story. Nguồn thật cho static
 * chrome (title/subtitle/empty-state/nhãn mục/CTA/footer + chuỗi trong
 * WriteNook/RemovableEntry) — bảng `story_chrome` (1 dòng, id='story'),
 * quản qua /admin/hanh-trinh-cua-toi/story-chrome.
 *
 * KHÔNG dùng cho companionLine/understandingNote/growthPattern/qualities/
 * importantMoments/milestones/createdWorks/capsules/chapter/buildLetter(...)
 * — các phần đó là dữ liệu ĐỘNG thật (reflections/capsules/growth-view.ts
 * của member), vẫn đọc trực tiếp trong MyStoryBook.tsx như cũ, không đụng.
 *
 * Dùng getSupabasePublic() (không cookies()) — cùng pattern live-mirror.ts/
 * live-journal.ts.
 */
const DEFAULT_CHROME: StoryChrome = {
  title: "My Story",
  subtitle: "Câu chuyện đang được viết bằng chính những điều bạn học, tạo ra và gìn giữ.",
  emptyStateLine1: "Mọi cuốn sách hay đều bắt đầu bằng một trang đầu còn trắng.",
  emptyStateLine2: "Trang này sẽ tự viết khi bạn học, tạo ra hoặc gìn giữ điều gì đó thật trong Portal.",
  monthlyLetterLabel: "Lá thư tháng",
  momentsSectionLabel: "Những khoảnh khắc quan trọng",
  turningPointsSectionLabel: "Bước ngoặt",
  lessonsSectionLabel: "Những bài học đã thay đổi tôi",
  createdSectionLabel: "Những gì tôi đã tạo ra",
  createdEmptyLine: "Chưa có tác phẩm nào — trang này sẽ tự viết khi bạn tạo ra kết quả đầu tiên trong Workspace.",
  capsulesSectionLabel: "Những điều bạn tự gìn giữ",
  storageNotReadyLine: "Khu vực lưu ký ức đang được chuẩn bị. Bạn vẫn có thể đọc lại hành trình của mình.",
  writeNookSectionLabel: "Viết một trang mới",
  nextChapterPrompt: "Chương tiếp theo bạn muốn bắt đầu là gì?",
  nextChapterCtaLabel: "Bắt đầu viết tiếp",
  mirrorPromptPrefix: "Muốn nhìn sâu hơn?",
  mirrorLinkLabel: "Mở Mirror",
  writeNookNotReadyLine: "Khu vực lưu ký ức đang được chuẩn bị — bạn có thể quay lại viết sau.",
  thankYouLine: "Cảm ơn bạn đã dành chút thời gian để suy ngẫm hôm nay — dòng đó đã được cất vào cuốn sách.",
  reflectionPlaceholder: "Không cần dài, chỉ cần thật...",
  saveReflectionCtaLabel: "Lưu dòng này vào cuốn sách",
  momentPrompt: "Có một khoảnh khắc khác đáng giữ lại hôm nay?",
  momentPlaceholder: "Điều gì đáng nhớ với bạn?",
  saveMomentCtaLabel: "Cất giữ vào cuốn sách",
  savedMomentLabel: "Đã cất giữ",
  noReflectionsLine: "Chưa có suy ngẫm nào được lưu — dòng đầu tiên luôn là dòng khó viết nhất.",
  removeLabel: "Gỡ khỏi cuốn sách",
  removeConfirmLabel: "Chắc chắn?",
  removeCtaLabel: "Xoá",
  keepCtaLabel: "Giữ lại",
};

const STRING_KEYS = Object.keys(DEFAULT_CHROME) as (keyof StoryChrome)[];

export const getLiveStoryChrome = cache(async (): Promise<StoryChrome> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_CHROME;
  const { data, error } = await supabase.from("story_chrome").select("data").eq("id", "story").eq("status", "Published").maybeSingle();
  if (error || !data) return DEFAULT_CHROME;
  const d = (data.data ?? {}) as Record<string, unknown>;
  const result = { ...DEFAULT_CHROME };
  for (const key of STRING_KEYS) {
    if (typeof d[key] === "string") result[key] = d[key] as string;
  }
  return result;
});
