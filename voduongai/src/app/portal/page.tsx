import Link from "next/link";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { freeResources } from "@/data/resources";
import { affiliateResources } from "@/data/affiliate";
import { getSupabaseServer } from "@/lib/supabase-server";
import { OnboardingSummary } from "@/components/portal/OnboardingSummary";
import { SavedRecent } from "@/components/portal/SavedRecent";
import { ToolCard } from "@/components/portal/ToolCard";
import { ResourceCard } from "@/components/portal/ResourceCard";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { Button } from "@/components/portal/ui/Button";
import { HumanGrowthIndex } from "@/components/portal/ui/HumanGrowthBar";
import { WelcomeHero } from "@/components/portal/gem-home/WelcomeHero";
import { TodayMissionCard } from "@/components/portal/gem-home/TodayMissionCard";
import { NextBestActionCard } from "@/components/portal/gem-home/NextBestActionCard";
import { ProgressNarrativeCard } from "@/components/portal/gem-home/ProgressNarrativeCard";
import { HumanMomentumCard } from "@/components/portal/gem-home/HumanMomentumCard";
import { RecommendedResources } from "@/components/portal/gem-home/RecommendedResources";
import { GardenSignalSync } from "@/components/portal/intelligence/GardenSignalSync";
import { buildGardenState } from "@/lib/portal/living-garden/garden-model";
import { GardenWidget } from "@/components/portal/garden/GardenWidget";
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

      {/* Companion highlight — Companion đồng hành, không phải chatbot rỗng */}
      <GemCard variant="featured" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-brand-blue">
            Companion của bạn
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
            {flow.momentumMessage} Companion đang theo dõi hành trình của bạn và sẵn sàng gợi ý bước tiếp
            theo bất cứ lúc nào.
          </p>
        </div>
        <Button href="/portal/companion" variant="primary" className="shrink-0">
          Mở Companion
        </Button>
      </GemCard>

      <NextBestActionCard flow={flow} />

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <TodayMissionCard missions={todayMissions} />
        </div>
        <div className="lg:col-span-5">
          <HumanMomentumCard signals={humanMomentumSignals} closing={livingPortalCopy.momentumClosing} />
        </div>
      </div>

      {/* Continue Learning — Academy */}
      <section>
        <SectionHeader eyebrow="Academy" title="Tiếp tục học" />
        <GemCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-gray-600">
            {flow.currentStage} — {flow.nextBestAction.toLowerCase()}.
          </p>
          <Button href="/portal/hocvienai" variant="secondary" className="shrink-0">
            Vào Học viện AI
          </Button>
        </GemCard>
      </section>

      {/* CKOS quick access */}
      <section>
        <SectionHeader
          eyebrow="CKOS"
          title="Bộ não tri thức của Companion"
          action={
            <Link href="/portal/ckos" className="text-sm font-semibold text-blue-600 hover:underline">
              Mở CKOS →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GemCard>
            <p className="gemos-card-title text-sm font-bold text-gray-900">Công cụ AI</p>
            <p className="mt-1 text-xs text-gray-500">Danh sách công cụ đã tuyển chọn.</p>
            <Button href="/portal/tools" variant="secondary" className="mt-3">Xem</Button>
          </GemCard>
          <GemCard>
            <p className="gemos-card-title text-sm font-bold text-gray-900">Prompt</p>
            <p className="mt-1 text-xs text-gray-500">Thư viện prompt thực chiến.</p>
            <Button href="/portal/prompts" variant="secondary" className="mt-3">Xem</Button>
          </GemCard>
          <GemCard>
            <p className="gemos-card-title text-sm font-bold text-gray-900">Quy trình & SOP</p>
            <p className="mt-1 text-xs text-gray-500">Checklist, SOP chuẩn hoá.</p>
            <Button href="/portal/sop" variant="secondary" className="mt-3">Xem</Button>
          </GemCard>
          <GemCard>
            <p className="gemos-card-title text-sm font-bold text-gray-900">CKOS đầy đủ</p>
            <p className="mt-1 text-xs text-gray-500">Dashboard, Search, Collections và Danh mục tri thức.</p>
            <Button href="/portal/ckos" variant="secondary" className="mt-3">Xem</Button>
          </GemCard>
        </div>
      </section>

      {/* Journey / Progress preview */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <GemCard variant="progress">
            <h2 className="gemos-card-title mb-4 text-sm font-bold text-gray-900">Human Growth Index</h2>
            <HumanGrowthIndex />
          </GemCard>
        </div>
        <div className="lg:col-span-5">
          <ProgressNarrativeCard flow={flow} />
        </div>
      </div>

      <GardenWidget />
      <GardenSignalSync
        garden={buildGardenState({ reflectionsCount: recentReflections.length })}
      />

      <RecommendedResources items={recommendedItems} />

      <section>
        <SectionHeader
          title="Công cụ nổi bật"
          action={
            <Link href="/portal/tools" className="text-sm font-semibold text-blue-600 hover:underline">
              Xem tất cả →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
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

      {/* Projects & Opportunities preview */}
      <TodayOpportunity items={opportunityItems} />

      <section>
        <SectionHeader
          title="Tài nguyên mới nhất"
          action={
            <Link href="/portal/resources" className="text-sm font-semibold text-blue-600 hover:underline">
              Xem tất cả →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {freeResources.slice(0, 3).map((r) => (
            <ResourceCard key={r.id} title={r.title} type={r.type} href={`/portal/resources/${r.id}`} />
          ))}
        </div>
      </section>

      {/* Premium preview */}
      <section>
        <SectionHeader eyebrow="Premium" title="Đi xa hơn cùng Premium" />
        <GemCard variant="action" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <GemBadge tone="premium" />
            <p className="text-sm leading-relaxed text-gray-600">
              V-Solo, V-Scale và các buổi Masterclass chuyên sâu dành cho thành viên Premium.
            </p>
          </div>
          <Button href="/portal/premium" variant="secondary" className="shrink-0">
            Xem Premium
          </Button>
        </GemCard>
      </section>

      <LatestUpdates updates={latestUpdates} />

      <SavedRecent />
    </div>
  );
}
