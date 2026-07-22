import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { JournalChrome, JournalIntentionRow } from "@/components/portal/journal/LearningJournalNotebook";

/**
 * Việc 9 — "Hành trình của tôi", cửa Nhật ký học tập. Nguồn thật cho
 * static chrome (eyebrow/title/empty-state/section labels/footer) — bảng
 * `journal_chrome` (1 dòng, id='journal') + `journal_intentions`, quản
 * qua route Live-edit `/admin/hanh-trinh-cua-toi/journal` (Nhóm 3 — trước
 * đây 2 trang VisualEditor riêng, đã gộp).
 *
 * KHÔNG dùng cho entries/highlights/portfolio/todayHighlight/
 * behaviorLessons/... — các phần đó là dữ liệu ĐỘNG thật (sessions/
 * reflections/growth events của member), vẫn đọc trực tiếp trong
 * LearningJournalNotebook.tsx như cũ, không đụng.
 *
 * QUAN TRỌNG (bài học từ home_cards/Mirror — Nhóm 3): trả về đúng SHAPE
 * RAW (có `id`/`status`) khớp với dữ liệu `useCollection()` sẽ fetch thật
 * khi Live-edit bật `enabled:true` qua `/api/admin/collections/[table]`.
 *
 * Dùng getSupabasePublic() (không cookies()) — cùng pattern live-mirror.ts.
 */
const DEFAULT_CHROME: JournalChrome = {
  id: "journal",
  eyebrowLabel: "Nhật ký học tập",
  title: "Bản ghi những gì tôi thực sự đã học",
  emptyStateLine: "Trang đầu tiên luôn là trang nhiều hy vọng nhất.",
  emptyStateCtaLabel: "Bắt đầu bài học đầu tiên",
  todaySectionLabel: "Hôm nay",
  todayFallbackLine: "Hôm nay chưa có gì để ghi lại — cuốn sổ vẫn đang mở, chờ bạn.",
  entriesSectionLabel: "Các trang đã viết",
  highlightsSectionLabel: "Khoảnh khắc đáng nhớ",
  createdSectionLabel: "Những gì đã tạo ra",
  createdEmptyLine: "Chưa có tác phẩm nào — trang này sẽ tự viết khi bạn tạo ra kết quả đầu tiên.",
  lessonsSectionLabel: "Những bài học đáng nhớ",
  continueCtaLabel: "Tiếp tục trong Workspace",
  footer: "Đây là bản ghi việc học của bạn — không phải nhật ký hoạt động của hệ thống.",
  status: "Published",
};

export const getLiveJournalChrome = cache(async (): Promise<JournalChrome> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_CHROME;
  const { data, error } = await supabase
    .from("journal_chrome")
    .select("id, data, status")
    .eq("id", "journal")
    .eq("status", "Published")
    .maybeSingle();
  if (error || !data) return DEFAULT_CHROME;
  const d = (data.data ?? {}) as Record<string, unknown>;
  return {
    id: data.id as string,
    eyebrowLabel: String(d.eyebrowLabel ?? DEFAULT_CHROME.eyebrowLabel),
    title: String(d.title ?? DEFAULT_CHROME.title),
    emptyStateLine: String(d.emptyStateLine ?? DEFAULT_CHROME.emptyStateLine),
    emptyStateCtaLabel: String(d.emptyStateCtaLabel ?? DEFAULT_CHROME.emptyStateCtaLabel),
    todaySectionLabel: String(d.todaySectionLabel ?? DEFAULT_CHROME.todaySectionLabel),
    todayFallbackLine: String(d.todayFallbackLine ?? DEFAULT_CHROME.todayFallbackLine),
    entriesSectionLabel: String(d.entriesSectionLabel ?? DEFAULT_CHROME.entriesSectionLabel),
    highlightsSectionLabel: String(d.highlightsSectionLabel ?? DEFAULT_CHROME.highlightsSectionLabel),
    createdSectionLabel: String(d.createdSectionLabel ?? DEFAULT_CHROME.createdSectionLabel),
    createdEmptyLine: String(d.createdEmptyLine ?? DEFAULT_CHROME.createdEmptyLine),
    lessonsSectionLabel: String(d.lessonsSectionLabel ?? DEFAULT_CHROME.lessonsSectionLabel),
    continueCtaLabel: String(d.continueCtaLabel ?? DEFAULT_CHROME.continueCtaLabel),
    footer: String(d.footer ?? DEFAULT_CHROME.footer),
    status: data.status as string,
  };
});

export const getLiveJournalIntentions = cache(async (): Promise<JournalIntentionRow[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("journal_intentions")
    .select("id, data, status")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id as string,
    content: String((row.data as Record<string, unknown>)?.content ?? ""),
    status: row.status as string,
  }));
});
