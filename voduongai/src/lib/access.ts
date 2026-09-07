import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";

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

  // BUG HIỆU NĂNG ĐÃ SỬA (Giai đoạn 11, Đợt 5/6): trước đây gọi thẳng
  // `supabase.auth.getUser()` ở đây — mọi trang gọi `getPurchasedIds()`
  // CÙNG với 1 hàm khác cũng cần xác thực (vd. `getPremiumStatus()`, dùng
  // `getCachedAuthUser()` nội bộ) đều tốn thêm 1 round-trip mạng thật tới
  // Supabase Auth không cần thiết trong CÙNG 1 lượt render (ví dụ xác
  // nhận thật: `/v2/premium/[courseId]/hoc` gọi cả 2). Đổi sang
  // `getCachedAuthUser()` (dedupe qua React `cache()`, cùng cơ chế đã áp
  // dụng site-wide ở "Sửa nguyên nhân gốc — Portal 2.0 tải chậm") —
  // KHÔNG đổi hành vi (vẫn trả `Set` rỗng khi chưa đăng nhập), chỉ giảm
  // số lần gọi mạng khi hàm này được gọi cùng lúc với hàm khác đã dùng
  // `getCachedAuthUser()`.
  const supabase = await getSupabaseServer();
  const user = await getCachedAuthUser();
  const email = user?.email;
  const userId = user?.id;
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
