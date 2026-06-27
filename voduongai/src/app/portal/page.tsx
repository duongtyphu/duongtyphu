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
import { GemProgressCard } from "@/components/portal/gem-home/GemProgressCard";
import { ContinueLearningCard } from "@/components/portal/gem-home/ContinueLearningCard";
import { AICoachCard } from "@/components/portal/gem-home/AICoachCard";
import { RecommendedResources } from "@/components/portal/gem-home/RecommendedResources";
import { TodayOpportunity } from "@/components/portal/gem-home/TodayOpportunity";
import { LatestUpdates } from "@/components/portal/gem-home/LatestUpdates";
import { todayMissions, aiCoachTip, recommendedItems, latestUpdates } from "@/data/portal/gem-home";

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
    purchasedCount: count ?? 0,
  };
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
  const opportunityItems = affiliateResources.slice(0, 3).map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    href: "/portal/affiliate-hub",
  }));

  return (
    <div className="space-y-10">
      <WelcomeHero name={profile?.fullName} />

      <div className="mt-1">
        <OnboardingSummary />
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <TodayMissionCard missions={todayMissions} />
        </div>
        <div className="lg:col-span-5">
          <GemProgressCard percent={profile ? 42 : 12} />
        </div>
      </div>

      <GemCard variant="progress">
        <h2 className="mb-4 text-sm font-bold text-white">Human Growth Index</h2>
        <HumanGrowthIndex />
      </GemCard>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
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
        <div className="lg:col-span-5">
          <AICoachCard tip={aiCoachTip} />
        </div>
      </div>

      <RecommendedResources items={recommendedItems} />

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Công cụ nổi bật</h2>
          <Link href="/portal/tools" className="text-sm font-semibold text-[#22D3EE] hover:underline">
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
          <h2 className="text-lg font-bold text-white">Tài nguyên mới nhất</h2>
          <Link href="/portal/resources" className="text-sm font-semibold text-[#22D3EE] hover:underline">
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
