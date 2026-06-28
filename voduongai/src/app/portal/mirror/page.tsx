import { getSupabaseServer } from "@/lib/supabase-server";
import { GemCard } from "@/components/portal/ui/GemCard";
import { MirrorCeremony } from "@/components/portal/mirror/MirrorCeremony";
import { signalsFromReflections, signalsFromMemoryCapsules, deriveComebackSignals } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones } from "@/lib/portal/growth-map/growth-milestones";
import { buildMirrorNarrative } from "@/lib/portal/growth-map/mirror-narrative";
import { buildReflectionMoments } from "@/lib/portal/growth-map/growth-reflection-engine";
import { buildFirstFootprintMirrorView } from "@/lib/portal/growth-map/first-footprint-mirror";
import { buildCompanionMirrorInvitation } from "@/lib/portal/companion/mirror-dialogue";
import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule, MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";

export const metadata = {
  title: "Mirror",
  description: "Tấm gương phản chiếu hành trình trưởng thành của bạn — không chấm điểm, không so sánh.",
  robots: { index: false },
};

async function getMirrorData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { reflections: [] as Reflection[], capsules: [] as MemoryCapsule[] };
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return { reflections: [], capsules: [] };

    const [{ data: reflectionRows }, { data: capsuleRows }] = await Promise.all([
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
    };
  } catch {
    return { reflections: [], capsules: [] };
  }
}

export default async function MirrorPage() {
  const { reflections, capsules } = await getMirrorData();
  const baseSignals = [...signalsFromReflections(reflections), ...signalsFromMemoryCapsules(capsules)];
  const growthSignals = [...baseSignals, ...deriveComebackSignals(baseSignals)];

  const invitation = buildCompanionMirrorInvitation(growthSignals) ?? "Mình muốn cho bạn xem một điều.";
  const narrativeLines = buildMirrorNarrative(growthSignals);
  const reflectionMoments = buildReflectionMoments(growthSignals);
  const firstFootprint = buildFirstFootprintMirrorView(capsules);
  const milestones = detectGrowthMilestones(growthSignals);
  const hasQuietSeason = milestones.some((m) => m.id === "return-after-silence" || m.id === "quiet-season");
  const quietSeasonLine = hasQuietSeason ? "Có những khoảng lặng cũng là một phần của hành trình." : null;

  return (
    <div className="space-y-8">
      <GemCard variant="featured" className="!p-7 sm:!p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE]">Mirror</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Tấm gương trưởng thành của bạn</h1>
        <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">
          Đây không phải dashboard, không phải bảng điểm. Đây là nơi Portal phản chiếu lại điều bạn đã đi qua.
        </p>
      </GemCard>

      <GemCard className="!p-0">
        <MirrorCeremony
          invitation={invitation}
          narrativeLines={narrativeLines}
          reflectionMoments={reflectionMoments}
          firstFootprint={firstFootprint}
          quietSeasonLine={quietSeasonLine}
        />
      </GemCard>
    </div>
  );
}
