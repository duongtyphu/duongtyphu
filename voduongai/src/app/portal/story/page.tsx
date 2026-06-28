import { getSupabaseServer } from "@/lib/supabase-server";
import { GemCard } from "@/components/portal/ui/GemCard";
import { MyStoryTimeline, type StoryMoment } from "@/components/portal/story/MyStoryTimeline";
import { MonthlyLetterCard } from "@/components/portal/story/MonthlyLetterCard";
import { CompanionMemoryCard } from "@/components/portal/story/CompanionMemoryCard";
import { ReflectionJournalCard } from "@/components/portal/story/ReflectionJournalCard";
import { AddMemoryCapsuleForm } from "@/components/portal/story/AddMemoryCapsuleForm";
import { UnderstandingNoteCard } from "@/components/portal/story/UnderstandingNoteCard";
import { HumanGrowthDashboardCard } from "@/components/portal/story/HumanGrowthDashboardCard";
import { LivingGardenCard } from "@/components/portal/living-garden/LivingGardenCard";
import { GardenSignalSync } from "@/components/portal/intelligence/GardenSignalSync";
import { buildGardenState } from "@/lib/portal/living-garden/garden-model";
import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule, MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";
import { isMissingTableError, warnMissingTableOnce } from "@/lib/portal/storyTableStatus";
import { buildUnderstandingNote, detectGrowthPattern, buildGrowingQualities } from "@/lib/portal/human-understanding";

export const metadata = {
  title: "My Story",
  description: "Nơi Portal kể lại hành trình trưởng thành của riêng bạn — không phải hồ sơ, không phải dashboard.",
  robots: { index: false },
};

const CAPSULE_EMOJI: Record<MemoryCapsuleKind, string> = {
  milestone: "💎",
  lesson: "📚",
  decision: "🧭",
  breakthrough: "🌱",
  achievement: "🤝",
};

async function getStoryData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { memberSince: null as Date | null, reflections: [] as Reflection[], capsules: [] as MemoryCapsule[], storageReady: true };
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return { memberSince: null, reflections: [], capsules: [], storageReady: true };

    const [{ data: reflectionRows, error: reflectionError }, { data: capsuleRows, error: capsuleError }] = await Promise.all([
      supabase
        .from("reflections")
        .select("id, question, answer, created_at")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("memory_capsules")
        .select("id, kind, title, description, occurred_at")
        .eq("member_id", user.id)
        .order("occurred_at", { ascending: false }),
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

    return {
      memberSince: new Date(user.created_at),
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
      })),
      storageReady,
    };
  } catch {
    return { memberSince: null, reflections: [], capsules: [], storageReady: true };
  }
}

export default async function MyStoryPage() {
  const { memberSince, reflections, capsules, storageReady } = await getStoryData();

  const now = new Date();
  const thisMonthReflections = reflections.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthCapsules = capsules.filter((c) => {
    const d = new Date(c.occurredAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const moments: StoryMoment[] = [
    ...(memberSince
      ? [{ id: "day-one", emoji: "🌱", title: "Ngày đầu tiên bạn đến VO DUONG AI", date: memberSince }]
      : []),
    ...capsules.map((c) => ({
      id: c.id,
      emoji: CAPSULE_EMOJI[c.kind],
      title: c.title,
      description: c.description,
      date: new Date(c.occurredAt),
    })),
    ...reflections.map((r) => ({
      id: r.id,
      emoji: "🧠",
      title: r.question,
      description: r.answer,
      date: new Date(r.createdAt),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-8">
      <GemCard variant="featured" className="!p-7 sm:!p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE]">My Story</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Cuốn sách hành trình của bạn</h1>
        <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">
          Đây không phải hồ sơ. Đây là nơi Portal kể lại những bước bạn đã đi qua.
        </p>
        <p className="mt-2 max-w-xl text-xs italic text-white/45">
          Giai đoạn REFLECT trong hành trình mài giũa của bạn.
        </p>
      </GemCard>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ReflectionJournalCard />
        </div>
        <div className="lg:col-span-5">
          <CompanionMemoryCard reflections={reflections} />
        </div>
      </div>

      <AddMemoryCapsuleForm />

      <UnderstandingNoteCard note={buildUnderstandingNote(reflections)} pattern={detectGrowthPattern(reflections)} />

      <HumanGrowthDashboardCard qualities={buildGrowingQualities(reflections)} />

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Khu vườn trưởng thành của bạn</h2>
        </div>
        <p className="mt-1 text-sm text-white/55">
          My Story lưu lại dấu chân của bạn. Khu vườn là nơi nhìn thấy dấu chân đó đang lớn lên.
        </p>
        <div className="mt-4">
          <LivingGardenCard
            compact
            inputs={{
              reflectionsCount: reflections.length,
              memoriesSaved: capsules.length,
            }}
          />
          <GardenSignalSync
            garden={buildGardenState({
              reflectionsCount: reflections.length,
              memoriesSaved: capsules.length,
            })}
          />
        </div>
      </section>

      <MonthlyLetterCard
        stats={{
          monthLabel: now.toLocaleDateString("vi-VN", { month: "long" }),
          reflectionCount: thisMonthReflections.length,
          capsuleCount: thisMonthCapsules.length,
          hasAnyHistory: reflections.length > 0 || capsules.length > 0,
        }}
      />

      <section>
        <h2 className="text-lg font-bold text-white">Dòng thời gian của bạn</h2>
        <div className="mt-4 space-y-3">
          {!storageReady && (
            <GemCard>
              <p className="text-sm text-white/65">
                Khu vực lưu ký ức đang được chuẩn bị. Bạn vẫn có thể xem hành trình của mình.
              </p>
            </GemCard>
          )}
          <MyStoryTimeline moments={moments} />
        </div>
      </section>
    </div>
  );
}
