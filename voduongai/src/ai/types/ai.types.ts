/**
 * Companion Studio™ — AI Service Layer
 * Kiểu dữ liệu dùng chung cho toàn bộ Agent/Prompt/Service.
 *
 * Nguyên tắc: Founder chỉ nhập ý tưởng, Companion sinh nội dung, Founder
 * review trước khi publish. Không có content nào được publish thẳng từ AI.
 */

export type CompanionAgentKind =
  | "knowledge"
  | "blog"
  | "academy"
  | "project"
  | "community"
  | "premium"
  | "faq"
  | "prompt"
  | "checklist"
  | "template"
  | "sop"
  | "case_study";

/** Input tối thiểu Founder cần nhập — không bắt điền metadata dài. */
export type CompanionGenerateInput = {
  kind: CompanionAgentKind;
  title: string;
  brief?: string;
  collection?: string;
};

/** Quick action áp dụng lên nội dung đã sinh — dùng chung 1 service. */
export type CompanionQuickAction =
  | "rewrite"
  | "shorten"
  | "more_professional"
  | "add_example"
  | "add_checklist"
  | "add_prompt"
  | "add_reflection"
  | "generate_seo"
  | "generate_slug";

export type CompanionRefineInput = {
  kind: CompanionAgentKind;
  action: CompanionQuickAction;
  content: string;
};

/**
 * Nội dung Golden Seed đầy đủ cho Knowledge Seed — theo Companion Content
 * Standard. Các agent khác trả về subset phù hợp với loại nội dung.
 */
export type GeneratedKnowledgeSeed = {
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
};

export type GeneratedGenericContent = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type CompanionGenerateResult<T = GeneratedGenericContent | GeneratedKnowledgeSeed> = {
  ok: true;
  mocked: boolean;
  data: T;
} | {
  ok: false;
  error: string;
};
