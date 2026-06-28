import { PortalShell } from "@/components/portal/PortalShell";
import { NotificationTicker } from "@/components/portal/NotificationTicker";
import { OnboardingJourney } from "@/components/portal/OnboardingJourney";
import { FirstFootprintCeremony } from "@/components/portal/FirstFootprintCeremony";
import { ReturnAfterSilenceCeremony } from "@/components/portal/ReturnAfterSilenceCeremony";
import { LifeMomentBubble } from "@/components/portal/companion/LifeMomentBubble";
import { getSupabaseServer } from "@/lib/supabase-server";
import { signalsFromReflections, signalsFromMemoryCapsules, deriveComebackSignals } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones } from "@/lib/portal/growth-map/growth-milestones";
import { detectLifeMoment } from "@/lib/portal/life-moments/life-moment-detector";
import type { LifeMoment } from "@/lib/portal/life-moments/life-moments";
import { buildLifeProfile, resolveSharedBirthday } from "@/lib/portal/life-profile/life-profile";
import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule, MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";
import type { ThoughtContext } from "@/lib/portal/companion/daily-thought-source";

async function getCurrentUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email) return null;
  return { email: data.user.email, fullName: data.user.user_metadata?.full_name as string | undefined };
}

async function getReturnAfterSilenceMilestone(): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return null;

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

    const baseSignals = [...signalsFromReflections(reflections), ...signalsFromMemoryCapsules(capsules)];
    const allSignals = [...baseSignals, ...deriveComebackSignals(baseSignals)];
    const milestone = detectGrowthMilestones(allSignals).find((m) => m.id === "return-after-silence");
    return milestone?.occurredAt ?? null;
  } catch {
    return null;
  }
}

async function getLifeMoment(returnAfterSilenceMilestone: string | null): Promise<LifeMoment | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return null;

    const [{ data: memberRow }, { count: capsuleCount }] = await Promise.all([
      supabase.from("members").select("created_at, date_of_birth, date_of_birth_hidden").eq("id", user.id).single(),
      supabase.from("memory_capsules").select("id", { count: "exact", head: true }).eq("member_id", user.id),
    ]);
    if (!memberRow?.created_at) return null;

    const lifeProfile = buildLifeProfile({
      dateOfBirth: memberRow.date_of_birth ?? null,
      dateOfBirthHidden: memberRow.date_of_birth_hidden ?? false,
    });

    return detectLifeMoment({
      memberCreatedAt: memberRow.created_at,
      birthday: resolveSharedBirthday(lifeProfile),
      savedStoryCount: capsuleCount ?? 0,
      returnAfterSilenceOccurredAt: returnAfterSilenceMilestone,
      now: new Date().toISOString(),
    });
  } catch {
    return null;
  }
}

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, returnAfterSilenceMilestone] = await Promise.all([
    getCurrentUser(),
    getReturnAfterSilenceMilestone(),
  ]);
  const lifeMoment = await getLifeMoment(returnAfterSilenceMilestone);

  // Sprint 18.5 — The Daily Thought: tái dùng tín hiệu đã có sẵn ở trên
  // (không query lại DB) để dựng `ThoughtContext` cho Thought Selector.
  const dailyThoughtContext: ThoughtContext = {
    isBirthday: lifeMoment?.type === "birthday",
    isReturnAfterSilence: lifeMoment?.type === "return_after_silence" || !!returnAfterSilenceMilestone,
    isAnnualMirror: lifeMoment?.type === "annual_mirror",
    isOriginMoment: lifeMoment?.type === "first_portal_day",
    hasNewCompanionChapter: lifeMoment?.type === "companion_new_chapter",
  };

  return (
    <PortalShell user={user} dailyThoughtContext={dailyThoughtContext}>
      <NotificationTicker />
      <FirstFootprintCeremony />
      <ReturnAfterSilenceCeremony milestoneOccurredAt={returnAfterSilenceMilestone} />
      <LifeMomentBubble moment={lifeMoment} />
      <OnboardingJourney />
      {children}
    </PortalShell>
  );
}
