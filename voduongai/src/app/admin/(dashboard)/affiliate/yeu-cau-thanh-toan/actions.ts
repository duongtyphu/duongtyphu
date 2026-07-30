"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Yêu cầu thanh toán hoa hồng — bảng `affiliate_payout_requests` (typed, đề
// xuất ở supabase-phase27-affiliate-program.sql, CHƯA apply).

export type PayoutRequest = {
  id: number;
  member_id: string;
  member_email: string | null;
  amount_requested: number;
  bank_info: string | null;
  status: "pending" | "approved" | "paid" | "rejected";
  requested_at: string;
  processed_at: string | null;
  admin_note: string | null;
};

export async function listPayoutRequests(): Promise<{
  requests: PayoutRequest[];
  configured: boolean;
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { requests: [], configured: false, error: null };

  const { data, error } = await supabase
    .from("affiliate_payout_requests")
    .select("id, member_id, amount_requested, bank_info, status, requested_at, processed_at, admin_note")
    .order("requested_at", { ascending: false });

  if (error) {
    return {
      requests: [],
      configured: true,
      error:
        error.code === "42P01"
          ? "Bảng affiliate_payout_requests chưa tồn tại — chờ Founder duyệt migration."
          : error.message,
    };
  }

  const rows = data ?? [];
  const memberIds = Array.from(new Set(rows.map((r) => r.member_id)));
  const { data: memberRows } =
    memberIds.length > 0 ? await supabase.from("members").select("id, email").in("id", memberIds) : { data: [] };
  const emailById = new Map((memberRows ?? []).map((m) => [m.id, m.email]));

  return {
    requests: rows.map((r) => ({ ...r, member_email: emailById.get(r.member_id) ?? null })) as PayoutRequest[],
    configured: true,
    error: null,
  };
}

/**
 * Duyệt & xác nhận đã thanh toán — hành động THỦ CÔNG của Admin sau khi đã
 * thực sự chuyển khoản ngoài hệ thống (đúng bản chất "yêu cầu rút tiền",
 * không phải sự kiện hệ thống tự suy luận được, khác trigger tự động tính
 * hoa hồng khi order confirmed). Đồng thời chuyển TOÀN BỘ dòng
 * `referrals.status='confirmed'` hiện có của đúng referrer đó sang `'paid'`
 * (+ `paid_at`) — thiết kế đơn giản hoá: 1 lần duyệt = thanh toán trọn gói
 * số dư hoa hồng đã xác nhận tại thời điểm duyệt, tránh sổ sách theo từng
 * phần số tiền lẻ giữa nhiều dòng referrals.
 */
export async function markPayoutPaid(id: number, adminNote?: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { data: request, error: fetchError } = await supabase
    .from("affiliate_payout_requests")
    .select("id, member_id, status")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !request) return { error: "Không tìm thấy yêu cầu thanh toán." };
  if (request.status === "paid") return { error: "Yêu cầu này đã được thanh toán." };

  const nowIso = new Date().toISOString();

  const { error: referralsError } = await supabase
    .from("referrals")
    .update({ status: "paid", paid_at: nowIso })
    .eq("referrer_id", request.member_id)
    .eq("status", "confirmed");
  if (referralsError) return { error: "Không thể cập nhật trạng thái hoa hồng, vui lòng thử lại." };

  const { error } = await supabase
    .from("affiliate_payout_requests")
    .update({ status: "paid", processed_at: nowIso, admin_note: adminNote ?? null })
    .eq("id", id);
  if (error) return { error: "Không thể cập nhật yêu cầu thanh toán, vui lòng thử lại." };

  revalidatePath("/admin/affiliate/yeu-cau-thanh-toan");
  revalidatePath("/admin/affiliate/hoa-hong");
  revalidatePath("/admin/affiliate/referral");
  return { error: null };
}

export async function rejectPayoutRequest(id: number, adminNote?: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("affiliate_payout_requests")
    .update({ status: "rejected", processed_at: new Date().toISOString(), admin_note: adminNote ?? null })
    .eq("id", id);
  if (error) return { error: "Không thể cập nhật yêu cầu thanh toán, vui lòng thử lại." };

  revalidatePath("/admin/affiliate/yeu-cau-thanh-toan");
  return { error: null };
}
