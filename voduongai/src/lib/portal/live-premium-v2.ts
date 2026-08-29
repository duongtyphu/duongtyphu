import { cache } from "react";

import { getSupabasePublic } from "@/lib/supabase";
import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";

/**
 * Giai đoạn 5 — 3 khối mới của `/v2/premium`, admin-editable qua
 * `premium_perks`/`premium_advisor_situations`/`premium_founder`
 * (bảng generic mới, xem `supabase-phase28-premium-v2-perks-advisor-founder.sql`).
 * Thay thế 3 mảng/nội dung TĨNH trước đây (perk-grid hardcode 2 trạng
 * thái, `PremiumAdvisor`'s SITUATIONS nhắm 5 chương trình cũ, hồ sơ
 * Founder chỉ tồn tại tĩnh ở Portal 1.0's FounderSpotlight — không admin-
 * editable ở bất kỳ đâu).
 */
export type PremiumPerk = {
  id: string;
  status: string;
  audience: "guest" | "member";
  icon: string;
  title: string;
  description: string;
};

export type PremiumAdvisorSituation = {
  id: string;
  status: string;
  label: string;
  recommendation: string;
  targetPlanId: string;
  targetLabel: string;
};

export type PremiumFounder = {
  id: string;
  status: string;
  name: string;
  role: string;
  photoUrl: string;
  tags: string[];
  intro: string;
  expertise: string[];
  philosophy: string;
  achievements: string[];
};

const DEFAULT_FOUNDER: PremiumFounder = {
  id: "founder",
  status: "Published",
  name: "Võ Đương",
  role: "Nhà sáng lập VO DUONG AI",
  photoUrl: "/images/founder-portrait.jpg",
  tags: ["AI ứng dụng", "Affiliate Marketing", "Automation", "AI Strategy", "Phát triển hệ thống"],
  intro:
    "Võ Đương là nhà sáng lập VO DUONG AI — nhà đầu tư và người ứng dụng AI thực chiến trong kinh doanh số. Với nền tảng thực chiến trong Affiliate Marketing và xây dựng hệ thống tự động hóa, anh xây VO DUONG AI thành một hệ sinh thái có lộ trình rõ ràng thay vì những thông tin rời rạc.",
  expertise: [
    "Ứng dụng AI trong kinh doanh số và Affiliate Marketing",
    "Xây dựng hệ thống tự động hóa quy trình vận hành",
    "Phát triển kênh nội dung và chiến lược phân phối",
  ],
  philosophy: "Học AI không phải để biết — mà để làm được ngay. Mỗi buổi học là một kết quả thực tế.",
  achievements: [
    "Sáng lập và trực tiếp xây dựng hệ sinh thái VO DUONG AI: Portal, Companion, hệ tri thức CKOS và các chương trình đào tạo.",
    "Đại diện Quốc gia khu vực Miền Nam — DigiU Việt Nam.",
    "Nhiều năm đầu tư và vận hành hệ thống Affiliate/tài sản số bằng AI — nội dung giảng dạy lấy từ chính trải nghiệm này.",
  ],
};

export const getAllLivePremiumPerks = cache(async (): Promise<PremiumPerk[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase.from("premium_perks").select("id, data, status, order").order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      status: row.status as string,
      audience: d.audience === "member" ? "member" : "guest",
      icon: String(d.icon ?? ""),
      title: String(d.title ?? ""),
      description: String(d.description ?? ""),
    };
  });
});

export const getAllLivePremiumAdvisorSituations = cache(async (): Promise<PremiumAdvisorSituation[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("premium_advisor_situations")
    .select("id, data, status, order")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      status: row.status as string,
      label: String(d.label ?? ""),
      recommendation: String(d.recommendation ?? ""),
      targetPlanId: String(d.targetPlanId ?? ""),
      targetLabel: String(d.targetLabel ?? ""),
    };
  });
});

export const getLivePremiumFounder = cache(async (): Promise<PremiumFounder> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_FOUNDER;
  const { data, error } = await supabase
    .from("premium_founder")
    .select("id, data, status")
    .eq("id", "founder")
    .eq("status", "Published")
    .maybeSingle();
  if (error || !data) return DEFAULT_FOUNDER;
  const d = (data.data ?? {}) as Record<string, unknown>;
  return {
    id: data.id as string,
    status: data.status as string,
    name: String(d.name ?? DEFAULT_FOUNDER.name),
    role: String(d.role ?? DEFAULT_FOUNDER.role),
    photoUrl: String(d.photoUrl ?? DEFAULT_FOUNDER.photoUrl),
    tags: Array.isArray(d.tags) ? (d.tags as string[]) : DEFAULT_FOUNDER.tags,
    intro: String(d.intro ?? DEFAULT_FOUNDER.intro),
    expertise: Array.isArray(d.expertise) ? (d.expertise as string[]) : DEFAULT_FOUNDER.expertise,
    philosophy: String(d.philosophy ?? DEFAULT_FOUNDER.philosophy),
    achievements: Array.isArray(d.achievements) ? (d.achievements as string[]) : DEFAULT_FOUNDER.achievements,
  };
});

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

/**
 * Đợt sửa "Đặc quyền truy cập kho tài nguyên Premium" (thay hẳn khối
 * "Đặc quyền Portal 2.0 của bạn" cũ — trùng nội dung với "Quyền lợi dành
 * riêng cho Premium Member" ngay phía trên). 6 số đếm THẬT cho đúng 6
 * nguồn tài nguyên hiển thị ở tab "Thư viện tài nguyên" của
 * `/v2/hoc-vien-ai` (`prompts`/`sop`/`resources`/`best_practices` — 4
 * nguồn tĩnh — + 2 bộ sưu tập CKOS `ai-office`/`ai-research-presentation`,
 * đếm qua `knowledge_seeds.collectionSlug`) — KHÔNG dùng
 * `getPremiumResourceCounts()` phía trên vì hàm đó đếm 1 tập nguồn KHÁC
 * (`sop` được gọi là "workflows", cộng `templates`/`ebooks`/`checklists`/
 * `case_studies` — không khớp đúng 4+2 nguồn thật của tab "Thư viện tài
 * nguyên").
 */
export type PremiumLibraryCounts = {
  prompt: number;
  sop: number;
  resource: number;
  bestPractice: number;
  aiOffice: number;
  aiResearch: number;
};

const EMPTY_LIBRARY_COUNTS: PremiumLibraryCounts = { prompt: 0, sop: 0, resource: 0, bestPractice: 0, aiOffice: 0, aiResearch: 0 };

export const getLibraryResourceCounts = cache(async (): Promise<PremiumLibraryCounts> => {
  const supabase = getSupabasePublic();
  if (!supabase) return EMPTY_LIBRARY_COUNTS;

  const countPublished = (table: string) => supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "Published");
  const countInCollection = (slug: string) =>
    supabase
      .from("knowledge_seeds")
      .select("id", { count: "exact", head: true })
      .eq("status", "Published")
      .eq("data->>collectionSlug", slug);

  const [prompt, sop, resource, bestPractice, aiOffice, aiResearch] = await Promise.all([
    countPublished("prompts"),
    countPublished("sop"),
    countPublished("resources"),
    countPublished("best_practices"),
    countInCollection("ai-office"),
    countInCollection("ai-research-presentation"),
  ]);

  return {
    prompt: prompt.count ?? 0,
    sop: sop.count ?? 0,
    resource: resource.count ?? 0,
    bestPractice: bestPractice.count ?? 0,
    aiOffice: aiOffice.count ?? 0,
    aiResearch: aiResearch.count ?? 0,
  };
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
