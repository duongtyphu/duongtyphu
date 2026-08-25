import { cache } from "react";

import { getSupabasePublic } from "@/lib/supabase";
import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";

/**
 * Nguồn dữ liệu THẬT cho `/v2/premium` (Bước F) — thay 2 khối bịa lớn nhất
 * trong `Premium.html`:
 *
 * 1. "Kho tài nguyên Premium" (res-grid) — mockup có số mẫu cố định
 *    (250+ prompt, 80+ workflow, 120+ template, 60+ ebook, 45+ checklist,
 *    30+ case study). Đây chính là 6/9 "Intelligence" CKOS đã có sẵn tầng
 *    đọc thật (`prompts`/`sop`/`templates`/`ebooks`/`checklists`, schema
 *    generic `id/data/status/order`; `case_studies` là bảng typed riêng,
 *    cột `active` boolean — không phải `status`, xem CLAUDE.md mục "Case
 *    Study"). Đếm thuần (`count: "exact", head: true`), không tải `data`
 *    jsonb — cùng kỹ thuật Admin Dashboard tổng quan đã dùng.
 *
 * 2. "Lộ trình Premium của bạn" (6 bước bịa, % giả) + `ustat-grid` (6 số
 *    bịa) — tái dùng `getJourneyOverview()` (đã có từ `/v2/hanh-trinh-cua-toi`)
 *    thay vì viết lại logic tính lộ trình/tiến độ lần thứ 2 — xem
 *    `PremiumClient.tsx` cho cách map cụ thể.
 */

const GENERIC_RESOURCE_TABLES = {
  prompts: "prompts",
  workflows: "sop",
  templates: "templates",
  ebooks: "ebooks",
  checklists: "checklists",
} as const;

export type PremiumResourceCounts = {
  prompts: number;
  workflows: number;
  templates: number;
  ebooks: number;
  checklists: number;
  caseStudies: number;
};

const EMPTY_COUNTS: PremiumResourceCounts = {
  prompts: 0,
  workflows: 0,
  templates: 0,
  ebooks: 0,
  checklists: 0,
  caseStudies: 0,
};

export const getPremiumResourceCounts = cache(async (): Promise<PremiumResourceCounts> => {
  const supabase = getSupabasePublic();
  if (!supabase) return EMPTY_COUNTS;

  const genericEntries = Object.entries(GENERIC_RESOURCE_TABLES) as [keyof typeof GENERIC_RESOURCE_TABLES, string][];
  const [genericCounts, caseStudyCount] = await Promise.all([
    Promise.all(
      genericEntries.map(async ([key, table]) => {
        const { count } = await supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "Published");
        return [key, count ?? 0] as const;
      }),
    ),
    supabase
      .from("case_studies")
      .select("id", { count: "exact", head: true })
      .eq("active", true)
      .then((r) => r.count ?? 0),
  ]);

  const counts = { ...EMPTY_COUNTS };
  for (const [key, count] of genericCounts) counts[key] = count;
  counts.caseStudies = caseStudyCount;
  return counts;
});

export type PremiumMemberSummary = {
  /** Tổng `orders.amount` thật đã thanh toán cho các chương trình Premium đã sở hữu (sau coupon nếu có). */
  totalAmount: number;
  /** `created_at` sớm nhất trong các đơn `confirmed` — dùng làm "Bắt đầu Premium từ". `null` nếu không tìm được (vd. Premium cấp qua `premium_expires_at` thủ công, không qua đơn hàng). */
  firstPurchaseAt: string | null;
};

const EMPTY_SUMMARY: PremiumMemberSummary = { totalAmount: 0, firstPurchaseAt: null };

/**
 * @deprecated Phase 38 — `/v2/premium` không còn hiển thị 5 chương trình
 * mua đứt (`PREMIUM_PROGRAMS`/`courses`), thay bằng 3 gói `premium_plans`
 * (xem `getPremiumPlanMemberSummary()` bên dưới). Giữ lại hàm này để tham
 * khảo/rollback — không còn consumer nào import.
 */
export async function getPremiumMemberSummary(programCourseIds: string[]): Promise<PremiumMemberSummary> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return EMPTY_SUMMARY;
  if (programCourseIds.length === 0) return EMPTY_SUMMARY;

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return EMPTY_SUMMARY;

  const { data } = await supabase
    .from("orders")
    .select("amount, created_at")
    .eq("member_email", email)
    .eq("status", "confirmed")
    .in("course_id", programCourseIds);

  if (!data || data.length === 0) return EMPTY_SUMMARY;

  const totalAmount = data.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const firstPurchaseAt = data.reduce<string | null>((earliest, row) => {
    const createdAt = row.created_at as string | null;
    if (!createdAt) return earliest;
    if (!earliest || new Date(createdAt).getTime() < new Date(earliest).getTime()) return createdAt;
    return earliest;
  }, null);

  return { totalAmount, firstPurchaseAt };
}

export type PremiumPlanMemberSummary = {
  /** Tên gói đã mua gần nhất (đơn `confirmed` mới nhất có `plan_id`) — `null` nếu Premium được cấp thủ công, không qua mua gói. */
  planName: string | null;
  /** Số tiền đã trả cho lần mua gói gần nhất. */
  lastPaidAmount: number;
  /** `created_at` của đơn mua gói gần nhất — dùng làm "Bắt đầu gói hiện tại từ". */
  purchasedAt: string | null;
  /** `members.premium_expires_at` thật — `null` khi Premium chưa có hạn xác định (vd. mua đứt cũ, xem `getPremiumStatus()` Mục 1). */
  expiresAt: string | null;
};

const EMPTY_PLAN_SUMMARY: PremiumPlanMemberSummary = { planName: null, lastPaidAmount: 0, purchasedAt: null, expiresAt: null };

/**
 * Phase 38 — bản kế nhiệm `getPremiumMemberSummary()`: đọc đơn mua GÓI
 * PREMIUM gần nhất (`orders.plan_id` — Phase 38, khác `course_id` của 5
 * chương trình cũ) + `members.premium_expires_at` thật (đã được trigger
 * `on_order_confirmed_premium_plan` gia hạn khi đơn xác nhận).
 */
export async function getPremiumPlanMemberSummary(): Promise<PremiumPlanMemberSummary> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return EMPTY_PLAN_SUMMARY;

  const supabase = await getSupabaseServer();
  const user = await getCachedAuthUser();
  const userId = user?.id;
  const email = user?.email;
  if (!userId || !email) return EMPTY_PLAN_SUMMARY;

  const [{ data: member }, { data: lastOrder }] = await Promise.all([
    supabase.from("members").select("premium_expires_at").eq("id", userId).maybeSingle(),
    supabase
      .from("orders")
      .select("amount, created_at, plan_id")
      .eq("member_email", email)
      .eq("status", "confirmed")
      .not("plan_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const expiresAt = (member?.premium_expires_at as string | null | undefined) ?? null;
  if (!lastOrder) return { ...EMPTY_PLAN_SUMMARY, expiresAt };

  // Không dùng cú pháp embed `premium_plans(name)` — `orders.plan_id` chưa
  // có ràng buộc khoá ngoại tới `premium_plans.id` (cột thêm additive-only,
  // Phase 38), PostgREST cần FK để suy quan hệ embed. Tra tên gói riêng.
  const { data: plan } = await supabase.from("premium_plans").select("name").eq("id", lastOrder.plan_id as string).maybeSingle();

  return {
    planName: (plan?.name as string | undefined) ?? null,
    lastPaidAmount: Number(lastOrder.amount) || 0,
    purchasedAt: (lastOrder.created_at as string | null) ?? null,
    expiresAt,
  };
}
