import { NextResponse } from "next/server";

/**
 * Shared helpers for the CKOS Read API foundation (Phase G.3,
 * `src/app/api/v1/ckos/*`). Public, unauthenticated, read-only — every route
 * using these helpers must only ever query rows already scoped to
 * `status = 'Published'` by RLS (or an explicit `.eq("status", "Published")`
 * for tables not yet RLS-protected), never draft/archived/internal fields.
 */

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 20;

export type CkosListParams = {
  page: number;
  pageSize: number;
  tags: string[];
  difficulty: string | null;
  language: string | null;
  category: string | null;
  q: string | null;
};

export function parseListParams(request: Request): CkosListParams {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const rawPageSize = Number(url.searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, rawPageSize));
  const tagsParam = url.searchParams.get("tags");
  const tags = tagsParam ? tagsParam.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return {
    page,
    pageSize,
    tags,
    difficulty: url.searchParams.get("difficulty"),
    language: url.searchParams.get("language"),
    category: url.searchParams.get("category"),
    q: url.searchParams.get("q"),
  };
}

export function paginationRange(page: number, pageSize: number): [number, number] {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return [from, to];
}

export function ckosJson(items: unknown[], meta: { page: number; pageSize: number; total: number | null }) {
  return NextResponse.json({
    items,
    page: meta.page,
    pageSize: meta.pageSize,
    total: meta.total,
  });
}

export function ckosError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function ckosNotConfigured() {
  return ckosError("Supabase chưa được cấu hình", 503);
}

/**
 * A CKOS table that doesn't exist yet on production (migration not applied)
 * surfaces as a Postgres "relation does not exist" error via PostgREST —
 * treat that as an empty result set rather than a 500, since Phase G ships
 * schema/API code ahead of the migration being run (documented dependency,
 * see PRODUCTION_MIGRATION_RUNBOOK.md).
 */
export function isMissingTableError(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  // Two distinct shapes observed live: a raw Postgres error (42P01, "relation
  // ... does not exist") when queried directly, and PostgREST's own schema-
  // cache-miss error (code PGRST205, "Could not find the table ... in the
  // schema cache") when the table has never existed since the API started —
  // this is the one actually returned by Supabase's REST layer for CKOS
  // tables before their migration has been applied. Match both.
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /relation .* does not exist/i.test(error.message ?? "") ||
    /could not find the table/i.test(error.message ?? "")
  );
}
