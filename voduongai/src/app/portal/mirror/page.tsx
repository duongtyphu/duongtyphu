import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { MirrorChamber } from "@/components/portal/mirror/MirrorChamber";
import { signalsFromReflections, signalsFromMemoryCapsules, deriveComebackSignals } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones } from "@/lib/portal/growth-map/growth-milestones";
import { buildMirrorNarrative } from "@/lib/portal/growth-map/mirror-narrative";
import { buildReflectionMoments } from "@/lib/portal/growth-map/growth-reflection-engine";
import { buildFirstFootprintMirrorView } from "@/lib/portal/growth-map/first-footprint-mirror";
import { buildCompanionMirrorInvitation } from "@/lib/portal/companion/mirror-dialogue";
import { getOriginLineFromCoreMemory } from "@/lib/portal/companion/core-memory";
import { getOriginLineContextDefinition } from "@/lib/portal/companion/origin-line-context";
import { getLiveMirrorChrome, getLiveMirrorQuestions } from "@/lib/portal/live-mirror";
import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule, MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";

export const metadata = {
  title: "Mirror",
  description: "Một cuộc trò chuyện yên lặng giữa bạn và chính mình — không chấm điểm, không phân tích.",
  robots: { index: false },
};

/**
 * JOURNEY PLATFORM — Phase P4: Mirror Reconstruction.
 * Server component chỉ gom dữ liệu THẬT (Supabase: reflections,
 * memory_capsules, sở hữu Premium) rồi chạy đúng các engine growth-map
 * đã có (KHÔNG viết lại logic phản chiếu) để tạo NHẬN RA (patterns) —
 * toàn bộ trải nghiệm "buồng gương" giao cho `MirrorChamber` (client —
 * đọc thêm growth-view/localStorage cho NHÌN LẠI: hoạt động thật, output
 * thật). Xem docs/JOURNEY_PLATFORM_ARCHITECTURE.md mục 6 và 18.5.
 */

async function getMirrorData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { reflections: [] as Reflection[], capsules: [] as MemoryCapsule[], premiumCount: 0 };
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return { reflections: [], capsules: [], premiumCount: 0 };

    const [{ data: reflectionRows }, { data: capsuleRows }, purchasedCourseIds] = await Promise.all([
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
      getPurchasedIds("course_id"),
    ]);

    return {
      reflections: (reflectionRows ?? []).map((r) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        createdAt: r.created_at,
      })),
      capsules: (capsuleRows ?? []).map((c) => ({
        id: c.id,
        kind: c.kind as MemoryCapsuleKind,
        title: c.title,
        description: c.description ?? undefined,
        occurredAt: c.occurred_at,
        source: c.source ?? undefined,
      })),
      premiumCount: purchasedCourseIds.size,
    };
  } catch {
    return { reflections: [], capsules: [], premiumCount: 0 };
  }
}

export default async function MirrorPage() {
  const [{ reflections, capsules, premiumCount }, chrome, questions] = await Promise.all([
    getMirrorData(),
    getLiveMirrorChrome(),
    getLiveMirrorQuestions(),
  ]);
  const baseSignals = [...signalsFromReflections(reflections), ...signalsFromMemoryCapsules(capsules)];
  const growthSignals = [...baseSignals, ...deriveComebackSignals(baseSignals)];

  const invitation = buildCompanionMirrorInvitation(growthSignals);
  const narrativeLines = buildMirrorNarrative(growthSignals);
  const reflectionMoments = buildReflectionMoments(growthSignals);
  const firstFootprint = buildFirstFootprintMirrorView(capsules);
  const milestones = detectGrowthMilestones(growthSignals);
  const hasQuietSeason = milestones.some((m) => m.id === "return-after-silence" || m.id === "quiet-season");
  const quietSeasonLine = hasQuietSeason ? "Có những khoảng lặng cũng là một phần của hành trình." : null;

  // Ceremony Context Adapter — Origin Line chỉ được gate khi mùa phản
  // chiếu thật sự trống, không bao giờ thay vị trí nội dung thật.
  const hasReflectionMaterial = narrativeLines.length > 0 || reflectionMoments.length > 0 || !!firstFootprint || !!quietSeasonLine;
  const mirrorContext = getOriginLineContextDefinition("mirror_of_growth");
  const originLine = hasReflectionMaterial ? null : getOriginLineFromCoreMemory(mirrorContext.coreMemoryContext);

  return (
    <MirrorChamber
      invitation={invitation}
      narrativeLines={narrativeLines}
      reflectionMoments={reflectionMoments}
      firstFootprint={firstFootprint}
      quietSeasonLine={quietSeasonLine}
      originLine={originLine}
      reflectionCount={reflections.length}
      capsuleCount={capsules.length}
      premiumCount={premiumCount}
      seedChrome={chrome}
      seedQuestions={questions}
    />
  );
}
