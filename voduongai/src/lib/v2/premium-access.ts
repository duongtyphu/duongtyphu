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
 * Premium ngay — phải fallback kiểm tra `orders` (xem MỤC 1 bên dưới) trước
 * khi kết luận Free.
 *
 *   1. `premium_expires_at` CÓ giá trị VÀ còn hạn (> now) → Premium.
 *   2. `premium_expires_at` là `NULL` → fallback: có bất kỳ đơn
 *      `orders.status='confirmed'` nào không (không lọc theo sản phẩm cụ
 *      thể) → Premium. Không có đơn nào → Free.
 *
 * Cột chỉ admin/service_role ghi được (trigger `guard_members_self_update`,
 * Phase 28) — user không tự gia hạn cho mình được.
 * ---------------------------------------------------------------------------
 * MỤC 1 — QUYẾT ĐỊNH KINH DOANH ĐÃ CHỐT (Lệnh "Premium mua đứt = tất cả 5
 * chương trình, tiếp tục E.3")
 *
 * Mua BẤT KỲ 1 trong 5 chương trình trả phí (`ai-coban`/`ai-nangcao`/
 * `openclaw`/`solo`/`scale`) → tự động mở Premium nền tảng (CKOS + Học viện
 * AI + AI Workspace), không phân biệt gói nào — vì vậy fallback ở dưới
 * KHÔNG lọc theo `course_id`/sản phẩm cụ thể, chỉ cần tồn tại 1 đơn
 * `confirmed` bất kỳ của user đó.
 * ---------------------------------------------------------------------------
 */
export type PremiumStatus = {
  /** true khi được quyền xem toàn bộ nội dung Premium. */
  isPremium: boolean;
  /** true khi đã đăng nhập (dùng để chọn CTA: "Nâng cấp" vs "Đăng nhập"). */
  signedIn: boolean;
  /**
   * Hồ sơ thật của user đang đăng nhập — thêm vào CÙNG object này (không
   * tách hàm riêng) vì `PremiumStatus` đã được MỌI trang `/v2/*` fetch +
   * truyền xuống `PortalV2Shell` từ trước (Bước D) — gắn thêm 2 field này
   * là cách DUY NHẤT đưa danh tính thật tới `PortalV2Shell` (dropdown hồ sơ
   * trong topbar) mà KHÔNG phải sửa lại props/luồng dữ liệu của ~46 trang
   * `/v2/*` đã build. `email`/`fullName` lấy TRỰC TIẾP từ
   * `supabase.auth.getUser()` (`user.email`/`user.user_metadata.full_name`)
   * — cùng nguồn `/portal/account` 1.0 đang dùng, không bịa thêm cột nào.
   */
  email: string | null;
  fullName: string | null;
};

export const FREE_STATUS: PremiumStatus = { isPremium: false, signedIn: false, email: null, fullName: null };

export async function getPremiumStatus(): Promise<PremiumStatus> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FREE_STATUS;
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  const email = userData.user?.email ?? null;
  const fullName = (userData.user?.user_metadata?.full_name as string | undefined) ?? null;
  if (!userId) return FREE_STATUS;

  // RLS `members can read own row` cho phép đọc chính dòng của mình.
  const { data: member } = await supabase
    .from("members")
    .select("premium_expires_at")
    .eq("id", userId)
    .maybeSingle();

  const expiresAt = member?.premium_expires_at as string | null | undefined;
  if (expiresAt && new Date(expiresAt).getTime() > Date.now()) {
    return { isPremium: true, signedIn: true, email, fullName };
  }

  // Fallback MỤC 1 — mua đứt bất kỳ 1 trong 5 chương trình cũng mở Premium.
  if (!email) return { isPremium: false, signedIn: true, email, fullName };

  const { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("member_email", email)
    .eq("status", "confirmed")
    .limit(1)
    .maybeSingle();

  return { isPremium: Boolean(order), signedIn: true, email, fullName };
}
