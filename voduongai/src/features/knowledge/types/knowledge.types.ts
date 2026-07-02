/**
 * CKOS — Companion Knowledge Operating System
 * EC-001: Knowledge Foundation
 *
 * Toàn bộ nội dung trong "Thư viện tri thức" là KnowledgeAsset — không còn
 * tư duy Blog/Post/Article riêng lẻ. Guide, Prompt, Template, Checklist,
 * SOP, Framework, Case Study... chỉ khác nhau ở field `type`.
 */

export enum KnowledgeType {
  ARTICLE = "ARTICLE",
  GUIDE = "GUIDE",
  PROMPT = "PROMPT",
  CHECKLIST = "CHECKLIST",
  TEMPLATE = "TEMPLATE",
  FRAMEWORK = "FRAMEWORK",
  SOP = "SOP",
  PLAYBOOK = "PLAYBOOK",
  WORKFLOW = "WORKFLOW",
  CASE_STUDY = "CASE_STUDY",
  VIDEO = "VIDEO",
  PDF = "PDF",
  FAQ = "FAQ",
  EXERCISE = "EXERCISE",
  REFLECTION = "REFLECTION",
  ASSESSMENT = "ASSESSMENT",
  CHEATSHEET = "CHEATSHEET",
  MINDMAP = "MINDMAP",
}

export enum KnowledgeStatus {
  DRAFT = "DRAFT",
  REVIEW = "REVIEW",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum Difficulty {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export type KnowledgeLanguage = "vi" | "en";

/** A. Basic Identity */
export type KnowledgeAssetIdentity = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  type: KnowledgeType;
  status: KnowledgeStatus;
  language: KnowledgeLanguage;
  thumbnail?: string;
  cover?: string;
  createdAt: string;
  updatedAt: string;
};

/** B. Knowledge DNA — bối cảnh học tập của Asset */
export type KnowledgeDNA = {
  goal: string[];
  persona: string[];
  difficulty: Difficulty;
  estimatedTime: string;
  learningOutcome: string;
  category: string;
  tags: string[];
  aiTools: string[];
  industry: string[];
  role: string[];
};

/** C. Relationship — liên kết Asset trong CKOS graph */
export type KnowledgeRelationship = {
  prerequisites: string[];
  relatedAssets: string[];
  relatedPrompts: string[];
  relatedTemplates: string[];
  relatedSOPs: string[];
  relatedFrameworks: string[];
  relatedWorkflows: string[];
  relatedCaseStudies: string[];
  nextAsset?: string;
};

/** D. Growth — phần giúp người dùng trưởng thành, không chỉ đọc rồi thôi */
export type KnowledgeGrowth = {
  practice: string;
  challenge?: string;
  reflectionQuestions: string[];
  nextStep: string;
  companionNote?: string;
  wisdom?: string;
};

/** E. System — vận hành nội bộ, admin & xuất bản */
export type KnowledgeSystem = {
  publishedAt?: string;
  reviewCycle?: string;
  author: string;
  knowledgeSteward?: string;
  premium: boolean;
  featured: boolean;
  verified: boolean;
  version: number;
};

export type KnowledgeAsset = KnowledgeAssetIdentity & {
  dna: KnowledgeDNA;
  relationship: KnowledgeRelationship;
  growth: KnowledgeGrowth;
  system: KnowledgeSystem;
};

/** Field bắt buộc để publish một Knowledge Asset — dùng cho validation. */
export const REQUIRED_TO_PUBLISH_FIELDS = [
  "title",
  "slug",
  "type",
  "goal",
  "persona",
  "difficulty",
  "learningOutcome",
  "reflectionQuestions",
  "nextStep",
] as const;

export type RequiredPublishField = (typeof REQUIRED_TO_PUBLISH_FIELDS)[number];

export type KnowledgeValidationError = {
  field: RequiredPublishField | string;
  message: string;
};

export type KnowledgeValidationResult = {
  valid: boolean;
  errors: KnowledgeValidationError[];
};

/** Filter dùng chung cho service layer + Admin sau này. */
export type KnowledgeAssetFilter = {
  type?: KnowledgeType;
  status?: KnowledgeStatus;
  persona?: string;
  goal?: string;
  difficulty?: Difficulty;
  premium?: boolean;
  featured?: boolean;
  category?: string;
};
