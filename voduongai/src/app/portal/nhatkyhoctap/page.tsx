import { getSupabaseServer } from "@/lib/supabase-server";
import { LearningJournalNotebook } from "@/components/portal/journal/LearningJournalNotebook";
import { getLiveJournalChrome, getLiveJournalIntentions } from "@/lib/portal/live-journal";
import type { Reflection } from "@/lib/portal/reflections";

export const metadata = {
  title: "Nhật ký học tập",
  description: "Bản ghi cá nhân về những gì bạn thực sự đã học và tạo ra — không phải nhật ký hoạt động.",
};

/**
 * JOURNEY PLATFORM — Phase P5: Learning Journal Reconstruction.
 * Server component chỉ gom reflections THẬT (Supabase, cùng pattern
 * Mirror/My Story) — toàn bộ cuốn sổ (entries 4 câu hỏi, khoảnh khắc
 * đáng nhớ, tác phẩm, bài học hành vi, ý định học tiếp) giao cho
 * `LearningJournalNotebook` (client — đọc thêm WorkspaceSession/Portfolio/
 * GrowthEvent thật từ localStorage). Xem
 * docs/JOURNEY_PLATFORM_ARCHITECTURE.md mục 7 và 18.6.
 *
 * Product Owner DECISION 1 vẫn có hiệu lực: KHÔNG bài viết Admin/blog
 * nào được render ở trang này — quyền sở hữu bài viết thuộc về Blog AI.
 */
async function getJournalReflections(): Promise<Reflection[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return [];

    const { data: reflectionRows } = await supabase
      .from("reflections")
      .select("id, question, answer, created_at")
      .eq("member_id", user.id)
      .order("created_at", { ascending: false });

    return (reflectionRows ?? []).map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export default async function LearningJournalPage() {
  const [reflections, chrome, intentions] = await Promise.all([
    getJournalReflections(),
    getLiveJournalChrome(),
    getLiveJournalIntentions(),
  ]);
  return <LearningJournalNotebook reflections={reflections} chrome={chrome} intentions={intentions} />;
}
