/**
 * Allowlist of admin collections backed by real Supabase tables (Phase 2 of the
 * localStorage → Supabase migration). Each entry maps the existing
 * `collectionKey` (used throughout the admin UI / CrudPage) to the actual
 * Postgres table name. Only keys in this map are ever queried — this is the
 * security boundary for the generic /api/admin/collections/[table] route, so
 * it must never be widened to include sensitive tables (orders, leads, members...).
 */
export const SUPABASE_COLLECTIONS: Record<string, string> = {
  prompts: "prompts",
  tools: "tools",
  templates: "templates",
  ebooks: "ebooks",
  checklists: "checklists",
  sop: "sop",
  resources: "resources",
  blog: "blog",
  "case-study": "case_study",
  news: "news",
  updates: "updates",
  community: "community",
  "student-success-stories": "student_success_stories",
  "ai-academy": "ai_academy",
  "affiliate-academy": "affiliate_academy",
  "personal-brand": "personal_brand",
};

export function tableForCollection(key: string): string | null {
  return SUPABASE_COLLECTIONS[key] ?? null;
}
