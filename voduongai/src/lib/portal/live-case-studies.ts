import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nguồn thật cho Case Study (bảng Supabase `case_studies`, TYPED — không
 * theo schema generic `id/data/status/order`, xem CLAUDE.md mục "Case
 * Study") — dùng cho tab "Thư viện tài nguyên" của trang gộp
 * `/v2/hoc-vien-ai` (Giai đoạn 6). RLS `"public read - case_studies"`
 * (`active = true`) cho phép đọc qua anon key — dùng `getSupabasePublic()`
 * đúng pattern mọi `live-*.ts` khác, KHÔNG cần `getSupabaseServer()`
 * (cookies) như `/portal/case-studies/page.tsx` (1.0) đang dùng.
 *
 * KHÔNG có trang chi tiết `[id]` cho Case Study (kể cả ở 1.0 — chỉ có
 * `/portal/case-studies` dạng danh sách) — `linkUrl` (nếu Admin điền) là
 * CTA ra ngoài của chính case study đó, không phải link nội bộ.
 */
export type LiveCaseStudy = {
  id: number;
  title: string;
  clientName: string;
  summary: string;
  resultMetric: string;
  thumbnailUrl: string;
  linkUrl: string;
};

export const getLiveCaseStudies = cache(async (): Promise<LiveCaseStudy[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("case_studies")
    .select("id, title, client_name, summary, result_metric, thumbnail_url, link_url")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id as number,
    title: (row.title as string | null) ?? "",
    clientName: (row.client_name as string | null) ?? "",
    summary: (row.summary as string | null) ?? "",
    resultMetric: (row.result_metric as string | null) ?? "",
    thumbnailUrl: (row.thumbnail_url as string | null) ?? "",
    linkUrl: (row.link_url as string | null) ?? "",
  }));
});
