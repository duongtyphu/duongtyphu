import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nguồn thật cho SOP (bảng Supabase `sop`, quản lý qua `/admin/ckos/sop`) —
 * dùng cho tab "Thư viện tài nguyên" của trang gộp `/v2/hoc-vien-ai` (Giai
 * đoạn 6). Mirror đúng shape/logic `getLiveSops()` cục bộ trong
 * `/portal/sop/page.tsx` (1.0) — KHÔNG sửa file đó (ngoài phạm vi, tránh
 * đụng Portal 1.0), chỉ tách 1 bản dùng chung cho v2 theo đúng pattern mọi
 * `live-*.ts` khác.
 *
 * KHÔNG có trang chi tiết riêng cho từng SOP (kể cả ở 1.0 — `/portal/sop`
 * chỉ là 1 trang danh sách card, không có route `[id]`) — mọi SOP đọc qua
 * file này chỉ nên trỏ về `/portal/sop`.
 */
export type LiveSop = {
  id: string;
  title: string;
  description: string;
  whenToUse: string;
  whenNotToUse: string;
  steps: string[];
  relatedPromptId?: string;
};

export const getLiveSops = cache(async (): Promise<LiveSop[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("sop")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      title: String(d.name ?? ""),
      description: String(d.description ?? ""),
      whenToUse: String(d.whenToUse ?? ""),
      whenNotToUse: String(d.whenNotToUse ?? ""),
      steps: Array.isArray(d.steps) ? (d.steps as string[]) : [],
      relatedPromptId: d.relatedPromptId ? String(d.relatedPromptId) : undefined,
    };
  });
});
