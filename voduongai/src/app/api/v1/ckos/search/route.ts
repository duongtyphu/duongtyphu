import { getSupabaseServer } from "@/lib/supabase-server";
import { parseListParams, paginationRange, ckosJson, ckosNotConfigured, isMissingTableError } from "@/lib/ckos/api-helpers";

// Phase G.3 — CKOS Read API foundation: cross-Intelligence search.
//
// Foundation-level implementation: runs a small parallel fan-out across the
// CKOS tables (+ the reused `tools`/`case_studies` production tables),
// filters each independently by `q`/`tags`, tags each result with its source
// `type`, merges, then paginates the merged list in memory. This is NOT a
// relevance-ranked or indexed search — acceptable for a foundation endpoint
// per Phase G scope; a real search index is out of scope here (see Static
// Data Migration Readiness Report / Phase H recommendation).

type SearchResult = {
  type: "goal" | "tool" | "prompt" | "workflow" | "best_practice" | "case_study";
  id: string;
  title: string;
  description: string | null;
};

async function safeSelect(
  supabase: Awaited<ReturnType<typeof getSupabaseServer>>,
  table: string,
  columns: string,
  statusColumn: string,
  q: string | null
): Promise<Record<string, unknown>[]> {
  let query = supabase.from(table).select(columns).eq(statusColumn, "Published");
  if (q) query = query.ilike("title", `%${q}%`);
  const { data, error } = await query.limit(50);
  if (error) {
    if (isMissingTableError(error)) return [];
    return [];
  }
  return (data ?? []) as unknown as Record<string, unknown>[];
}

export async function GET(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return ckosNotConfigured();
  }

  const params = parseListParams(request);
  const supabase = await getSupabaseServer();

  const [goals, prompts, workflows, bestPractices, caseStudies, toolRows] = await Promise.all([
    safeSelect(supabase, "ckos_goals", "id, title, description", "status", params.q),
    safeSelect(supabase, "ckos_prompt_templates", "id, title, description", "status", params.q),
    safeSelect(supabase, "ckos_workflows", "id, title, description", "status", params.q),
    safeSelect(supabase, "ckos_best_practices", "id, title, description", "status", params.q),
    safeSelect(supabase, "case_studies", "id, title, summary", "status", params.q),
    safeSelect(supabase, "tools", "id, data", "status", null),
  ]);

  const toolResults: SearchResult[] = toolRows
    .map((row) => {
      // `tools` rows use `name`/`shortDescription` (not `title`/`description`)
      // — verified against live data (Phase G smoke test).
      const data = (row.data ?? {}) as { name?: string; shortDescription?: string };
      return { type: "tool" as const, id: String(row.id), title: data.name ?? "", description: data.shortDescription ?? null };
    })
    .filter((it) => !params.q || it.title.toLowerCase().includes(params.q.toLowerCase()));

  const results: SearchResult[] = [
    ...goals.map((r) => ({ type: "goal" as const, id: String(r.id), title: String(r.title ?? ""), description: (r.description as string) ?? null })),
    ...prompts.map((r) => ({ type: "prompt" as const, id: String(r.id), title: String(r.title ?? ""), description: (r.description as string) ?? null })),
    ...workflows.map((r) => ({ type: "workflow" as const, id: String(r.id), title: String(r.title ?? ""), description: (r.description as string) ?? null })),
    ...bestPractices.map((r) => ({ type: "best_practice" as const, id: String(r.id), title: String(r.title ?? ""), description: (r.description as string) ?? null })),
    ...caseStudies.map((r) => ({ type: "case_study" as const, id: String(r.id), title: String(r.title ?? ""), description: (r.summary as string) ?? null })),
    ...toolResults,
  ];

  const total = results.length;
  const [from, to] = paginationRange(params.page, params.pageSize);
  const page = results.slice(from, to + 1);

  return ckosJson(page, { page: params.page, pageSize: params.pageSize, total });
}
