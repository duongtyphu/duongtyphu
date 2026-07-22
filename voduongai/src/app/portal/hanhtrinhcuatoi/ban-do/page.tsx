import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { JourneyMapAtlas } from "@/components/portal/journey-map/JourneyMapAtlas";
import { getLiveMapChrome } from "@/lib/portal/live-map";
import type { Reflection } from "@/lib/portal/reflections";

export const metadata = {
  title: "Bản đồ hành trình",
  description: "Không đo tốc độ — chỉ cho biết bạn đang ở đâu và hướng nào đang mở ra tiếp theo.",
  robots: { index: false },
};

/**
 * JOURNEY PLATFORM — Phase P6: Journey Map, "Ancient Atlas".
 * Server component chỉ gom reflections + sở hữu Premium THẬT (Supabase,
 * cùng pattern Mirror/My Story/Hub) rồi giao toàn bộ tấm bản đồ cho
 * `JourneyMapAtlas` (client — đọc thêm growth-view/localStorage: chương
 * hiện tại, hoạt động từng pillar, output thật). Xem
 * docs/JOURNEY_PLATFORM_ARCHITECTURE.md mục 8 và 18.7.
 */
async function getMapData(): Promise<{ reflections: Reflection[]; premiumCount: number }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { reflections: [], premiumCount: 0 };
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return { reflections: [], premiumCount: 0 };

    const [{ data: reflectionRows }, purchasedCourseIds] = await Promise.all([
      supabase
        .from("reflections")
        .select("id, question, answer, created_at")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false }),
      getPurchasedIds("course_id"),
    ]);

    return {
      reflections: (reflectionRows ?? []).map((r) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        createdAt: r.created_at,
      })),
      premiumCount: purchasedCourseIds.size,
    };
  } catch {
    return { reflections: [], premiumCount: 0 };
  }
}

export default async function JourneyMapPage() {
  const [{ reflections, premiumCount }, chrome] = await Promise.all([getMapData(), getLiveMapChrome()]);
  return <JourneyMapAtlas reflections={reflections} premiumCount={premiumCount} seedChrome={chrome} />;
}
