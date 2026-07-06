import { getSupabaseServer } from "@/lib/supabase-server";
import {
  parseListParams,
  paginationRange,
  ckosJson,
  ckosError,
  ckosNotConfigured,
  isMissingTableError,
} from "@/lib/ckos/api-helpers";

// Phase G.3 — CKOS Read API foundation: Evaluation Intelligence.
//
// IMPORTANT: per every prior phase's explicit prohibition, Evaluation
// Intelligence is NOT being built here — this route only exposes the empty
// `ckos_evaluation_models` schema table (Phase G.1) for structural
// completeness of the 6-route foundation the work order requires. It will
// always return an empty list until a future phase makes an explicit,
// separately-approved decision about Evaluation Intelligence's scope and
// real data source (localStorage migration is a prerequisite, per Phase C).

export async function GET(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return ckosNotConfigured();
  }

  const params = parseListParams(request);
  const [from, to] = paginationRange(params.page, params.pageSize);

  const supabase = await getSupabaseServer();
  let query = supabase
    .from("ckos_evaluation_models")
    .select(
      "id, title, slug, description, status, version, language, difficulty, tags, pass_threshold, created_at, updated_at, published_at",
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
