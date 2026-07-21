import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { KnowledgeSeed, KnowledgeSeedStep } from "@/features/knowledge/types/knowledge-seed.types";
import type { KnowledgeCollection } from "@/features/knowledge/types/knowledge-collection.types";

/**
 * Nguồn thật cho phần hiển thị 11 Lesson + Thư viện AI (2 Collection) ở
 * /portal/hetrithucai (bảng Supabase `knowledge_seeds`/`knowledge_collections`,
 * quản lý qua /admin/ckos/lessons + /admin/ckos/knowledge-collections). Thay
 * cho mảng tĩnh knowledgeSeedJourneys/knowledgeCollections (xem @deprecated ở
 * src/features/knowledge/data/knowledge-seed-journeys.ts + knowledge-collections.ts).
 *
 * KHÔNG đụng tới 80 Knowledge Asset (knowledgeSeedData/getPublishedKnowledgeAssets)
 * — ngoài phạm vi lần đổi này, xem CLAUDE.md mục "CKOS — Knowledge Asset (80
 * mục, chưa xử lý)".
 *
 * Dùng getSupabasePublic() (không cookies()) — an toàn gọi cả ở Server lẫn
 * Client Component, đúng lý do đã áp dụng cho live-tools.ts.
 */

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export const getLiveKnowledgeSeeds = cache(async (): Promise<KnowledgeSeed[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("knowledge_seeds")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: String(d.id ?? row.id),
      slug: String(d.slug ?? row.id),
      title: String(d.title ?? ""),
      summary: String(d.summary ?? ""),
      goal: asStringArray(d.goal),
      persona: asStringArray(d.persona),
      difficulty: (d.difficulty as KnowledgeSeed["difficulty"]) ?? "BEGINNER",
      estimatedTime: String(d.estimatedTime ?? ""),
      steps: Array.isArray(d.steps) ? (d.steps as KnowledgeSeedStep[]) : [],
      collectionSlug: String(d.collectionSlug ?? ""),
      relatedSeeds: asStringArray(d.relatedSeeds),
      whatYouWillGain: asStringArray(d.whatYouWillGain),
      problem: String(d.problem ?? ""),
      coreIdea: String(d.coreIdea ?? ""),
      guide: String(d.guide ?? ""),
      samplePrompt: String(d.samplePrompt ?? ""),
      example: String(d.example ?? ""),
      commonMistakes: asStringArray(d.commonMistakes),
      checklist: asStringArray(d.checklist),
      exercise: String(d.exercise ?? ""),
      reflectionQuestions: asStringArray(d.reflectionQuestions),
      companionNote: String(d.companionNote ?? ""),
      nextStep: String(d.nextStep ?? ""),
      subtitle: String(d.subtitle ?? ""),
      skillsGained: asStringArray(d.skillsGained),
      whyMatters: String(d.whyMatters ?? ""),
      guideSteps: asStringArray(d.guideSteps),
      promptTips: asStringArray(d.promptTips),
      promptExampleInput: String(d.promptExampleInput ?? ""),
      promptExampleOutput: String(d.promptExampleOutput ?? ""),
      prompts: asStringArray(d.prompts),
      downloadPack: (d.downloadPack as KnowledgeSeed["downloadPack"]) ?? {
        promptPackLabel: "",
        checklistLabel: "",
        templateLabel: "",
      },
      skills: asStringArray(d.skills),
      aiTools: asStringArray(d.aiTools),
      scenarios: asStringArray(d.scenarios),
      prerequisites: asStringArray(d.prerequisites),
      nextSeeds: asStringArray(d.nextSeeds),
    };
  });
});

export const getLiveKnowledgeCollections = cache(async (): Promise<KnowledgeCollection[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("knowledge_collections")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id,
      // Schema Việc 4 (đơn giản hoá, đã chốt với Founder) chỉ có
      // name/description/seedSlugs — không có field "slug" riêng. `id` của
      // bảng chính là slug thật (đã xác nhận qua execute_sql: "ai-office",
      // "ai-research-presentation", khớp đúng slug ở mảng tĩnh cũ) nên dùng
      // thẳng làm slug để link "/portal/hetrithucai/collection/[slug]" vẫn đúng.
      slug: row.id,
      title: String(d.name ?? ""),
      description: String(d.description ?? ""),
      seedSlugs: asStringArray(d.seedSlugs),
      // Không có trong schema Việc 4 — CollectionCard hiện không đọc field này.
      relatedCollections: [],
    };
  });
});
