import { getSupabaseServer } from "@/lib/supabase-server";
import { GardenExperience, type GemMoment } from "@/components/portal/garden/GardenExperience";
import { signalsFromReflections, signalsFromMemoryCapsules } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones } from "@/lib/portal/growth-map/growth-milestones";
import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule, MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";

export const metadata = {
  title: "Khu vườn của bạn",
  description: "Khu vườn sống — nơi trưởng thành thật của bạn hiện thân thành Cây và Viên ngọc.",
  robots: { index: false },
};

/**
 * KHU VƯỜN 2.0 — Journey Phase P2 (GARDEN_VISUAL_DIRECTION.md, PO approved).
 *
 * Server component chỉ làm một việc: gom các KHOẢNH KHẮC THẬT cho Viên
 * ngọc từ Supabase (reflections / memory_capsules / growth-milestones —
 * cùng pattern truy vấn với /portal/mirror) rồi giao toàn bộ trải nghiệm
 * cho `GardenExperience` (client — nơi đọc thêm growth-view localStorage:
 * giai đoạn cây, phần tử vườn, output thật). Không bảng mới, không fake:
 * thiếu nguồn nào thì Viên ngọc hiển thị empty state trung thực.
 */

async function getGemData(): Promise<{ reflections: Reflection[]; capsules: MemoryCapsule[] }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { reflections: [], capsules: [] };
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return { reflections: [], capsules: [] };

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

    return {
      reflections: (reflectionRows ?? []).map((r) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        createdAt: r.created_at,
      })),
      capsules: (capsuleRows ?? []).map((c) => ({
        id: c.id,
        kind: c.kind as MemoryCapsuleKind,
        title: c.title,
        description: c.description ?? undefined,
        occurredAt: c.occurred_at,
        source: c.source ?? undefined,
      })),
    };
  } catch {
    return { reflections: [], capsules: [] };
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function KnowledgeGardenPage() {
  const { reflections, capsules } = await getGemData();
  const signals = [...signalsFromReflections(reflections), ...signalsFromMemoryCapsules(capsules)];
  const milestones = detectGrowthMilestones(signals);

  // Thứ tự ưu tiên khoảnh khắc của Ngọc (GARDEN_VISUAL_DIRECTION.md mục 6):
  // cột mốc → suy ngẫm mới nhất → ký ức Companion gìn giữ. Output thật và
  // tóm tắt nuôi dưỡng được client bổ sung từ growth-view.
  const serverMoments: GemMoment[] = [
    ...milestones.slice(0, 3).map(
      (m): GemMoment => ({
        kind: "milestone",
        label: "Cột mốc",
        title: m.title,
        text: m.line,
        dateLabel: formatDate(m.occurredAt),
      }),
    ),
    ...(reflections[0]
      ? [
          {
            kind: "reflection",
            label: "Suy ngẫm gần nhất",
            title: reflections[0].question,
            text: reflections[0].answer,
            dateLabel: formatDate(reflections[0].createdAt),
          } satisfies GemMoment,
        ]
      : []),
    ...(capsules[0]
      ? [
          {
            kind: "memory",
            label: "Ký ức được gìn giữ",
            title: capsules[0].title,
            text: capsules[0].description ?? "Một khoảnh khắc bạn đã muốn giữ lại — Companion vẫn đang gìn giữ nó.",
            dateLabel: formatDate(capsules[0].occurredAt),
          } satisfies GemMoment,
        ]
      : []),
  ];

  return (
    <GardenExperience
      serverMoments={serverMoments}
      reflectionCount={reflections.length}
      memoryCount={capsules.length}
      milestoneCount={milestones.length}
    />
  );
}
