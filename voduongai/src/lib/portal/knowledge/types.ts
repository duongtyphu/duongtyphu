/**
 * Portal Knowledge Architecture — Knowledge Object Type System
 * Sprint: Portal Knowledge Architecture
 * Xem: docs/PORTAL_KNOWLEDGE_ARCHITECTURE.md
 *
 * 8 loại Knowledge Object:
 * 1. AiToolObject
 * 2. ResourceObject
 * 3. ArticleObject
 * 4. CourseObject
 * 5. ProjectObject (Project / Opportunity)
 * 6. CommunityObject
 * 7. CompanionKnowledgeObject
 * 8. UserJourneyObject
 *
 * Mỗi Object có:
 * - schema chuẩn
 * - role rõ ràng
 * - i18n-ready (vi bắt buộc, en optional)
 * - companionIndex metadata để Companion đọc hiểu
 */

import type { LocalizedField } from "@/lib/i18n/content-model";
import type { CompanionIndex } from "./companion-index";

// ─────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────

export type PublishStatus = "draft" | "published" | "archived";
export type AccessLevel = "public" | "logged_in" | "premium";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type SeoMeta = {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
};

export type RelatedRef = {
  objectType: KnowledgeObjectType;
  id: string;
  label: string;
  href: string;
};

export type KnowledgeObjectType =
  | "ai_tool"
  | "resource"
  | "article"
  | "course"
  | "project"
  | "community"
  | "companion_knowledge"
  | "user_journey";

// ─────────────────────────────────────────────────────────
// 1. AI Tool Object
// Vai trò: trung tâm công cụ AI trong "Không gian AI"
// Layout: Hero → Overview → Guide → Examples → FAQ → Related
// ─────────────────────────────────────────────────────────

export type AiToolCategory =
  | "chat"
  | "image"
  | "video"
  | "coding"
  | "automation"
  | "audio"
  | "other";

export type AiToolObject = {
  objectType: "ai_tool";
  id: string;
  slug: string;
  status: PublishStatus;

  // General
  name: LocalizedField;
  logo?: string;
  icon?: string;
  shortDescription: LocalizedField;
  category: AiToolCategory;
  website?: string;

  // Guide
  introduction?: LocalizedField;
  useCases?: LocalizedField;
  whenToUse?: LocalizedField;
  advantages?: LocalizedField<string[]>;
  limitations?: LocalizedField<string[]>;
  howToUse?: LocalizedField;

  // Examples
  examples?: Array<{
    title: LocalizedField;
    description: LocalizedField;
    samplePrompt?: string;
  }>;

  // FAQ
  faq?: Array<{ question: LocalizedField; answer: LocalizedField }>;

  // Related
  related?: RelatedRef[];

  seo?: SeoMeta;
  companionIndex?: CompanionIndex;
  createdAt?: string;
  updatedAt?: string;
};

// ─────────────────────────────────────────────────────────
// 2. Resource Object
// Vai trò: kho tài nguyên trong "Thư viện tri thức"
// Layout: Hero → Summary → Content/File → How to Use → Related
// ─────────────────────────────────────────────────────────

export type ResourceType =
  | "prompt"
  | "checklist"
  | "sop"
  | "template"
  | "framework"
  | "pdf"
  | "other";

export type ResourceObject = {
  objectType: "resource";
  id: string;
  slug: string;
  status: PublishStatus;
  access: AccessLevel;

  // General
  name: LocalizedField;
  resourceType: ResourceType;
  thumbnail?: string;
  shortDescription: LocalizedField;
  level: DifficultyLevel;
  topics: string[];

  // Content
  content?: LocalizedField;
  fileUrl?: string;
  fileName?: string;
  howToUse?: LocalizedField;

  // Related
  related?: RelatedRef[];

  seo?: SeoMeta;
  companionIndex?: CompanionIndex;
  createdAt?: string;
  updatedAt?: string;
};

// ─────────────────────────────────────────────────────────
// 3. Article Object
// Vai trò: kho bài viết trong "Nhật ký học tập"
// Layout: Hero → Summary → Content → Key Takeaways → Resources → Related → CTA
// ─────────────────────────────────────────────────────────

export type ArticleCategory =
  | "ai"
  | "affiliate"
  | "marketing"
  | "business"
  | "mindset"
  | "guide"
  | "other";

export type ArticleObject = {
  objectType: "article";
  id: string;
  slug: string;
  status: PublishStatus;

  // General
  title: LocalizedField;
  thumbnail?: string;
  category: ArticleCategory;
  tags: string[];
  author?: string;
  publishedAt?: string;

  // Content
  summary: LocalizedField;
  content: LocalizedField;
  keyTakeaways?: LocalizedField<string[]>;
  cta?: { label: LocalizedField; href: string };

  // Related
  related?: RelatedRef[];

  seo?: SeoMeta;
  companionIndex?: CompanionIndex;
  createdAt?: string;
  updatedAt?: string;
};

// ─────────────────────────────────────────────────────────
// 4. Course Object
// Vai trò: khóa học trong "Học viện"
// Layout: Hero → Who It's For → Outcomes → Curriculum → Instructor → FAQ → CTA
// ─────────────────────────────────────────────────────────

export type CourseObject = {
  objectType: "course";
  id: string;
  slug: string;
  status: PublishStatus;

  // General
  name: LocalizedField;
  thumbnail?: string;
  banner?: string;
  shortDescription: LocalizedField;
  level: DifficultyLevel;

  // Introduction
  targetAudience?: LocalizedField;
  outcomes?: LocalizedField<string[]>;
  expectedResults?: LocalizedField;

  // Curriculum
  modules?: Array<{
    title: LocalizedField;
    lessons: Array<{ title: LocalizedField; durationMinutes?: number }>;
  }>;

  // Instructor
  instructor?: {
    name: string;
    bio?: LocalizedField;
    avatar?: string;
  };

  // FAQ
  faq?: Array<{ question: LocalizedField; answer: LocalizedField }>;

  // CTA
  enrollUrl?: string;
  contactUrl?: string;
  price?: number;
  currency?: string;

  // Related
  related?: RelatedRef[];

  seo?: SeoMeta;
  companionIndex?: CompanionIndex;
  createdAt?: string;
  updatedAt?: string;
};

// ─────────────────────────────────────────────────────────
// 5. Project / Opportunity Object
// Vai trò: Research Center trong "Dự án & Cơ hội"
// Layout: Hero → Introduction → Ecosystem → Products → Resources → FAQ → Articles → Opportunity → Links → CTA
// ─────────────────────────────────────────────────────────

export type ProjectObject = {
  objectType: "project";
  id: string;
  slug: string;
  status: PublishStatus;

  // General
  name: LocalizedField;
  logo?: string;
  banner?: string;
  primaryColor?: string;
  officialWebsite?: string;
  disclaimer?: LocalizedField;

  // Introduction
  whatItIs: LocalizedField;
  problemSolved?: LocalizedField;
  vision?: LocalizedField;
  value?: LocalizedField;
  highlights?: LocalizedField<string[]>;

  // Ecosystem
  ecosystemComponents?: Array<{
    name: LocalizedField;
    description: LocalizedField;
    logo?: string;
    href?: string;
  }>;

  // Products / Sub-projects
  products?: Array<{
    name: LocalizedField;
    description: LocalizedField;
    status: PublishStatus;
    href?: string;
  }>;

  // Resources
  resources?: Array<{
    label: LocalizedField;
    type: "pdf" | "video" | "roadmap" | "whitepaper" | "doc" | "link";
    url: string;
  }>;

  // FAQ
  faq?: Array<{ question: LocalizedField; answer: LocalizedField }>;

  // Articles (linked by id)
  articleIds?: string[];

  // Opportunity
  opportunity?: {
    description: LocalizedField;
    conditions?: LocalizedField;
    risks?: LocalizedField;
    affiliateUrl?: string;
    cta?: { label: LocalizedField; href: string };
  };

  // Links
  links?: {
    website?: string;
    telegram?: string;
    facebook?: string;
    youtube?: string;
    discord?: string;
    github?: string;
  };

  seo?: SeoMeta;
  companionIndex?: CompanionIndex;
  createdAt?: string;
  updatedAt?: string;
};

// ─────────────────────────────────────────────────────────
// 6. Community Object
// Vai trò: kết nối người dùng trong "Cộng đồng"
// Layout: Hero → Introduction → Groups → Events → Rules → FAQ → Join
// ─────────────────────────────────────────────────────────

export type CommunityObject = {
  objectType: "community";
  id: string;
  slug: string;
  status: PublishStatus;

  // General
  name: LocalizedField;
  description: LocalizedField;
  platform: "facebook" | "zalo" | "discord" | "telegram" | "other";
  joinUrl: string;

  // Introduction
  targetAudience?: LocalizedField;
  benefits?: LocalizedField<string[]>;

  // Rules
  rules?: LocalizedField<string[]>;
  howToJoin?: LocalizedField;

  // Events
  events?: Array<{
    title: LocalizedField;
    type: "webinar" | "offline" | "online" | "other";
    date?: string;
    url?: string;
  }>;

  // FAQ
  faq?: Array<{ question: LocalizedField; answer: LocalizedField }>;

  seo?: SeoMeta;
  companionIndex?: CompanionIndex;
  createdAt?: string;
  updatedAt?: string;
};

// ─────────────────────────────────────────────────────────
// 7. Companion Knowledge Object
// Vai trò: ngôi nhà tri thức của Companion
// Layout: Hero → Table of Contents → Philosophy → Genome → Methods → Journey → Thoughts → Legacy
// ─────────────────────────────────────────────────────────

export type CompanionKnowledgeSection =
  | "who_is_companion"
  | "philosophy"
  | "purpose"
  | "doctrine"
  | "genome"
  | "genome_council"
  | "methods"
  | "civilization_laws"
  | "journey"
  | "thoughts"
  | "book_notes"
  | "legacy_seeds"
  | "language_constitution";

export type CompanionKnowledgeObject = {
  objectType: "companion_knowledge";
  id: string;
  section: CompanionKnowledgeSection;
  title: LocalizedField;
  summary: LocalizedField;
  content: LocalizedField;
  docPath?: string; // path to source .md file
  related?: RelatedRef[];
  companionIndex?: CompanionIndex;
  lastUpdated?: string;
};

// ─────────────────────────────────────────────────────────
// 8. User Journey Object
// Vai trò: không gian cá nhân trong "Hành trình của tôi"
// ─────────────────────────────────────────────────────────

export type UserJourneyObject = {
  objectType: "user_journey";
  memberId: string;
  profile?: {
    fullName?: string;
    dateOfBirth?: string;
    goals?: string[];
  };
  savedItems?: RelatedRef[];
  readArticles?: string[];
  watchedProjects?: string[];
  legacySeeds?: Array<{ type: string; note?: string; date: string }>;
  learningHistory?: Array<{ objectId: string; objectType: KnowledgeObjectType; completedAt: string }>;
};

// ─────────────────────────────────────────────────────────
// Union type
// ─────────────────────────────────────────────────────────

export type KnowledgeObject =
  | AiToolObject
  | ResourceObject
  | ArticleObject
  | CourseObject
  | ProjectObject
  | CommunityObject
  | CompanionKnowledgeObject
  | UserJourneyObject;
