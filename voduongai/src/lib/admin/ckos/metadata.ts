/**
 * CKOS Management — shared metadata + lifecycle standard.
 * Canonicalized in ADM-SPR-004 per Founder's explicit "discard legacy,
 * architecture quality over compatibility" mandate — all CKOS modules now
 * share ONE framework (KnowledgeCrudPage), ONE editor (KnowledgeEditor),
 * ONE metadata standard, ONE 6-state lifecycle, ONE relationship model.
 *
 * A module's *underlying storage* can still differ (some are real Supabase
 * tables Portal/CKOS Runtime already read, some are new local-tier
 * collections — see `storage` below) — but the UI, form, editor, lifecycle,
 * and relationship model are identical everywhere. Modules whose existing
 * Supabase table has its own presentation fields (e.g. Tools' `pricing`,
 * `ctaLink`) keep those as `extraFields` on top of the shared standard,
 * via `titleKey`/`summaryKey`/`bodyKey` aliasing — see KnowledgeCrudPage.tsx.
 */

export const KNOWLEDGE_STATUSES = [
  "Draft",
  "In Review",
  "Changes Requested",
  "Approved",
  "Published",
  "Archived",
] as const;

export type KnowledgeStatus = (typeof KNOWLEDGE_STATUSES)[number];

export const KNOWLEDGE_DIFFICULTIES = ["", "Beginner", "Intermediate", "Advanced"] as const;
export type KnowledgeDifficulty = (typeof KNOWLEDGE_DIFFICULTIES)[number];

export type ChangelogEntry = { version: number; date: string; note: string };

/**
 * Base shape every CKOS knowledge item shares — no exceptions (ADM-SPR-004
 * Task 3). Modules may carry additional presentation fields on top (see
 * `extraFields` in KnowledgeCrudPage), but every module's item has at least
 * this shape, always under the same key names.
 */
export type KnowledgeItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty: KnowledgeDifficulty;
  aiTool: string;
  status: KnowledgeStatus;
  version: number;
  author: string;
  reviewer: string;
  publishedDate: string;
  updatedDate: string;
  changelog: ChangelogEntry[];
  /** Relationship Model (Task 5) — ids of related items, format `${moduleKey}:${id}`. */
  relatedIds: string[];
  /** Main content, authored via the shared KnowledgeEditor (markdown). */
  body: string;
};

export function emptyKnowledgeItem(): Omit<KnowledgeItem, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: "",
    slug: "",
    summary: "",
    category: "",
    tags: [],
    difficulty: "",
    aiTool: "",
    status: "Draft",
    version: 1,
    author: "",
    reviewer: "",
    publishedDate: "",
    updatedDate: today,
    changelog: [],
    relatedIds: [],
    body: "",
  };
}

export type KnowledgeModuleKey =
  | "goals"
  | "tools"
  | "prompts"
  | "workflows"
  | "evaluations"
  | "resources"
  | "templates"
  | "ebooks"
  | "checklists"
  | "sop"
  | "case-studies"
  | "best-practices"
  | "faqs";

export type KnowledgeModuleDef = {
  key: KnowledgeModuleKey;
  label: string;
  /** `useCollection()` key. */
  collectionKey: string;
  route: string;
  description: string;
  /** Underlying field name for the canonical Title, if different from `title` (preserves what Portal/Runtime already read). */
  titleKey?: string;
  summaryKey?: string;
  bodyKey?: string;
  /**
   * "supabase" = real Supabase table, persisted immediately.
   * "local" = per-browser localStorage tier (useCollection()'s established
   * fallback for any key not yet in SUPABASE_COLLECTIONS) — these modules
   * had no existing table; wiring them to a real one later is a one-line
   * allowlist change, no UI change needed (see §9 Runtime Readiness).
   */
  storage: "supabase" | "local";
  /** True if this module belongs to the Resources family (5 sibling collections sharing one concept). */
  resourceFamily?: boolean;
};

export const KNOWLEDGE_MODULES: KnowledgeModuleDef[] = [
  {
    key: "goals",
    label: "Goals",
    collectionKey: "ckos-goals",
    route: "/admin/ckos/goals",
    description: "Khung mục tiêu/khuôn mẫu tư duy tái sử dụng được trong CKOS — khác với Portal Builder → Mục tiêu người dùng (user_goals), vốn là mục tiêu cá nhân của từng học viên, không phải tri thức dùng chung.",
    storage: "local",
  },
  {
    key: "tools",
    label: "Tools",
    collectionKey: "tools",
    route: "/admin/tools",
    description: "Danh mục công cụ AI — bảng Supabase thật, CKOS Runtime đọc trực tiếp. Title/Summary/Body map vào field gốc (name/shortDescription/longDescription) để Portal tiếp tục hoạt động bình thường.",
    titleKey: "name",
    summaryKey: "shortDescription",
    bodyKey: "longDescription",
    storage: "supabase",
  },
  {
    key: "prompts",
    label: "Prompts",
    collectionKey: "prompts",
    route: "/admin/prompts",
    description: "Thư viện prompt do Admin biên soạn — bảng Supabase thật, hiển thị trên /portal/prompts. Summary/Body map vào field gốc (description/content).",
    summaryKey: "description",
    bodyKey: "content",
    storage: "supabase",
  },
  {
    key: "workflows",
    label: "Workflows",
    collectionKey: "ckos-workflows",
    route: "/admin/ckos/workflows",
    description: "Quy trình/SOP có cấu trúc bước-theo-bước để đạt một kết quả cụ thể.",
    storage: "local",
  },
  {
    key: "evaluations",
    label: "Evaluations",
    collectionKey: "ckos-evaluations",
    route: "/admin/ckos/evaluations",
    description: "Mô hình đánh giá/chấm điểm chất lượng đầu ra — nền tảng cho Evaluation Intelligence tương lai.",
    storage: "local",
  },
  {
    key: "resources",
    label: "Resources",
    collectionKey: "resources",
    route: "/admin/resources",
    description: "Tài nguyên tham khảo chung — bảng Supabase thật. Cùng họ với Template/Ebook/Checklist/SOP (4 collection anh em, mỗi loại 1 route riêng, cùng kiến trúc canonical).",
    titleKey: "name",
    summaryKey: "description",
    storage: "supabase",
    resourceFamily: true,
  },
  {
    key: "templates",
    label: "Template",
    collectionKey: "templates",
    route: "/admin/templates",
    description: "Họ Resources — Template.",
    titleKey: "name",
    summaryKey: "description",
    storage: "supabase",
    resourceFamily: true,
  },
  {
    key: "ebooks",
    label: "Ebook",
    collectionKey: "ebooks",
    route: "/admin/ebooks",
    description: "Họ Resources — Ebook.",
    titleKey: "name",
    summaryKey: "description",
    storage: "supabase",
    resourceFamily: true,
  },
  {
    key: "checklists",
    label: "Checklist",
    collectionKey: "checklists",
    route: "/admin/checklists",
    description: "Họ Resources — Checklist.",
    titleKey: "name",
    summaryKey: "description",
    storage: "supabase",
    resourceFamily: true,
  },
  {
    key: "sop",
    label: "SOP",
    collectionKey: "sop",
    route: "/admin/sop",
    description: "Họ Resources — SOP.",
    titleKey: "name",
    summaryKey: "description",
    storage: "supabase",
    resourceFamily: true,
  },
  {
    key: "case-studies",
    label: "Case Studies",
    collectionKey: "case-study",
    route: "/admin/case-study",
    description: "Case study thực chiến — dùng lại bảng jsonb `case_study` đã có sẵn trong hệ thống (trước đây orphan, không admin UI nào ghi vào). LƯU Ý: trang công khai /portal/case-studies vẫn đọc từ bảng typed `case_studies` (khác) — case study soạn mới qua Admin từ sprint này sẽ CHƯA hiển thị công khai cho tới khi có sprint riêng cập nhật đường đọc của Portal. Case study cũ đã publish trước đây vẫn hiển thị bình thường (bảng cũ không bị xóa/đổi). Xem §12.",
    storage: "supabase",
  },
  {
    key: "best-practices",
    label: "Best Practices",
    collectionKey: "ckos-best-practices",
    route: "/admin/ckos/best-practices",
    description: "Thực hành tốt nhất được đúc kết — trước đây chỉ có bảng schema, chưa từng có giao diện quản trị.",
    storage: "local",
  },
  {
    key: "faqs",
    label: "FAQs",
    collectionKey: "ckos-faqs",
    route: "/admin/ckos/faqs",
    description: "Câu hỏi thường gặp — trước đây chỉ tồn tại như một giá trị enum, chưa có bảng hay giao diện quản trị nào.",
    storage: "local",
  },
];

export function moduleByKey(key: string): KnowledgeModuleDef | undefined {
  return KNOWLEDGE_MODULES.find((m) => m.key === key);
}
