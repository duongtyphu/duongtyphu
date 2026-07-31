"use server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

/**
 * Yêu cầu thanh toán hoa hồng — ghi qua session client (không dùng
 * `getSupabaseAdmin()`), để RLS `member_insert_own`
 * (`auth.uid() = member_id`, xem `supabase-phase27-affiliate-program.sql`)
 * tự bảo vệ: mỗi thành viên chỉ có thể tạo yêu cầu cho chính mình, đúng
 * nguyên tắc Security First — không có đường nào (kể cả bug code) để 1
 * thành viên tạo yêu cầu thanh toán đứng tên người khác.
 */
export async function requestAffiliatePayout(amountRequested: number, bankInfo: string) {
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { error: "Bạn cần đăng nhập." };
  if (!amountRequested || amountRequested <= 0) return { error: "Số tiền yêu cầu không hợp lệ." };
  if (!bankInfo.trim()) return { error: "Vui lòng nhập thông tin nhận tiền (ngân hàng/số tài khoản)." };

  const { error } = await supabase.from("affiliate_payout_requests").insert({
    member_id: user.id,
    amount_requested: Math.round(amountRequested),
    bank_info: bankInfo.trim(),
  });

  if (error) {
    return {
      error:
        error.code === "42P01"
          ? "Tính năng yêu cầu thanh toán chưa được kích hoạt — Founder cần duyệt migration trước."
          : "Không thể gửi yêu cầu, vui lòng thử lại.",
    };
  }

  revalidatePath("/portal/affiliate");
  return { error: null };
}
