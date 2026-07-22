import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nối dây `/portal/page.tsx` (Trang chủ Học viện — GemHomePage) vào bảng
 * `home_cards` thật — trước bản sửa này, 7 thẻ Pillar hardcode thẳng
 * trong JSX, hoàn toàn không đọc bảng Supabase mà `/admin/home-cards`
 * quản lý (cùng loại bug đã gặp ở Journey Engine Việc 3, hub Dự án & Cơ
 * hội Việc 5 — Admin sửa xong, Portal không thấy gì).
 *
 * QUAN TRỌNG (Nhóm 3, Live-edit — sửa lại so với bản nối dây đầu tiên):
 * giữ NGUYÊN tên field `description` (đúng tên cột thật trong `data`
 * jsonb) thay vì đổi thành `what` ở đây — vì khi Live-edit bật
 * `useCollection(..., {enabled:true})`, hook sẽ fetch thật qua
 * `/api/admin/collections/home-cards` và trả về đúng shape RAW (spread
 * `data` jsonb, có `description`, KHÔNG có `what`). Nếu đổi tên ở lớp
 * này, `seed` (enabled=false) và dữ liệu fetch thật (enabled=true) sẽ
 * LỆCH SHAPE — `card.what` sẽ `undefined` ngay khi vào chế độ sửa. Việc
 * đổi `description` → prop `what` của `PillarEntranceCard` chỉ làm ở
 * bước cuối (`HomePillarCards.tsx`), không phụ thuộc `enabled`.
 */
export type LiveHomeCard = {
  id: string;
  icon: string;
  accent: string;
  title: string;
  description: string;
  href: string;
  startedMode: string | null;
  module: string | null;
  companionLine: string;
  /** Chỉ `card_premium` có giá trị — nhãn Companion khi đã sở hữu Premium
   * (thay cho `companionLine` mặc định khi ownedCount > 0). */
  companionLineOwned: string | null;
  ctaLabel: string;
  status: string;
};

export const getLiveHomeCards = cache(async (): Promise<LiveHomeCard[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("home_cards")
    .select("id, data, status")
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
      description: String(d.description ?? ""),
      href: String(d.href ?? ""),
      startedMode: d.startedMode ? String(d.startedMode) : null,
      module: d.module ? String(d.module) : null,
      companionLine: String(d.companionLine ?? ""),
      companionLineOwned: d.companionLineOwned ? String(d.companionLineOwned) : null,
      ctaLabel: String(d.ctaLabel ?? ""),
      status: row.status as string,
    };
  });
});
