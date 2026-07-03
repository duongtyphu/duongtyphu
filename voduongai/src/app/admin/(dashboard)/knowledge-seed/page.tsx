"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { knowledgeSeedAdminSeed, type AdminKnowledgeSeed } from "@/data/admin/knowledge-seed";
import { Badge } from "@/components/admin/ui/Badge";
import type { GeneratedKnowledgeSeed } from "@/ai/types/ai.types";

export default function KnowledgeSeedAdminPage() {
  return (
    <CrudPage<AdminKnowledgeSeed>
      title="Knowledge Seed"
      description="Nhập tiêu đề, để Companion viết giúp toàn bộ Golden Seed — Founder chỉ cần review trước khi xuất bản."
      collectionKey="knowledge-seed"
      seed={knowledgeSeedAdminSeed}
      searchKeys={["title"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Draft", "Published", "Hidden"] }}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "difficulty", label: "Độ khó" },
        { key: "estimatedTime", label: "Thời gian" },
        { key: "status", label: "Trạng thái" },
        {
          key: "_ai",
          label: "",
          render: (it) => (it.problem ? <Badge tone="blue">Companion đã viết</Badge> : <span className="text-white/30">—</span>),
        },
      ]}
      aiAssist={{
        kind: "knowledge",
        briefKey: "summary",
        contentKey: "process",
        applyResult: (data) => {
          const seed = data as GeneratedKnowledgeSeed;
          return {
            slug: seed.slug,
            summary: seed.summary,
            goal: seed.goal,
            persona: seed.persona,
            problem: seed.problem,
            coreIdea: seed.coreIdea,
            process: seed.process,
            samplePrompt: seed.samplePrompt,
            beforeAfterExample: seed.beforeAfterExample,
            commonMistakes: seed.commonMistakes,
            checklist: seed.checklist,
            caseStudy: seed.caseStudy,
            exercise: seed.exercise,
            reflectionQuestions: seed.reflectionQuestions,
            companionNote: seed.companionNote,
            nextStep: seed.nextStep,
            tags: seed.tags,
            difficulty: seed.difficulty,
            estimatedTime: seed.estimatedTime,
          };
        },
      }}
      fields={[
        { key: "title", label: "Tiêu đề", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "summary", label: "Mô tả ngắn / Ý tưởng", type: "textarea", full: true },
        { key: "goal", label: "Mục tiêu", type: "tags", full: true },
        { key: "persona", label: "Phù hợp với ai", type: "tags", full: true },
        { key: "problem", label: "Vấn đề", type: "textarea", full: true },
        { key: "coreIdea", label: "Ý tưởng cốt lõi", type: "textarea", full: true },
        { key: "process", label: "Quy trình", type: "textarea", full: true },
        { key: "samplePrompt", label: "Prompt mẫu", type: "textarea", full: true },
        { key: "beforeAfterExample", label: "Ví dụ trước/sau", type: "textarea", full: true },
        { key: "commonMistakes", label: "Sai lầm thường gặp", type: "tags", full: true },
        { key: "checklist", label: "Checklist", type: "tags", full: true },
        { key: "caseStudy", label: "Case Study", type: "textarea", full: true },
        { key: "exercise", label: "Exercise", type: "textarea", full: true },
        { key: "reflectionQuestions", label: "Reflection", type: "tags", full: true },
        { key: "companionNote", label: "Companion Note", type: "textarea", full: true },
        { key: "nextStep", label: "Next Step", type: "text", full: true },
        { key: "tags", label: "Tags", type: "tags" },
        { key: "difficulty", label: "Độ khó", type: "select", options: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] },
        { key: "estimatedTime", label: "Thời gian ước tính", type: "text" },
        { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"] },
      ]}
    />
  );
}
