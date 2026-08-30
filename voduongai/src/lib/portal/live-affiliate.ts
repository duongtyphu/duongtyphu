import { cache } from "react";

import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase";
import { siteConfig } from "@/lib/site";

export type AffiliateReferralStatus = "pending" | "confirmed" | "paid";

export type AffiliateReferralRow = {
  id: number;
  referredEmail: string;
  status: AffiliateReferralStatus;
  commissionRate: number;
  commissionAmount: number;
  orderId: number | null;
  orderAmount: number | null;
  orderProductName: string | null;
  createdAt: string;
  paidAt: string | null;
};

export type AffiliatePayoutRequestRow = {
  id: number;
  amountRequested: number;
  status: "pending" | "approved" | "paid" | "rejected";
  requestedAt: string;
  processedAt: string | null;
  bankInfo: string | null;
  adminNote: string | null;
};

export type AffiliateOverview = {
  memberId: string;
  email: string;
  referralCode: string | null;
  referralLink: string | null;
  /** null = bảng affiliate_link_visits chưa tồn tại (migration chưa apply). */
  visits: number | null;
  signups: number;
  customers: number;
  ordersCount: number;
  revenue: number;
  commissionConfirmed: number;
  commissionPaid: number;
  commissionTotal: number;
  referrals: AffiliateReferralRow[];
  /** null = bảng affiliate_payout_requests chưa tồn tại (migration chưa apply). */
  payoutRequests: AffiliatePayoutRequestRow[] | null;
};

/**
 * Chương trình Affiliate — trang tổng quan Portal (`/portal/affiliate`,
 * trước đây `/portal/referral`). Đọc thẳng `members.referral_code`/
 * `referrals` ĐÃ CÓ SẴN VÀ ĐANG CHẠY (trigger `set_referral_code`/
 * `on_member_referred`/`handle_order_confirmed_commission` tự động tạo và
 * tính hoa hồng — xem `supabase-phase27-affiliate-program.sql` cho phần
 * còn thiếu: capture `ref_code` lúc đăng ký + cấu hình theo sản phẩm).
 *
 * Dùng session client (`getSupabaseServer()`) cho `members`/`referrals` —
 * cả 2 đều có RLS "đọc dữ liệu của chính mình"
 * (`auth.uid() = id`/`auth.uid() = referrer_id`), đúng nguyên tắc Security
 * First. Dùng `getSupabaseAdmin()` CHỈ cho 2 việc hẹp, đã scope theo dữ
 * liệu người dùng ĐÃ ĐƯỢC PHÉP thấy: (1) tra `orders.amount` theo đúng
 * `order_id` đã nằm sẵn trong `referrals` của CHÍNH mình (RLS `orders` chỉ
 * cho chủ đơn hàng đọc, không cho referrer — nhưng referrer có quyền biết
 * SỐ TIỀN đơn hàng mình đã giới thiệu, vì hoa hồng phụ thuộc trực tiếp vào
 * đó); (2) đếm `affiliate_link_visits` theo đúng `referral_code` của chính
 * mình (bảng đó chỉ có policy admin, không có policy user tự đọc).
 */
export async function getAffiliateOverview(): Promise<AffiliateOverview | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await getSupabaseServer();
  const user = await getCachedAuthUser();
  if (!user?.email) return null;

  const { data: memberRow } = await supabase
    .from("members")
    .select("referral_code")
    .eq("id", user.id)
    .maybeSingle();

  const referralCode = (memberRow?.referral_code as string | null) ?? null;
  const referralLink = referralCode ? `${siteConfig.url}/?ref=${referralCode}` : null;

  const { data: referralRows } = await supabase
    .from("referrals")
    .select("id, referred_email, order_id, commission_rate, commission_amount, status, created_at, paid_at")
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false });

  const rows = referralRows ?? [];
  const orderIds = rows.map((r) => r.order_id).filter((id): id is number => id != null);

  const ordersById = new Map<number, { amount: number; productName: string | null }>();
  const admin = getSupabaseAdmin();
  if (admin && orderIds.length > 0) {
    const { data: orderRows } = await admin.from("orders").select("id, amount, product_name").in("id", orderIds);
    for (const o of orderRows ?? []) {
      ordersById.set(o.id, { amount: o.amount ?? 0, productName: o.product_name ?? null });
    }
  }

  const referrals: AffiliateReferralRow[] = rows.map((r) => ({
    id: r.id,
    referredEmail: r.referred_email,
    status: (r.status ?? "pending") as AffiliateReferralStatus,
    commissionRate: r.commission_rate ?? 0,
    commissionAmount: r.commission_amount ?? 0,
    orderId: r.order_id,
    orderAmount: r.order_id != null ? (ordersById.get(r.order_id)?.amount ?? null) : null,
    orderProductName: r.order_id != null ? (ordersById.get(r.order_id)?.productName ?? null) : null,
    createdAt: r.created_at,
    paidAt: r.paid_at,
  }));

  const signups = referrals.length;
  const customers = referrals.filter((r) => r.orderId != null).length;
  const revenue = referrals.reduce((sum, r) => sum + (r.orderAmount ?? 0), 0);
  const commissionConfirmed = referrals
    .filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + r.commissionAmount, 0);
  const commissionPaid = referrals.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.commissionAmount, 0);

  let visits: number | null = null;
  if (admin && referralCode) {
    const { count, error } = await admin
      .from("affiliate_link_visits")
      .select("id", { count: "exact", head: true })
      .eq("referral_code", referralCode);
    if (!error) visits = count ?? 0;
  }

  let payoutRequests: AffiliatePayoutRequestRow[] | null = null;
  {
    const { data: payoutRows, error } = await supabase
      .from("affiliate_payout_requests")
      .select("id, amount_requested, status, requested_at, processed_at, bank_info, admin_note")
      .eq("member_id", user.id)
      .order("requested_at", { ascending: false });
    if (!error) {
      payoutRequests = (payoutRows ?? []).map((p) => ({
        id: p.id,
        amountRequested: p.amount_requested,
        status: p.status,
        requestedAt: p.requested_at,
        processedAt: p.processed_at,
        bankInfo: p.bank_info,
        adminNote: p.admin_note,
      }));
    }
  }

  return {
    memberId: user.id,
    email: user.email,
    referralCode,
    referralLink,
    visits,
    signups,
    customers,
    ordersCount: customers,
    revenue,
    commissionConfirmed,
    commissionPaid,
    commissionTotal: commissionConfirmed + commissionPaid,
    referrals,
    payoutRequests,
  };
}

export type AffiliateLeaderboardEntry = {
  rank: number;
  memberId: string;
  fullName: string;
  totalCommission: number;
  referralCount: number;
  isYou: boolean;
};

/**
 * Giai đoạn 6 — "Bảng xếp hạng Affiliate" thật (`/v2/affiliate`). Gọi RPC
 * `get_affiliate_leaderboard()` (SECURITY DEFINER, xem
 * `supabase-giai-doan-6-affiliate-leaderboard-rpc.sql`) — hàm CHỈ trả
 * đúng 4 cột an toàn đã tổng hợp (không lộ `referred_email`/`order_id`
 * của người khác), bypass đúng phạm vi hẹp thay vì mở rộng RLS
 * `referrals`. Founder xác nhận hiển thị TÊN ĐẦY ĐỦ + SỐ HOA HỒNG (không
 * ẩn danh). Dùng session client (`getSupabaseServer()`) — RPC tự đọc
 * `auth.uid()` từ JWT của session để đánh dấu `isYou`/luôn kèm hạng của
 * chính người gọi dù ngoài top N.
 */
export async function getAffiliateLeaderboard(limit = 10): Promise<AffiliateLeaderboardEntry[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.rpc("get_affiliate_leaderboard", { limit_n: limit });
  if (error || !data) return [];

  return (data as Array<{ rank: number; member_id: string; full_name: string; total_commission: number; referral_count: number; is_you: boolean }>).map(
    (row) => ({
      rank: row.rank,
      memberId: row.member_id,
      fullName: row.full_name,
      totalCommission: row.total_commission,
      referralCount: row.referral_count,
      isYou: row.is_you,
    }),
  );
}

export type AffiliateTierRule = {
  id: string;
  tierKey: string;
  label: string;
  ratePercent: number;
  minTransactions: number;
  benefits: string[];
  condition: string;
  isFeatured: boolean;
};

/**
 * "Mức hoa hồng của bạn" (3 tầng) — bảng `affiliate_tier_rules` (Giai
 * đoạn 6 tiếp, xem `supabase-giai-doan-6-affiliate-tier-rules.sql`), đúng
 * thiết kế đã chốt trong `vdaiportal2.0.html`. Đọc công khai qua anon key
 * (RLS "public read published") — không phụ thuộc phiên đăng nhập, khách
 * chưa đăng nhập cũng xem được 3 tầng.
 */
export const getAffiliateTierRules = cache(async (): Promise<AffiliateTierRule[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("affiliate_tier_rules")
    .select("id, data, status, order")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];

  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      tierKey: typeof d.tierKey === "string" ? d.tierKey : row.id,
      label: typeof d.label === "string" ? d.label : row.id,
      ratePercent: typeof d.ratePercent === "number" ? d.ratePercent : 0,
      minTransactions: typeof d.minTransactions === "number" ? d.minTransactions : 0,
      benefits: Array.isArray(d.benefits) ? (d.benefits as string[]) : [],
      condition: typeof d.condition === "string" ? d.condition : "",
      isFeatured: d.isFeatured === true,
    };
  });
});
