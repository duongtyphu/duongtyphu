import { PortalShell } from "@/components/portal/PortalShell";
import { NotificationTicker } from "@/components/portal/NotificationTicker";
import { OnboardingJourney } from "@/components/portal/OnboardingJourney";
import { FirstFootprintCeremony } from "@/components/portal/FirstFootprintCeremony";
import { ReturnAfterSilenceCeremony } from "@/components/portal/ReturnAfterSilenceCeremony";
import { getSupabaseServer } from "@/lib/supabase-server";
import { signalsFromReflections, signalsFromMemoryCapsules, deriveComebackSignals } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones } from "@/lib/portal/growth-map/growth-milestones";
import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule, MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";

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

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, returnAfterSilenceMilestone] = await Promise.all([
    getCurrentUser(),
    getReturnAfterSilenceMilestone(),
  ]);

  return (
    <PortalShell user={user}>
      <NotificationTicker />
      <FirstFootprintCeremony />
      <ReturnAfterSilenceCeremony milestoneOccurredAt={returnAfterSilenceMilestone} />
      <OnboardingJourney />
      {children}
    </PortalShell>
  );
}
