/**
 * CKOS Management — shared metadata + lifecycle standard (ADM-SPR-003).
 *
 * CKOS is the single source of truth for knowledge content. All 9 module
 * types (Goals, Tools, Prompts, Workflows, Evaluations, Resources, Case
 * Studies, Best Practices, FAQs) use this same metadata shape and the same
 * 6-state lifecycle, so admins get one consistent editing experience
 * regardless of which knowledge type they're managing.
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
 * Base shape every CKOS knowledge item shares. Individual modules may carry
 * a few extra fields (e.g. Evaluations' pass threshold) on top of this, but
 * every module's list/detail/create/edit/search/relationship UI is driven by
 * this shared shape via KnowledgeCrudPage — no per-module bespoke form.
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
  /** Relationship Model (Task 6) — ids of related items, format `${moduleKey}:${id}`. */
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
  /**
   * "supabase" = already backed by a real, existing Supabase table via
   * SUPABASE_COLLECTIONS (Tools/Prompts/Resources — reused as-is, no schema
   * change). "local" = new module this sprint with no existing safe table to
   * write to without a schema change/migration (out of scope per brief), so
   * it persists via the existing per-browser localStorage tier that
   * useCollection() already falls back to for any key not in the Supabase
   * allowlist. Wiring these to real tables is a follow-up sprint's job (see
   * docs/admin/CKOS_MANAGEMENT.md §9 Runtime Readiness). "custom" = Case
   * Studies, which keeps its existing dedicated typed-table CRUD unchanged
   * this sprint (not migrated to KnowledgeCrudPage — see report).
   */
  storage: "supabase" | "local" | "custom";
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
    description: "Danh mục công cụ AI — bảng Supabase thật, đã là nguồn CKOS Runtime đọc trực tiếp.",
    storage: "supabase",
  },
  {
    key: "prompts",
    label: "Prompts",
    collectionKey: "prompts",
    route: "/admin/prompts",
    description: "Thư viện prompt do Admin biên soạn — bảng Supabase thật, đã hiển thị trên /portal/prompts.",
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
    description: "Tài nguyên tham khảo — bảng Supabase thật (lưu ý: trang công khai /portal/resources hiện đọc từ bảng `documents` khác, xem Risk trong ADMIN_CMS_FOUNDATION.md §13 R5).",
    storage: "supabase",
  },
  {
    key: "case-studies",
    label: "Case Studies",
    collectionKey: "case_studies",
    route: "/admin/case-study",
    description: "Case study thực chiến — giữ nguyên CRUD kiểu riêng (typed table `case_studies`) trong sprint này, chưa áp dụng Metadata/Lifecycle chuẩn CKOS.",
    storage: "custom",
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
