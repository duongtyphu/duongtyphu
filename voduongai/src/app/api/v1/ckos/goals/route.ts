import { getSupabaseServer } from "@/lib/supabase-server";
import {
  parseListParams,
  paginationRange,
  ckosJson,
  ckosError,
  ckosNotConfigured,
  isMissingTableError,
} from "@/lib/ckos/api-helpers";

// Phase G.3 — CKOS Read API foundation. Public, unauthenticated, read-only.
// Only ever returns status='Published' rows (enforced by RLS on ckos_goals —
// see supabase-phase-g-ckos-core-tables.sql — plus an explicit filter here
// as defense-in-depth). `metadata` is intentionally excluded from the
// response (internal/admin-only field, not for public consumption).

export async function GET(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return ckosNotConfigured();
  }

  const params = parseListParams(request);
  const [from, to] = paginationRange(params.page, params.pageSize);

  const supabase = await getSupabaseServer();
  let query = supabase
    .from("ckos_goals")
    .select(
      "id, title, slug, description, status, version, language, difficulty, tags, target_outcome, timeframe, created_at, updated_at, published_at",
      { count: "exact" }
    )
    .eq("status", "Published");

  if (params.difficulty) query = query.eq("difficulty", params.difficulty);
  if (params.language) query = query.eq("language", params.language);
  if (params.tags.length > 0) query = query.overlaps("tags", params.tags);
  if (params.q) query = query.ilike("title", `%${params.q}%`);

  const { data, error, count } = await query
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    if (isMissingTableError(error)) return ckosJson([], { page: params.page, pageSize: params.pageSize, total: 0 });
    return ckosError(error.message);
  }

  return ckosJson(data ?? [], { page: params.page, pageSize: params.pageSize, total: count ?? null });
}
