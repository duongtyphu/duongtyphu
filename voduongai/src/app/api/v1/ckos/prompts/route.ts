import { getSupabaseServer } from "@/lib/supabase-server";
import {
  parseListParams,
  paginationRange,
  ckosJson,
  ckosError,
  ckosNotConfigured,
  isMissingTableError,
} from "@/lib/ckos/api-helpers";

// Phase G.3 — CKOS Read API foundation: Prompt Intelligence.
// Reads the NEW `ckos_prompt_templates` table (deliberately separate from
// the still-undecided production `prompts`/`prompt_templates` pair — see
// Phase F Canonical Table Decision, Product Owner approval point). Will
// return an empty list until Phase H migrates static prompt data in here;
// that is expected, not a bug.

export async function GET(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return ckosNotConfigured();
  }

  const params = parseListParams(request);
  const [from, to] = paginationRange(params.page, params.pageSize);

  const supabase = await getSupabaseServer();
  let query = supabase
    .from("ckos_prompt_templates")
    .select(
      "id, title, slug, description, status, version, language, difficulty, tags, expected_output, usage_guide, created_at, updated_at, published_at",
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
