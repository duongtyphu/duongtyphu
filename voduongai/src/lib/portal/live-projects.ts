import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nguồn thật cho lưới hệ sinh thái ở /portal/duan-cohoi (trang hub) — bảng
 * Supabase `projects`, quản lý qua /admin/duan-cohoi (Live-edit, Nhóm 3).
 * Thay cho mảng hardcode `ECOSYSTEMS` từng viết thẳng trong page.tsx.
 *
 * CHỈ dùng cho trang hub — 2 trang chi tiết
 * `/portal/duan-cohoi/[ecosystemSlug]`/`[subProjectSlug]` vẫn đọc
 * `src/data/portal/ecosystems.ts` tĩnh (highlights/subProjects/marketingLinks/
 * potentialAnalysis... không có trong schema 9 field đơn giản này) — xem
 * CLAUDE.md mục "Dự án & Cơ hội".
 *
 * Giữ NGUYÊN tên field thô đúng shape DB (`expectation`/`fitCriteria`/
 * `avoidCriteria`, KHÔNG đổi tên thành `expectedOutcome`/`whoFor`/
 * `whoNotReady` ở lớp này) + thêm `id`/`status` — đúng bài học
 * "description/what" (home_cards): đổi tên field ngay ở lớp fetch sẽ lệch
 * shape với dữ liệu RAW mà `useCollection()` fetch thật khi
 * `enabled:true`. Việc đổi tên hiển thị chỉ làm ở nơi render cuối cùng
 * (`ProjectCards.tsx`).
 *
 * Dùng getSupabasePublic() (không cookies()) — an toàn gọi ở Server
 * Component, cùng pattern đã dùng cho live-tools.ts/live-knowledge.ts.
 */
export type LiveProject = {
  id: string;
  status: string;
  key: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  statusLabel: string;
  expectation: string;
  fitCriteria: string;
  avoidCriteria: string;
};

export const getLiveProjects = cache(async (): Promise<LiveProject[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("id, data, status")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id,
      status: row.status,
      key: String(d.key ?? row.id),
      name: String(d.name ?? ""),
      description: String(d.description ?? ""),
      href: String(d.href ?? ""),
      icon: String(d.icon ?? ""),
      statusLabel: String(d.statusLabel ?? ""),
      expectation: String(d.expectation ?? ""),
      fitCriteria: String(d.fitCriteria ?? ""),
      avoidCriteria: String(d.avoidCriteria ?? ""),
    };
  });
});
