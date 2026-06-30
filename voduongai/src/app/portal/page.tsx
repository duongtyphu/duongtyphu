import Link from "next/link";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { vdaiCourses } from "@/data/courses";
import { freeResources } from "@/data/resources";
import { affiliateResources } from "@/data/affiliate";
import { getSupabaseServer } from "@/lib/supabase-server";
import { OnboardingSummary } from "@/components/portal/OnboardingSummary";
import { SavedRecent } from "@/components/portal/SavedRecent";
import { ToolCard } from "@/components/portal/ToolCard";
import { ResourceCard } from "@/components/portal/ResourceCard";
import { GemCard } from "@/components/portal/ui/GemCard";
import { HumanGrowthIndex } from "@/components/portal/ui/HumanGrowthBar";
import { WelcomeHero } from "@/components/portal/gem-home/WelcomeHero";
import { TodayMissionCard } from "@/components/portal/gem-home/TodayMissionCard";
import { ContinueLearningCard } from "@/components/portal/gem-home/ContinueLearningCard";
import { NextBestActionCard } from "@/components/portal/gem-home/NextBestActionCard";
import { ProgressNarrativeCard } from "@/components/portal/gem-home/ProgressNarrativeCard";
import { HumanMomentumCard } from "@/components/portal/gem-home/HumanMomentumCard";
import { RecommendedResources } from "@/components/portal/gem-home/RecommendedResources";
import { LivingGardenCard } from "@/components/portal/living-garden/LivingGardenCard";
import { GardenSignalSync } from "@/components/portal/intelligence/GardenSignalSync";
import { buildGardenState } from "@/lib/portal/living-garden/garden-model";
import { TodayOpportunity } from "@/components/portal/gem-home/TodayOpportunity";
import { LatestUpdates } from "@/components/portal/gem-home/LatestUpdates";
import { todayMissions, recommendedItems, latestUpdates } from "@/data/portal/gem-home";
import { getHumanFlowState } from "@/lib/portal/human-flow";
import { humanMomentumSignals, livingPortalCopy } from "@/data/portal/living-portal";
import { getWelcomeState, getWelcomeMessage, getWarmthLine } from "@/lib/portal/warmth-engine";
import { dominantChallenge } from "@/lib/portal/human-understanding";
import type { Reflection } from "@/lib/portal/reflections";

export const metadata = { title: "Gem Home", description: "Gem Home — nơi bắt đầu hành trình trưởng thành mỗi ngày cùng VO DUONG AI.", robots: { index: false } };

async function getProfileSummary() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  // A Supabase/cookie failure here must not 500 the whole dashboard —
  // fall back to the logged-out view instead.
  try {
    return await fetchProfileSummary();
  } catch {
    return null;
  }
}

async function fetchProfileSummary() {
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user?.email) return null;

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("member_email", user.email)
    .eq("status", "confirmed");

  return {
    email: user.email,
    fullName: user.user_metadata?.full_name as string | undefined,
    memberSince: new Date(user.created_at),
    lastSignInAt: user.last_sign_in_at ? new Date(user.last_sign_in_at) : undefined,
    purchasedCount: count ?? 0,
  };
}

async function getRecentReflections(): Promise<Reflection[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return [];
    const { data, error } = await supabase
      .from("reflections")
      .select("id, question, answer, created_at")
      .eq("member_id", user.id)
      .order("created_at", { ascending: false })
      .limit(60);
    if (error || !data) return [];
    return data.map((r) => ({ id: r.id, question: r.question, answer: r.answer, createdAt: r.created_at }));
  } catch {
    return [];
  }
}

async function getFeaturedTools(): Promise<AdminTool[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return toolsAdminSeed.filter((t) => t.status === "Published").slice(0, 4);
  }
  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
      .from("tools")
      .select("id, data")
      .eq("status", "Published")
      .order("order", { ascending: true })
      .limit(4);
    if (error || !data) return toolsAdminSeed.filter((t) => t.status === "Published").slice(0, 4);
    return data.map((row) => ({ ...(row.data as AdminTool), id: row.id }));
  } catch {
    return toolsAdminSeed.filter((t) => t.status === "Published").slice(0, 4);
  }
}

export default async function GemHomePage() {
  const profile = await getProfileSummary();
  const featuredTools = await getFeaturedTools();

  const continueLearningCourse = vdaiCourses[0];
  const recentReflections = await getRecentReflections();
  const flow = getHumanFlowState("knowledge", dominantChallenge(recentReflections));
  const welcomeState = getWelcomeState({ createdAt: profile?.memberSince, lastSignInAt: profile?.lastSignInAt });
  const welcomeMessage = getWelcomeMessage(welcomeState);
  const reflectionPrompt = getWarmthLine("reflection");
  const opportunityItems = affiliateResources.slice(0, 3).map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    href: "/portal/affiliate-hub",
  }));

  return (
    <div className="space-y-10">
      <WelcomeHero
        name={profile?.fullName}
        welcomeMessage={welcomeMessage}
        reflectionPrompt={reflectionPrompt}
        state={welcomeState}
      />

      <div className="mt-1">
        <OnboardingSummary />
      </div>

      <NextBestActionCard flow={flow} />

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <TodayMissionCard missions={todayMissions} />
        </div>
        <div className="lg:col-span-5">
          <HumanMomentumCard signals={humanMomentumSignals} closing={livingPortalCopy.momentumClosing} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <GemCard variant="progress">
            <h2 className="mb-4 text-sm font-bold text-gray-900">Human Growth Index</h2>
            <HumanGrowthIndex />
          </GemCard>
        </div>
        <div className="lg:col-span-5">
          <ProgressNarrativeCard flow={flow} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-12">
          {continueLearningCourse && (
            <ContinueLearningCard
              item={{
                title: continueLearningCourse.title,
                description: continueLearningCourse.description,
                href: continueLearningCourse.href,
                progressPercent: 30,
              }}
            />
          )}
        </div>
      </div>

      <LivingGardenCard
        inputs={{
          reflectionsCount: recentReflections.length,
        }}
      />
      <GardenSignalSync
        garden={buildGardenState({ reflectionsCount: recentReflections.length })}
      />

      <RecommendedResources items={recommendedItems} />

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-gray-900">Công cụ nổi bật</h2>
          <Link href="/portal/tools" className="text-sm font-semibold text-blue-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {featuredTools.map((t) => (
            <ToolCard
              key={t.id}
              id={t.id}
              href={`/portal/tools/${t.slug}`}
              name={t.name}
              description={t.shortDescription}
              pricing={t.pricing}
              iUseThis={t.badge === "Tôi đang dùng"}
            />
          ))}
        </div>
      </section>

      <TodayOpportunity items={opportunityItems} />

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-gray-900">Tài nguyên mới nhất</h2>
          <Link href="/portal/resources" className="text-sm font-semibold text-blue-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {freeResources.slice(0, 3).map((r) => (
            <ResourceCard key={r.id} title={r.title} type={r.type} href={`/portal/resources/${r.id}`} />
          ))}
        </div>
      </section>

      <LatestUpdates updates={latestUpdates} />

      <SavedRecent />
    </div>
  );
}
