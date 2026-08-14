import { getSupabaseServer } from "@/lib/supabase-server";

/**
 * BƯỚC D — Trạng thái Premium runtime cho toàn bộ Portal 2.0.
 *
 * ---------------------------------------------------------------------------
 * QUY TẮC ĐỌC `members.premium_expires_at` — KHÁC `getPurchasedIds()`
 *
 * `src/lib/access.ts` đọc cùng cột này nhưng trả lời một CÂU HỎI KHÁC: "đơn
 * hàng đã mua có còn hiệu lực không". Ở đó `NULL` = "không có hạn" = GIỮ
 * quyền (đúng cho đơn mua đứt).
 *
 * Ở đây câu hỏi là "user này CÓ PHẢI Premium không". `NULL` KHÔNG thể coi là
 * Premium — hiện 16/16 member đều `NULL`, hiểu ngược lại là mở toàn bộ nội
 * dung Premium cho tất cả mọi người. Vì vậy:
 *
 *   Premium ⇔ `premium_expires_at` CÓ giá trị VÀ còn hạn (> now).
 *
 * ĐIỂM CẦN FOUNDER QUYẾT (chưa tự quyết, xem báo cáo): người mua ĐỨT một
 * chương trình Premium (V-Solo/V-Scale — đơn không có hạn nên
 * `premium_expires_at` vẫn `NULL`) hiện KHÔNG được tính là Premium theo quy
 * tắc trên. Nếu Founder muốn tính, cần bổ sung: hoặc set
 * `premium_expires_at` khi xác nhận đơn, hoặc mở rộng hàm này đọc thêm
 * `orders`. Không tự mở rộng vì đây là quyết định kinh doanh.
 *
 * Cột chỉ admin/service_role ghi được (trigger `guard_members_self_update`,
 * Phase 28) — user không tự gia hạn cho mình được.
 * ---------------------------------------------------------------------------
 */
export type PremiumStatus = {
  /** true khi được quyền xem toàn bộ nội dung Premium. */
  isPremium: boolean;
  /** true khi đã đăng nhập (dùng để chọn CTA: "Nâng cấp" vs "Đăng nhập"). */
  signedIn: boolean;
};

export const FREE_STATUS: PremiumStatus = { isPremium: false, signedIn: false };

export async function getPremiumStatus(): Promise<PremiumStatus> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FREE_STATUS;
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return FREE_STATUS;

  // RLS `members can read own row` cho phép đọc chính dòng của mình.
  const { data: member } = await supabase
    .from("members")
    .select("premium_expires_at")
    .eq("id", userId)
    .maybeSingle();

  const expiresAt = member?.premium_expires_at as string | null | undefined;
  const isPremium = Boolean(expiresAt) && new Date(expiresAt as string).getTime() > Date.now();

  return { isPremium, signedIn: true };
}
