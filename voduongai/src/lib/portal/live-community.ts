import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Việc 8 — /portal/congdongai, khối "Kết nối ngay hôm nay" (section 10).
 * Thay 3 href tĩnh (`siteConfig.community.facebookGroup/zaloGroup`,
 * `siteConfig.links.youtube`) bằng bảng `community` thật (5 kênh: Facebook/
 * YouTube/TikTok/Zalo/Telegram — TikTok là kênh thật có URL thật trong DB,
 * chưa từng hiển thị trên Portal; Telegram chưa có URL thật, `status`
 * "Inactive" nên tự ẩn).
 *
 * LƯU Ý SCHEMA: bảng này dùng vocabulary trạng thái "Active"/"Inactive"
 * (không phải "Draft"/"Published"/"Hidden" như mọi bảng generic khác) —
 * đã có sẵn từ đợt seed trước, giữ nguyên để không phá dữ liệu thật hiện
 * có. Lọc theo đúng "Active", không phải "Published".
 */
export type LiveCommunityChannel = { id: string; platform: string; label: string; url: string };

export const getLiveCommunityChannels = cache(async (): Promise<LiveCommunityChannel[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("community")
    .select("id, data, status")
    .eq("status", "Active")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data
    .map((row) => {
      const d = (row.data ?? {}) as Record<string, unknown>;
      return {
        id: row.id as string,
        platform: String(d.platform ?? ""),
        label: String(d.label ?? ""),
        url: String(d.url ?? ""),
      };
    })
    .filter((c) => c.url.length > 0);
});
