import { getSupabaseServer } from "@/lib/supabase-server";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { CompanionPresenceBand } from "@/components/portal/gem-home/CompanionPresenceBand";
import { CompanionThoughtLine } from "@/components/portal/gem-home/CompanionThoughtLine";
import { PillarEntranceCard } from "@/components/portal/gem-home/PillarEntranceCard";
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
    <div className="relative overflow-hidden rounded-3xl">
      {/* Global Visual Update — khí quyển riêng của Home ("Warm welcome"),
       * thay cho nền caro chung trước đây. */}
      <div className="home-atmosphere-bg" aria-hidden />

      <div className="relative z-10 p-6 md:p-8 space-y-10">
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

      {/* 7 Pillar Entrance Card — điểm đến sống, không phải menu */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <PillarEntranceCard
          icon="brain"
          accent="violet"
          title="Hệ tri thức AI (CKOS)"
          what="Tool, Prompt, Quy trình và Bài học được kết nối với nhau — không phải một thư viện tĩnh để lướt qua."
          href="/portal/ckos"
          startedMode="module"
          module="ckos"
          companionLine="Thử tìm một Tool hoặc Prompt cho đúng việc bạn đang làm hôm nay."
          ctaLabel="Mở Hệ tri thức AI (CKOS)"
        />
        <PillarEntranceCard
          icon="graduation-cap"
          accent="blue"
          title="Học viện AI"
          what="Biến tri thức thành năng lực qua thực hành thật — không phải một danh sách bài học để đọc hết."
          href="/portal/hocvienai"
          startedMode="module"
          module="academy"
          companionLine="Chọn một hành trình, làm đúng một bước hôm nay, rồi dừng lại."
          ctaLabel="Vào Học viện"
        />
        <PillarEntranceCard
          icon="cpu"
          accent="slate"
          title="AI Workspace"
          what="Nơi một ý tưởng trở thành một Output thật — bản nháp, kế hoạch, kết quả dùng được ngay."
          href="/portal/aiworkspace"
          startedMode="module"
          module="khong-gian-ai"
          companionLine="Mang theo một việc cụ thể — không cần chuẩn bị gì thêm."
          ctaLabel="Mở AI Workspace"
        />
        <PillarEntranceCard
          icon="line-chart"
          accent="emerald"
          title="Dự án & Cơ hội"
          what="Trung tâm cơ hội giúp bạn quyết định đúng — không phải một trang bán hàng."
          href="/portal/duan-cohoi"
          startedMode="module"
          module="opportunities"
          companionLine="Đọc Tiêu chí chia sẻ trước khi xem bất kỳ dự án nào."
          ctaLabel="Xem Dự án & Cơ hội"
        />
        <PillarEntranceCard
          icon="crown"
          accent="amber"
          title="Premium"
          what="Giai đoạn tiếp theo khi bạn đã sẵn sàng đi xa hơn — không phải một quảng cáo nâng cấp."
          href="/portal/premium"
          startedOverride={premiumStarted}
          companionLine={
            ownedCount === 0
              ? "Học thử miễn phí trước — Premium sẽ vẫn ở đây khi bạn thấy cách làm việc phù hợp."
              : "Chỉ nâng cấp khi thực sự cần nhân bản hoặc chuyển giao cho người khác."
          }
          ctaLabel="Xem Premium"
        />
        <PillarEntranceCard
          icon="compass"
          accent="teal"
          title="Hành trình của tôi"
          what="Nơi nhìn lại những gì thật sự đã xảy ra — không phải điểm số hay % ước lượng."
          href="/portal/hanhtrinhcuatoi"
          startedMode="aggregate"
          companionLine="Ghé qua khi bạn muốn biết mình đã thực sự đi được bao xa, không chỉ đang làm gì hôm nay."
          ctaLabel="Xem hành trình"
        />
        <PillarEntranceCard
          icon="heart-handshake"
          accent="rose"
          title="Companion"
          what="Không phải chatbot — một sự hiện diện, nhớ những gì thật sự đã xảy ra với bạn."
          href="/portal/companion"
          startedMode="recent"
          companionLine="Ghé qua khi bạn cần một khoảng lặng, không chỉ khi cần câu trả lời."
          ctaLabel="Mở Companion"
        />
      </div>

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
  );
}
