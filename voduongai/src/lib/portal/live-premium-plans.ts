import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Phase 38 — 3 gói Premium thuê bao (Gói Tháng / 6 Tháng / 12 Tháng), thay
 * thế "5 chương trình mua đứt" (`PREMIUM_PROGRAMS`/`courses`) trên
 * `/v2/premium`, đúng thiết kế `Premium.html`. Bảng typed (không phải
 * schema generic `id/data/status/order`) vì checkout cần đọc thẳng cột
 * `price` — cùng lý do `courses`/`case_studies`/`coupons` là bảng typed
 * riêng, không qua `/api/admin/collections/[table]`.
 *
 * Mỗi gói vẫn thanh toán 1 LẦN qua đúng luồng SePay đang chạy — không có
 * auto-renew thật (ngoài phạm vi, cần cổng thanh toán khác) — nhưng mở
 * Premium có THỜI HẠN thật (`durationDays`), qua trigger
 * `on_order_confirmed_premium_plan` (Phase 38) gia hạn
 * `members.premium_expires_at` khi đơn `plan_id` chuyển `confirmed`.
 */
export type PremiumPlan = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number | null;
  durationDays: number;
  features: string[];
  isFeatured: boolean;
  ctaLabel: string;
};

export const getLivePremiumPlans = cache(async (): Promise<PremiumPlan[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data } = await supabase
    .from("premium_plans")
    .select("id, name, subtitle, price, original_price, duration_days, features, is_featured, cta_label")
    .eq("status", "Published")
    .order("order", { ascending: true });

  if (!data) return [];

  return data.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    subtitle: row.subtitle as string,
    price: row.price as number,
    originalPrice: row.original_price as number | null,
    durationDays: row.duration_days as number,
    features: (row.features as string[] | null) ?? [],
    isFeatured: row.is_featured as boolean,
    ctaLabel: row.cta_label as string,
  }));
});
