import { getSupabaseServer } from "@/lib/supabase-server";

type OrderItemColumn = "lesson_id" | "product_id" | "course_id";

/**
 * Phase 28 (Schema v2, Bước 2) — quyền "đã mua" giờ tính thêm hạn dùng
 * Premium (`members.premium_expires_at`, Quyết định 2: hết hạn theo USER,
 * 1 hạn chung cho cả tài khoản).
 *
 * QUY TẮC ĐỌC `premium_expires_at` (quan trọng, khác cách diễn đạt tắt
 * "lọc theo premium_expires_at > now()" trong bản mô tả):
 *
 *   - `NULL`  → KHÔNG hết hạn, giữ nguyên quyền (mua đứt/vĩnh viễn).
 *   - có giá trị và CÒN hạn (> now) → giữ nguyên quyền.
 *   - có giá trị và ĐÃ qua hạn      → thu hồi toàn bộ quyền đã mua.
 *
 * Nếu áp đúng nghĩa đen `premium_expires_at > now()` thì mọi dòng `NULL`
 * (hiện là 16/16 member) sẽ bị coi là hết hạn ngay lập tức — tức mọi khoá
 * học mua đứt đều mất quyền truy cập ngay khi triển khai. Cột này được
 * thiết kế cho gói có chu kỳ ("Premium Monthly"); đơn mua đứt không có hạn
 * nên phải để `NULL` và `NULL` phải nghĩa là "không hết hạn".
 *
 * Cột chỉ admin/service_role ghi được (trigger `guard_members_self_update`,
 * Phase 28) — user không tự gia hạn cho mình được.
 */
export async function getPurchasedIds(column: OrderItemColumn): Promise<Set<string>> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return new Set();
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  const userId = userData.user?.id;
  if (!email) return new Set();

  if (userId) {
    // RLS `members can read own row` cho phép đọc chính dòng của mình.
    const { data: member } = await supabase
      .from("members")
      .select("premium_expires_at")
      .eq("id", userId)
      .maybeSingle();
    const expiresAt = member?.premium_expires_at as string | null | undefined;
    if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
      return new Set();
    }
  }

  const { data } = await supabase
    .from("orders")
    .select(column)
    .eq("member_email", email)
    .eq("status", "confirmed")
    .not(column, "is", null);

  return new Set((data ?? []).map((row) => String(row[column as keyof typeof row])));
}
