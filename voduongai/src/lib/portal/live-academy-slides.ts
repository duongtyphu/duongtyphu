import { cache } from "react";

import { getSupabasePublic } from "@/lib/supabase";
import { toYouTubeEmbedUrl } from "@/lib/portal/videoEmbed";
import type { PremiumStatus } from "@/lib/v2/premium-access";

/**
 * Học viện AI 2.0, tab "Khóa học & Lộ trình" — mục 4b của kế hoạch gốc 14
 * hạng mục. 2 bảng generic mới (`academy_slide_lessons`/`academy_videos`,
 * cùng khuôn `id/data jsonb/status/order` dùng xuyên suốt dự án):
 *
 * - 3 nhóm "Học AI theo nhu cầu/công cụ/nghề nghiệp" — 55 bài slide
 *   (15+20+20, đúng danh sách Founder chốt), mỗi bài là 1 slide-deck xem
 *   qua trình chiếu native (`SlideViewer.tsx`), không nhúng công cụ ngoài.
 * - Lưới 13 video YouTube (link Founder gửi, title thật lấy qua YouTube
 *   oEmbed — không bịa tiêu đề).
 *
 * Bước D (Premium): mỗi nhóm 3 bài đầu (theo `order`) miễn phí, còn lại
 * khoá Premium — đúng quyết định Founder. Khoá ở tầng SERVER: danh sách
 * (`getAcademySlideLessons`) không trả `slides` cho bài bị khoá; chỉ
 * `getAcademySlideLesson()` (đọc 1 bài cụ thể) mới cần kiểm tra lại lần
 * nữa phòng trường hợp gọi trực tiếp bằng id.
 */

export type AcademyLessonGroup = "nhu-cau" | "cong-cu" | "nghe-nghiep";

export const ACADEMY_LESSON_GROUPS: { key: AcademyLessonGroup; label: string }[] = [
  { key: "nhu-cau", label: "Theo nhu cầu" },
  { key: "cong-cu", label: "Theo công cụ" },
  { key: "nghe-nghiep", label: "Theo nghề nghiệp" },
];

export type AcademySlide = { heading: string; body: string };

export type AcademySlideLessonSummary = {
  id: string;
  group: AcademyLessonGroup;
  categoryLabel: string;
  title: string;
  summary: string;
  slideCount: number;
  isFreePreview: boolean;
  order: number;
};

export type AcademySlideLessonDetail = AcademySlideLessonSummary & {
  /** Rỗng khi `locked` — server không trả nội dung slide về client. */
  slides: AcademySlide[];
  locked: boolean;
};

type LessonRow = {
  id: string;
  data: {
    group?: AcademyLessonGroup;
    categoryLabel?: string;
    title?: string;
    summary?: string;
    isFreePreview?: boolean;
    slides?: AcademySlide[];
  };
  status: string;
  order: number;
};

function toSummary(row: LessonRow): AcademySlideLessonSummary {
  return {
    id: row.id,
    group: row.data.group ?? "nhu-cau",
    categoryLabel: row.data.categoryLabel ?? "",
    title: row.data.title ?? row.data.categoryLabel ?? "",
    summary: row.data.summary ?? "",
    slideCount: Array.isArray(row.data.slides) ? row.data.slides.length : 0,
    isFreePreview: Boolean(row.data.isFreePreview),
    order: row.order ?? 0,
  };
}

/**
 * 1 bài học kèm slide — khoá `slides` ở SERVER khi `!isFreePreview &&
 * !premium.isPremium`, đúng cơ chế Bước D đã áp dụng cho `getCkosDocument()`/
 * `getAcademyLesson()`.
 */
export async function getAcademySlideLesson(
  id: string,
  premium: PremiumStatus,
): Promise<AcademySlideLessonDetail | null> {
  const supabase = getSupabasePublic();
  if (!supabase) return null;

  const { data } = await supabase
    .from("academy_slide_lessons")
    .select("id, data, status, order")
    .eq("id", id)
    .eq("status", "Published")
    .maybeSingle();
  if (!data) return null;

  const row = data as LessonRow;
  const summary = toSummary(row);
  const locked = !summary.isFreePreview && !premium.isPremium;

  return {
    ...summary,
    locked,
    slides: locked ? [] : (row.data.slides ?? []),
  };
}

/**
 * Toàn bộ 55 bài Published KÈM slide, đã khoá đúng theo Premium — dùng cho
 * trang hub `/v2/hoc-vien-ai` (client cần sẵn nội dung để mở `SlideViewer`
 * ngay khi bấm, không round-trip mạng lần 2). 1 câu SELECT duy nhất, không
 * N+1 — khác `getAcademySlideLesson()` (đọc lẻ 1 bài, dùng cho tương lai
 * nếu có route chi tiết riêng).
 */
export async function getAcademySlideLessonsWithContent(
  premium: PremiumStatus,
): Promise<AcademySlideLessonDetail[]> {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data } = await supabase
    .from("academy_slide_lessons")
    .select("id, data, status, order")
    .eq("status", "Published")
    .order("order");

  return ((data ?? []) as LessonRow[]).map((row) => {
    const summary = toSummary(row);
    const locked = !summary.isFreePreview && !premium.isPremium;
    return { ...summary, locked, slides: locked ? [] : (row.data.slides ?? []) };
  });
}

export type AcademyVideo = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  embedUrl: string | null;
  order: number;
};

type VideoRow = {
  id: string;
  data: { title?: string; description?: string; youtubeUrl?: string };
  status: string;
  order: number;
};

/** Lưới 13 video YouTube (Admin-editable, không giới hạn cứng số 13). */
export const getAcademyVideos = cache(async (): Promise<AcademyVideo[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data } = await supabase
    .from("academy_videos")
    .select("id, data, status, order")
    .eq("status", "Published")
    .order("order");

  return ((data ?? []) as VideoRow[]).map((row) => {
    const youtubeUrl = row.data.youtubeUrl ?? "";
    return {
      id: row.id,
      title: row.data.title ?? "",
      description: row.data.description ?? "",
      youtubeUrl,
      embedUrl: youtubeUrl ? toYouTubeEmbedUrl(youtubeUrl) : null,
      order: row.order ?? 0,
    };
  });
});
