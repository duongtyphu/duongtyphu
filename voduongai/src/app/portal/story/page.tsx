import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { MyStoryBook } from "@/components/portal/story/MyStoryBook";
import { getLiveStoryChrome } from "@/lib/portal/live-story";
import { signalsFromReflections, signalsFromMemoryCapsules } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones, type GrowthMilestone } from "@/lib/portal/growth-map/growth-milestones";
import { isMissingTableError, warnMissingTableOnce } from "@/lib/portal/storyTableStatus";
import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule, MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";

export const metadata = {
  title: "My Story",
  description: "Cuốn sách cá nhân đang được viết bằng chính những điều bạn học, tạo ra và gìn giữ.",
  robots: { index: false },
};

/**
 * JOURNEY PLATFORM — Phase P3: My Story Reconstruction.
 * My Story KHÔNG phải blog/timeline/dashboard — đây là một CUỐN SÁCH.
 * Server component chỉ gom dữ liệu THẬT (Supabase: reflections,
 * memory_capsules, cột mốc, đơn hàng Premium đầu tiên) rồi giao toàn bộ
 * trải nghiệm "đọc sách" cho `MyStoryBook` (client — nơi đọc thêm
 * growth-view/localStorage: chương hiện tại, output thật, sự kiện thật
 * đầu tiên). Xem docs/JOURNEY_PLATFORM_ARCHITECTURE.md mục 5 và
 * GARDEN_VISUAL_DIRECTION.md cho tinh thần "mỗi cửa một ngôn ngữ riêng".
 */

type FirstPremiumMoment = { title: string; occurredAt: string } | null;

export async function getStoryData(): Promise<{
  memberSince: Date | null;
  reflections: Reflection[];
  capsules: MemoryCapsule[];
  milestones: GrowthMilestone[];
  firstPremium: FirstPremiumMoment;
  premiumCount: number;
  storageReady: boolean;
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { memberSince: null, reflections: [], capsules: [], milestones: [], firstPremium: null, premiumCount: 0, storageReady: true };
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return { memberSince: null, reflections: [], capsules: [], milestones: [], firstPremium: null, premiumCount: 0, storageReady: true };

    const [
      { data: reflectionRows, error: reflectionError },
      { data: capsuleRows, error: capsuleError },
      { data: orderRows },
      purchasedCourseIds,
    ] = await Promise.all([
      supabase
        .from("reflections")
        .select("id, question, answer, created_at")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("memory_capsules")
        .select("id, kind, title, description, occurred_at, source")
        .eq("member_id", user.id)
        .order("occurred_at", { ascending: false }),
      supabase
        .from("orders")
        .select("product_name, created_at")
        .eq("member_email", user.email ?? "")
        .eq("status", "confirmed")
        .not("course_id", "is", null)
        .order("created_at", { ascending: true })
        .limit(1),
      getPurchasedIds("course_id"),
    ]);

    let storageReady = true;
    if (isMissingTableError(reflectionError)) {
      storageReady = false;
      warnMissingTableOnce("reflections");
    }
    if (isMissingTableError(capsuleError)) {
      storageReady = false;
      warnMissingTableOnce("memory_capsules");
    }

    const reflections: Reflection[] = (reflectionRows ?? []).map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      createdAt: r.created_at,
    }));
    const capsules: MemoryCapsule[] = (capsuleRows ?? []).map((c) => ({
      id: c.id,
      kind: c.kind as MemoryCapsuleKind,
      title: c.title,
      description: c.description ?? undefined,
      occurredAt: c.occurred_at,
      source: c.source ?? undefined,
    }));
    const signals = [...signalsFromReflections(reflections), ...signalsFromMemoryCapsules(capsules)];
    const milestones = detectGrowthMilestones(signals);
    const firstOrder = (orderRows ?? [])[0];
    const firstPremium: FirstPremiumMoment = firstOrder
      ? { title: firstOrder.product_name ?? "Một chương trình Premium", occurredAt: firstOrder.created_at }
      : null;

    return {
      memberSince: new Date(user.created_at),
      reflections,
      capsules,
      milestones,
      firstPremium,
      premiumCount: purchasedCourseIds.size,
      storageReady,
    };
  } catch {
    return { memberSince: null, reflections: [], capsules: [], milestones: [], firstPremium: null, premiumCount: 0, storageReady: true };
  }
}

export default async function MyStoryPage() {
  const [data, chrome] = await Promise.all([getStoryData(), getLiveStoryChrome()]);
  return <MyStoryBook {...data} seedChrome={chrome} />;
}
