import { getSupabaseServer } from "@/lib/supabase-server";
import {
  parseListParams,
  paginationRange,
  ckosJson,
  ckosError,
  ckosNotConfigured,
  isMissingTableError,
} from "@/lib/ckos/api-helpers";

// Phase G.3 — CKOS Read API foundation: Workflow Intelligence.
// Reads the new `ckos_workflows` table. Steps are intentionally NOT embedded
// here (keeps the foundation endpoint simple/cheap) — a future
// `/api/v1/ckos/workflows/[id]/steps` route can join `ckos_workflow_steps`
// once there's real data to serve (Phase H).

export async function GET(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return ckosNotConfigured();
  }

  const params = parseListParams(request);
  const [from, to] = paginationRange(params.page, params.pageSize);

  const supabase = await getSupabaseServer();
  let query = supabase
    .from("ckos_workflows")
    .select(
      "id, title, slug, description, status, version, language, difficulty, tags, input_definition, output_definition, estimated_time, automation_level, created_at, updated_at, published_at",
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
