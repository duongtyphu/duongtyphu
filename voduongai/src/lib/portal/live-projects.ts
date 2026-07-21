import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nguồn thật cho lưới hệ sinh thái ở /portal/duan-cohoi (trang hub) — bảng
 * Supabase `projects`, quản lý qua /admin/projects (Việc 5, Nhóm B, phương
 * án (a) Founder đã chọn). Thay cho mảng hardcode `ECOSYSTEMS` từng viết
 * thẳng trong page.tsx.
 *
 * CHỈ dùng cho trang hub — 2 trang chi tiết
 * `/portal/duan-cohoi/[ecosystemSlug]`/`[subProjectSlug]` vẫn đọc
 * `src/data/portal/ecosystems.ts` tĩnh (highlights/subProjects/marketingLinks/
 * potentialAnalysis... không có trong schema 9 field đơn giản này) — xem
 * CLAUDE.md mục "Dự án & Cơ hội".
 *
 * Dùng getSupabasePublic() (không cookies()) — an toàn gọi ở Server
 * Component, cùng pattern đã dùng cho live-tools.ts/live-knowledge.ts.
 */
export type LiveProject = {
  key: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  statusLabel: string;
  expectedOutcome: string;
  whoFor: string;
  whoNotReady: string;
};

export const getLiveProjects = cache(async (): Promise<LiveProject[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      key: String(d.key ?? row.id),
      name: String(d.name ?? ""),
      description: String(d.description ?? ""),
      href: String(d.href ?? ""),
      icon: String(d.icon ?? ""),
      statusLabel: String(d.statusLabel ?? ""),
      expectedOutcome: String(d.expectation ?? ""),
      whoFor: String(d.fitCriteria ?? ""),
      whoNotReady: String(d.avoidCriteria ?? ""),
    };
  });
});
