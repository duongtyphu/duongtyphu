import { getSupabaseAdmin } from "@/lib/supabase";

export type AffiliateReferralStatus = "pending" | "confirmed" | "paid";

export type AdminReferralRow = {
  id: number;
  referrerId: string;
  referrerEmail: string | null;
  referrerReferralCode: string | null;
  referredEmail: string;
  status: AffiliateReferralStatus;
  commissionRate: number;
  commissionAmount: number;
  orderId: number | null;
  orderAmount: number | null;
  orderProductName: string | null;
  orderCourseId: string | null;
  createdAt: string;
  paidAt: string | null;
};

/**
 * Nạp toàn bộ `referrals` + join `members` (email/referral_code của người
 * giới thiệu) + `orders` (số tiền/tên sản phẩm của đơn hàng khớp) — dùng
 * chung cho mọi trang Admin Workspace "Affiliate" (Tổng quan/Thành viên/
 * Referral/Đơn hàng/Hoa hồng/Báo cáo) thay vì viết lại join 5-6 lần. Mỗi
 * trang tự lọc/gộp theo đúng góc nhìn của nó từ CÙNG 1 tập dữ liệu — tránh
 * 2 trang tính ra 2 con số khác nhau cho cùng 1 câu hỏi.
 */
export async function loadAdminReferrals(): Promise<{
  rows: AdminReferralRow[];
  configured: boolean;
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false, error: null };

  const { data: referralRows, error } = await supabase
    .from("referrals")
    .select("id, referrer_id, referred_email, order_id, commission_rate, commission_amount, status, created_at, paid_at")
    .order("created_at", { ascending: false });

  if (error) return { rows: [], configured: true, error: error.message };

  const rows = referralRows ?? [];
  const referrerIds = Array.from(new Set(rows.map((r) => r.referrer_id).filter((id): id is string => !!id)));
  const orderIds = rows.map((r) => r.order_id).filter((id): id is number => id != null);

  const [membersRes, ordersRes] = await Promise.all([
    referrerIds.length > 0
      ? supabase.from("members").select("id, email, referral_code").in("id", referrerIds)
      : Promise.resolve({ data: [] as { id: string; email: string; referral_code: string | null }[] }),
    orderIds.length > 0
      ? supabase.from("orders").select("id, amount, product_name, course_id").in("id", orderIds)
      : Promise.resolve({ data: [] as { id: number; amount: number; product_name: string | null; course_id: string | null }[] }),
  ]);

  const memberById = new Map((membersRes.data ?? []).map((m) => [m.id, m]));
  const orderById = new Map((ordersRes.data ?? []).map((o) => [o.id, o]));

  const enriched: AdminReferralRow[] = rows.map((r) => {
    const referrer = memberById.get(r.referrer_id);
    const order = r.order_id != null ? orderById.get(r.order_id) : undefined;
    return {
      id: r.id,
      referrerId: r.referrer_id,
      referrerEmail: referrer?.email ?? null,
      referrerReferralCode: referrer?.referral_code ?? null,
      referredEmail: r.referred_email,
      status: (r.status ?? "pending") as AffiliateReferralStatus,
      commissionRate: r.commission_rate ?? 0,
      commissionAmount: r.commission_amount ?? 0,
      orderId: r.order_id,
      orderAmount: order?.amount ?? null,
      orderProductName: order?.product_name ?? null,
      orderCourseId: order?.course_id ?? null,
      createdAt: r.created_at,
      paidAt: r.paid_at,
    };
  });

  return { rows: enriched, configured: true, error: null };
}

export type AdminReferrerSummary = {
  referrerId: string;
  referrerEmail: string | null;
  referralCode: string | null;
  signups: number;
  customers: number;
  revenue: number;
  commissionConfirmed: number;
  commissionPaid: number;
  commissionTotal: number;
};

/** Gộp `AdminReferralRow[]` theo từng người giới thiệu — dùng cho Thành viên/Hoa hồng/Báo cáo. */
export function summarizeByReferrer(rows: AdminReferralRow[]): AdminReferrerSummary[] {
  const byReferrer = new Map<string, AdminReferrerSummary>();
  for (const r of rows) {
    let s = byReferrer.get(r.referrerId);
    if (!s) {
      s = {
        referrerId: r.referrerId,
        referrerEmail: r.referrerEmail,
        referralCode: r.referrerReferralCode,
        signups: 0,
        customers: 0,
        revenue: 0,
        commissionConfirmed: 0,
        commissionPaid: 0,
        commissionTotal: 0,
      };
      byReferrer.set(r.referrerId, s);
    }
    s.signups += 1;
    if (r.orderId != null) {
      s.customers += 1;
      s.revenue += r.orderAmount ?? 0;
    }
    if (r.status === "confirmed") {
      s.commissionConfirmed += r.commissionAmount;
      s.commissionTotal += r.commissionAmount;
    } else if (r.status === "paid") {
      s.commissionPaid += r.commissionAmount;
      s.commissionTotal += r.commissionAmount;
    }
  }
  return Array.from(byReferrer.values()).sort((a, b) => b.commissionTotal - a.commissionTotal);
}
