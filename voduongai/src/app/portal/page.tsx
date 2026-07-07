import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { affiliateResources } from "@/data/affiliate";
import { getSupabaseServer } from "@/lib/supabase-server";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { Button } from "@/components/portal/ui/Button";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { CompanionPresenceBand } from "@/components/portal/gem-home/CompanionPresenceBand";
import { GardenWidget } from "@/components/portal/garden/GardenWidget";
import { GrowthActivityPanel } from "@/components/portal/growth/GrowthActivityPanel";
import { getHumanFlowState } from "@/lib/portal/human-flow";
import { getWelcomeState, getWelcomeMessage, getWarmthLine } from "@/lib/portal/warmth-engine";
import { dominantChallenge } from "@/lib/portal/human-understanding";
import type { Reflection } from "@/lib/portal/reflections";

export const metadata = { title: "Gem Home", description: "Gem Home — nơi bắt đầu hành trình trưởng thành mỗi ngày cùng VO DUONG AI.", robots: { index: false } };

/**
 * PORTAL_4_FINAL_PRODUCT_DESIGN.md — mục 1 (Home), Phase 1 implementation.
 * Frozen spec: Home có ĐÚNG 5 khối, không hơn:
 *   1. Companion Presence Band (chiếm ưu thế tuyệt đối)
 *   2. Đang dang dở | Cơ hội hôm nay (2 cột cân bằng)
 *   3. Tri thức đáng chú ý hôm nay (CKOS teaser, 2-3 card)
 *   4. Trưởng thành gần đây (1 số liệu thật)
 *   5. Quick Actions
 * + 1 khối thoát luôn có ở cuối (Knowledge Journey Strip) — không tính vào 5.
 * Đã xoá toàn bộ section thừa từ Portal 3.0 (Human Growth Index, Recommended
 * Resources, "Công cụ nổi bật" riêng, "Tài nguyên mới nhất", Premium preview,
 * Saved Recent, GardenSignalSync) — nội dung có giá trị thật trong số đó
 * (nếu có) thuộc về đúng pillar của nó (CKOS/Premium/Journey), không phải Home.
 */

async function getProfileSummary() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
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
    return toolsAdminSeed.filter((t) => t.status === "Published").slice(0, 3);
  }
  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
      .from("tools")
      .select("id, data")
      .eq("status", "Published")
      .order("order", { ascending: true })
      .limit(3);
    if (error || !data) return toolsAdminSeed.filter((t) => t.status === "Published").slice(0, 3);
    return data.map((row) => ({ ...(row.data as AdminTool), id: row.id }));
  } catch {
    return toolsAdminSeed.filter((t) => t.status === "Published").slice(0, 3);
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
  const opportunity = affiliateResources[0];

  return (
    <div className="space-y-10">
      {/* Khối 1 — Companion Presence Band */}
      <CompanionPresenceBand
        name={profile?.fullName}
        welcomeMessage={welcomeMessage}
        reflectionPrompt={reflectionPrompt}
        state={welcomeState}
        flow={flow}
      />

      {/* Khối 2 — Đang dang dở | Cơ hội hôm nay */}
      <div className="grid gap-5 lg:grid-cols-2">
        <GrowthActivityPanel variant="journey" />
        {opportunity && (
          <GemCard>
            <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">
              Cơ hội hôm nay
            </p>
            <h3 className="gemos-card-title mt-2 text-sm font-bold text-gray-900">{opportunity.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{opportunity.description}</p>
            <Button href="/portal/duan-cohoi" variant="secondary" className="mt-3">
              Xem cơ hội
            </Button>
          </GemCard>
        )}
      </div>

      {/* Khối 3 — Tri thức đáng chú ý hôm nay (CKOS teaser) */}
      <section>
        <SectionHeader
          eyebrow="CKOS"
          title="Tri thức đáng chú ý hôm nay"
          action={
            <Button href="/portal/ckos" variant="secondary">
              Mở CKOS →
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((t) => (
            <GemCard key={t.id}>
              <p className="gemos-card-title text-sm font-bold text-gray-900">{t.name}</p>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">{t.shortDescription}</p>
              <Button href={`/portal/tools/${t.slug}`} variant="secondary" className="mt-3">
                Xem
              </Button>
            </GemCard>
          ))}
        </div>
      </section>

      {/* Khối 4 — Trưởng thành gần đây */}
      <GardenWidget />

      {/* Khối 5 — Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button href="/portal/ckos" variant="secondary">Mở CKOS</Button>
        <Button href="/portal/hocvienai" variant="secondary">Vào Học viện</Button>
        <Button href="/portal/workspace" variant="secondary">Mở Workspace</Button>
        <Button href="/portal/duan-cohoi" variant="secondary">Cơ hội hôm nay</Button>
        <Button href="/portal/premium" variant="secondary">Xem Premium</Button>
      </div>

      {/* Khối thoát — luôn có, không tính vào 5 khối chính */}
      <KnowledgeJourneyStrip
        title="Chưa biết bắt đầu từ đâu?"
        steps={[
          { label: "Xem hành trình của bạn", description: "Xem lại chặng đường đã đi và bước tiếp theo.", href: "/portal/hanhtrinhcuatoi" },
          { label: "Kết nối cộng đồng", description: "Chia sẻ và học hỏi cùng những người đang đi cùng hành trình.", href: "/portal/congdongai" },
          { label: "Mở Companion", description: "Để Companion dẫn bạn tới đúng nơi cần đến.", href: "/portal/companion" },
        ]}
      />
    </div>
  );
}
