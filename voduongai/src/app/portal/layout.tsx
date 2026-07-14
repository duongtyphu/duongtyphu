import { PortalShell } from "@/components/portal/PortalShell";
import { OnboardingJourney } from "@/components/portal/OnboardingJourney";
import { FirstFootprintCeremony } from "@/components/portal/FirstFootprintCeremony";
import { getOriginLineFromCoreMemory } from "@/lib/portal/companion/core-memory";
import { getOriginLineContextDefinition } from "@/lib/portal/companion/origin-line-context";
import { getSupabaseServer } from "@/lib/supabase-server";
import { signalsFromReflections, signalsFromMemoryCapsules, deriveComebackSignals } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones } from "@/lib/portal/growth-map/growth-milestones";
import { detectLifeMoment } from "@/lib/portal/life-moments/life-moment-detector";
import type { LifeMoment } from "@/lib/portal/life-moments/life-moments";
import { buildLifeProfile, resolveSharedBirthday } from "@/lib/portal/life-profile/life-profile";
import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule, MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";
import type { ThoughtContext } from "@/lib/portal/companion/daily-thought-source";

type PortalUser = { email: string; fullName?: string } | null;

type PortalLayoutData = {
  user: PortalUser;
  returnAfterSilenceMilestone: string | null;
  lifeMoment: LifeMoment | null;
};

const EMPTY_LAYOUT_DATA: PortalLayoutData = { user: null, returnAfterSilenceMilestone: null, lifeMoment: null };

/**
 * Gom toàn bộ dữ liệu layout Portal cần vào ĐÚNG MỘT round-trip
 * `auth.getUser()` và chạy song song mọi query phụ thuộc user — trước
 * đây có 3 lệnh `auth.getUser()` riêng lẻ (mỗi hàm gọi lại) và bước
 * query life-moment chạy nối tiếp sau bước reflections/memory_capsules
 * thay vì song song. Giảm số round-trip Supabase mỗi lần layout này
 * chạy (mọi lần vào Portal lần đầu, và mọi lần full-page reload dự
 * phòng khi Next.js router bị treo — xem PortalNavigationGuard).
 */
async function getPortalLayoutData(): Promise<PortalLayoutData> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return EMPTY_LAYOUT_DATA;
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const authUser = userData.user;
  if (!authUser) return EMPTY_LAYOUT_DATA;

  const user: PortalUser = authUser.email
    ? { email: authUser.email, fullName: authUser.user_metadata?.full_name as string | undefined }
    : null;

  try {
    const [{ data: reflectionRows }, { data: capsuleRows }, { data: memberRow }, { count: capsuleCount }] =
      await Promise.all([
        supabase
          .from("reflections")
          .select("id, question, answer, created_at")
          .eq("member_id", authUser.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("memory_capsules")
          .select("id, kind, title, description, occurred_at, source")
          .eq("member_id", authUser.id)
          .order("occurred_at", { ascending: false }),
        supabase.from("members").select("created_at, date_of_birth, date_of_birth_hidden").eq("id", authUser.id).single(),
        supabase.from("memory_capsules").select("id", { count: "exact", head: true }).eq("member_id", authUser.id),
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
    const returnAfterSilenceMilestone =
      detectGrowthMilestones(allSignals).find((m) => m.id === "return-after-silence")?.occurredAt ?? null;

    let lifeMoment: LifeMoment | null = null;
    if (memberRow?.created_at) {
      const lifeProfile = buildLifeProfile({
        dateOfBirth: memberRow.date_of_birth ?? null,
        dateOfBirthHidden: memberRow.date_of_birth_hidden ?? false,
      });
      lifeMoment = detectLifeMoment({
        memberCreatedAt: memberRow.created_at,
        birthday: resolveSharedBirthday(lifeProfile),
        savedStoryCount: capsuleCount ?? 0,
        returnAfterSilenceOccurredAt: returnAfterSilenceMilestone,
        now: new Date().toISOString(),
      });
    }

    return { user, returnAfterSilenceMilestone, lifeMoment };
  } catch {
    return { user, returnAfterSilenceMilestone: null, lifeMoment: null };
  }
}

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, returnAfterSilenceMilestone, lifeMoment } = await getPortalLayoutData();

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
    <PortalShell
      user={user}
      dailyThoughtContext={dailyThoughtContext}
      lifeMoment={lifeMoment}
      returnAfterSilenceMilestone={returnAfterSilenceMilestone}
    >
      <FirstFootprintCeremony
        originLine={getOriginLineFromCoreMemory(
          getOriginLineContextDefinition("first_footprint_ceremony").coreMemoryContext
        )}
      />
      <OnboardingJourney />
      {children}
    </PortalShell>
  );
}
