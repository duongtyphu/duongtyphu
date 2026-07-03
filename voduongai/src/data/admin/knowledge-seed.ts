/**
 * Companion Studio™ — Admin authoring surface cho Knowledge Seed.
 * Đây là dữ liệu Admin nhập/AI sinh ra để duyệt & xuất bản — tách biệt với
 * seed data tĩnh dùng để render Portal ở `src/features/knowledge/data/`.
 * Field phẳng (không nested) để tương thích với CrudPage/FieldConfig.
 */

export type AdminKnowledgeSeed = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  goal: string[];
  persona: string[];
  problem: string;
  coreIdea: string;
  process: string;
  samplePrompt: string;
  beforeAfterExample: string;
  commonMistakes: string[];
  checklist: string[];
  caseStudy: string;
  exercise: string;
  reflectionQuestions: string[];
  companionNote: string;
  nextStep: string;
  tags: string[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTime: string;
  status: "Draft" | "Published" | "Hidden";
};

export const knowledgeSeedAdminSeed: AdminKnowledgeSeed[] = [];
