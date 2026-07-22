import { getSupabaseServer } from "@/lib/supabase-server";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { CompanionPresenceBand } from "@/components/portal/gem-home/CompanionPresenceBand";
import { CompanionThoughtLine } from "@/components/portal/gem-home/CompanionThoughtLine";
import { HomePillarCards } from "@/components/portal/gem-home/HomePillarCards";
import { getLiveHomeCards } from "@/lib/portal/live-home-cards";
import { getHumanFlowState } from "@/lib/portal/human-flow";
import { getWelcomeState, getWelcomeMessage, getWarmthLine } from "@/lib/portal/warmth-engine";
import { dominantChallenge } from "@/lib/portal/human-understanding";
import type { Reflection } from "@/lib/portal/reflections";

export const metadata = { title: "Gem Home", description: "Gem Home — nơi bắt đầu hành trình trưởng thành mỗi ngày cùng VO DUONG AI.", robots: { index: false } };

/**
 * Portal 4.0 Final Reconstruction — Home Reconstruction.
 *
 * Home không còn là dashboard 5-khối (Phase 1) — Home là Reception Hall:
 * sau lời chào của Companion (Companion Presence Band, giữ nguyên, đã
 * duyệt), Home giới thiệu ĐỦ 7 pillar dưới dạng "điểm đến sống"
 * (PillarEntranceCard), mỗi thẻ tự trả lời what/why/đã làm gì/Companion
 * gợi ý gì/dẫn tới đâu — không phải menu, không phải widget dashboard.
 *
 * "Đã làm gì" của mỗi pillar đọc thật (growth-view.ts theo module, hoặc
 * ownedCount thật từ Supabase cho Premium) — không suy diễn, không % giả.
 * Khối "Tri thức đáng chú ý hôm nay"/"Cơ hội hôm nay"/Garden riêng/Quick
 * Actions của Phase 1 bị gộp vào: nội dung giá trị của chúng giờ nằm bên
 * trong đúng thẻ pillar tương ứng (CKOS/Projects/Journey), không lặp lại
 * ở Home nữa — giảm rợp mắt, tăng cảm giác "một sảnh đón tiếp", không
 * phải "nhiều widget xếp chồng".
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

export default async function GemHomePage() {
  const profile = await getProfileSummary();
  const recentReflections = await getRecentReflections();
  const homeCards = await getLiveHomeCards();
  const flow = getHumanFlowState("knowledge", dominantChallenge(recentReflections));
  const welcomeState = getWelcomeState({ createdAt: profile?.memberSince, lastSignInAt: profile?.lastSignInAt });
  const welcomeMessage = getWelcomeMessage(welcomeState);
  const reflectionPrompt = getWarmthLine("reflection");

  const ownedCount = profile?.purchasedCount ?? 0;
  const premiumStarted =
    ownedCount === 0
      ? "Bạn chưa sở hữu sản phẩm Premium nào."
      : `Bạn đã sở hữu ${ownedCount} sản phẩm Premium.`;

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      {/* Khí quyển riêng của Home ("Warm welcome") kéo full-bleed hết chiều
       * rộng cột nội dung — cùng khuôn với Premium, không còn khung
       * rounded-3xl thu hẹp. */}
      <div className="home-atmosphere-bg" aria-hidden />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — giữ nguyên đúng khoảng cách trước đây (rounded-3xl
       * p-6 md:p-8), chỉ khí quyển nền phía sau mới full-bleed. */}
      <div className="rounded-3xl p-6 md:p-8 space-y-10">
      {/* Companion Presence Band — lời chào, giữ nguyên (đã duyệt) */}
      <CompanionPresenceBand
        name={profile?.fullName}
        welcomeMessage={welcomeMessage}
        reflectionPrompt={reflectionPrompt}
        state={welcomeState}
        flow={flow}
      />

      {/* Emotional Moment — một câu suy ngẫm nhỏ, chỉ một lần mỗi lượt ghé,
       * cùng nguồn Thought Seed thật đã dùng ở /portal/companion. */}
      <CompanionThoughtLine />

      {/* 7 Pillar Entrance Card — điểm đến sống, không phải menu. Đọc thật
       * từ bảng home_cards (nối dây — xem CLAUDE.md mục "Nhóm 3 — Nối dây
       * home_cards"), không còn hardcode JSX. */}
      <HomePillarCards seed={homeCards} ownedCount={ownedCount} premiumStarted={premiumStarted} />

      {/* Khối thoát — luôn có */}
      <KnowledgeJourneyStrip
        title="Chưa biết bắt đầu từ đâu?"
        steps={[
          { label: "Xem hành trình của bạn", description: "Xem lại chặng đường đã đi và bước tiếp theo.", href: "/portal/hanhtrinhcuatoi" },
          { label: "Kết nối cộng đồng", description: "Chia sẻ và học hỏi cùng những người đang đi cùng hành trình.", href: "/portal/congdongai" },
          { label: "Mở Companion", description: "Để Companion dẫn bạn tới đúng nơi cần đến.", href: "/portal/companion" },
        ]}
      />
      </div>
      </div>
    </div>
  );
}
