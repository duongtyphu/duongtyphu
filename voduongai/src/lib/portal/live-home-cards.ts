import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nối dây `/portal/page.tsx` (Trang chủ Học viện — GemHomePage) vào bảng
 * `home_cards` thật — trước bản sửa này, 7 thẻ Pillar hardcode thẳng
 * trong JSX, hoàn toàn không đọc bảng Supabase mà `/admin/home-cards`
 * quản lý (cùng loại bug đã gặp ở Journey Engine Việc 3, hub Dự án & Cơ
 * hội Việc 5 — Admin sửa xong, Portal không thấy gì).
 *
 * `description` (tên cột thật trong `data` jsonb) đổi tên thành `what`
 * (đúng tên prop `PillarEntranceCard` đang dùng) — chỉ khác tên, cùng nội
 * dung, không phải lệch dữ liệu.
 */
export type LiveHomeCard = {
  id: string;
  icon: string;
  accent: string;
  title: string;
  what: string;
  href: string;
  startedMode: string | null;
  module: string | null;
  companionLine: string;
  /** Chỉ `card_premium` có giá trị — nhãn Companion khi đã sở hữu Premium
   * (thay cho `companionLine` mặc định khi ownedCount > 0). */
  companionLineOwned: string | null;
  ctaLabel: string;
};

export const getLiveHomeCards = cache(async (): Promise<LiveHomeCard[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("home_cards")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      icon: String(d.icon ?? ""),
      accent: String(d.accent ?? ""),
      title: String(d.title ?? ""),
      what: String(d.description ?? ""),
      href: String(d.href ?? ""),
      startedMode: d.startedMode ? String(d.startedMode) : null,
      module: d.module ? String(d.module) : null,
      companionLine: String(d.companionLine ?? ""),
      companionLineOwned: d.companionLineOwned ? String(d.companionLineOwned) : null,
      ctaLabel: String(d.ctaLabel ?? ""),
    };
  });
});
