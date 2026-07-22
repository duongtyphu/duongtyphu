import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { MirrorChrome, MirrorQuestionRow } from "@/components/portal/mirror/MirrorChamber";

/**
 * Việc 9 — "Hành trình của tôi", cửa Mirror. Nguồn thật cho static chrome
 * (title/empty-state/footer/câu hỏi xoay vòng) — bảng `mirror_chrome`
 * (1 dòng, id='mirror') + `mirror_questions`, quản qua route Live-edit
 * `/admin/hanh-trinh-cua-toi/mirror` (Nhóm 3 — trước đây 2 trang
 * VisualEditor riêng, đã gộp).
 *
 * KHÔNG dùng cho `invitation`/narrativeLines/reflectionMoments/... — các
 * phần đó là dữ liệu ĐỘNG thật (growthSignals của member), vẫn đọc trực
 * tiếp trong /portal/mirror/page.tsx như cũ, không đụng.
 *
 * QUAN TRỌNG (bài học từ home_cards — Nhóm 3): trả về đúng SHAPE RAW (có
 * `id`/`status`) khớp với dữ liệu `useCollection()` sẽ fetch thật khi
 * Live-edit bật `enabled:true` qua `/api/admin/collections/[table]` —
 * không rút gọn/đổi tên field ở lớp này (vd. KHÔNG flatten
 * `mirror_questions` thành `string[]`), để `seed` (enabled=false) và dữ
 * liệu live-fetch (enabled=true) luôn cùng 1 shape.
 *
 * Dùng getSupabasePublic() (không cookies()) — cùng pattern live-tools.ts/
 * live-blog.ts, an toàn cả Server lẫn Client Component.
 */
const DEFAULT_CHROME: MirrorChrome = {
  id: "mirror",
  title: "Mirror",
  emptyStateLine1: "Hôm nay chiếc gương vẫn còn rất yên tĩnh.",
  emptyStateLine2: "Nó sẽ phản chiếu những điều bạn thật sự sống.",
  emptyStateCtaLabel: "Bắt đầu để lại dấu chân đầu tiên",
  footer: "Mirror không chấm điểm, không so sánh — chỉ phản chiếu đúng những gì bạn thật sự sống.",
  status: "Published",
};

export const getLiveMirrorChrome = cache(async (): Promise<MirrorChrome> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_CHROME;
  const { data, error } = await supabase
    .from("mirror_chrome")
    .select("id, data, status")
    .eq("id", "mirror")
    .eq("status", "Published")
    .maybeSingle();
  if (error || !data) return DEFAULT_CHROME;
  const d = (data.data ?? {}) as Record<string, unknown>;
  return {
    id: data.id as string,
    title: String(d.title ?? DEFAULT_CHROME.title),
    emptyStateLine1: String(d.emptyStateLine1 ?? DEFAULT_CHROME.emptyStateLine1),
    emptyStateLine2: String(d.emptyStateLine2 ?? DEFAULT_CHROME.emptyStateLine2),
    emptyStateCtaLabel: String(d.emptyStateCtaLabel ?? DEFAULT_CHROME.emptyStateCtaLabel),
    footer: String(d.footer ?? DEFAULT_CHROME.footer),
    status: data.status as string,
  };
});

export const getLiveMirrorQuestions = cache(async (): Promise<MirrorQuestionRow[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("mirror_questions")
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
