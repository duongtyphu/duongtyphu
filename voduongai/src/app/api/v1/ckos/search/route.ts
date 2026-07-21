import { getSupabaseServer } from "@/lib/supabase-server";
import { parseListParams, paginationRange, ckosJson, isMissingTableError } from "@/lib/ckos/api-helpers";
import { getAllKnowledgeSeeds } from "@/features/knowledge";
import { prompts } from "@/data/prompts";
import { sops } from "@/data/sop";
import { freeResources } from "@/data/resources";

// Phase G.3 — CKOS Read API foundation: cross-Intelligence search.
//
// Portal 4.0 Final Reconstruction — CKOS Experience Reconstruction: this
// endpoint previously only fanned out over Supabase tables that mostly
// don't exist yet in production (ckos_prompt_templates/ckos_workflows are
// PGRST205 — never migrated; `ckos_goals` likewise). That meant searching
// CKOS silently never surfaced the 12 real curated Prompts, 4 real SOPs,
// 10 real Resources, or the 11 real Lesson seeds — exactly the "feels
// like two systems" gap this reconstruction exists to close. Static,
// always-real content (features/knowledge + src/data/*.ts) is now
// searched directly and merged in, and stays available even when Supabase
// isn't configured — only the genuinely Supabase-backed sources (goals,
// Best Practice, Case Study, live Tool rows) are skipped in that case.
//
// BUG FIX (audit, xem CLAUDE.md "Best Practice"): route này từng query
// bảng "ckos_best_practices" — tên đó KHÔNG tồn tại (thuộc kiến trúc
// Phase G/H cũ, chưa từng apply). Best Practice thật nằm ở bảng
// `best_practices` (generic id/data/status/order, tạo ở Bước A/B) — đổi
// tên bảng + đổi cách đọc cột (title/description nằm trong `data` jsonb,
// không phải cột phẳng) giống hệt cách `tools` đã xử lý bên dưới.
//
// Foundation-level implementation: still an in-memory merge, not a
// relevance-ranked/indexed search — acceptable for a foundation endpoint.

type SearchResult = {
  type: "goal" | "tool" | "prompt" | "workflow" | "best_practice" | "case_study" | "lesson" | "resource";
  id: string;
  title: string;
  description: string | null;
  href: string;
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

function matches(q: string | null, ...fields: string[]): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return fields.some((f) => f.toLowerCase().includes(needle));
}

function searchStaticContent(q: string | null): SearchResult[] {
  const lessonResults: SearchResult[] = getAllKnowledgeSeeds()
    .filter((seed) => matches(q, seed.title, seed.summary))
    .map((seed) => ({
      type: "lesson" as const,
      id: seed.slug,
      title: seed.title,
      description: seed.summary,
      href: `/portal/hetrithucai/${seed.slug}`,
    }));

  const promptResults: SearchResult[] = prompts
    .filter((p) => matches(q, p.title, p.preview))
    .map((p) => ({ type: "prompt" as const, id: p.id, title: p.title, description: p.preview, href: `/portal/prompts/${p.id}` }));

  const workflowResults: SearchResult[] = sops
    .filter((s) => matches(q, s.title, s.description))
    .map((s) => ({ type: "workflow" as const, id: s.title, title: s.title, description: s.description, href: "/portal/sop" }));

  const resourceResults: SearchResult[] = freeResources
    .filter((r) => matches(q, r.title, r.description))
    .map((r) => ({ type: "resource" as const, id: r.id, title: r.title, description: r.description, href: `/portal/resources/${r.id}` }));

  return [...lessonResults, ...promptResults, ...workflowResults, ...resourceResults];
}

export async function GET(request: Request) {
  const params = parseListParams(request);
  const staticResults = searchStaticContent(params.q);

  let supabaseResults: SearchResult[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await getSupabaseServer();

    const [goals, bestPracticeRows, caseStudies, toolRows] = await Promise.all([
      safeSelect(supabase, "ckos_goals", "id, title, description", "status", params.q),
      safeSelect(supabase, "best_practices", "id, data", "status", null),
      safeSelect(supabase, "case_studies", "id, title, summary", "status", params.q),
      safeSelect(supabase, "tools", "id, data", "status", null),
    ]);

    const toolResults: SearchResult[] = toolRows
      .map((row) => {
        // `tools` rows use `name`/`shortDescription` (not `title`/`description`)
        // — verified against live data (Phase G smoke test).
        const data = (row.data ?? {}) as { name?: string; shortDescription?: string; slug?: string };
        return {
          type: "tool" as const,
          id: String(row.id),
          title: data.name ?? "",
          description: data.shortDescription ?? null,
          href: "/portal/aiworkspace#ai-toolbox",
        };
      })
      .filter((it) => !params.q || it.title.toLowerCase().includes(params.q.toLowerCase()));

    // `best_practices` là schema generic (id/data jsonb/status/order) — title/
    // description nằm trong `data`, không phải cột phẳng, nên đọc `id, data`
    // (không dùng ilike trong safeSelect) rồi tự lọc theo title, giống tools.
    const bestPracticeResults: SearchResult[] = bestPracticeRows
      .map((row) => {
        const data = (row.data ?? {}) as { title?: string; description?: string };
        return {
          type: "best_practice" as const,
          id: String(row.id),
          title: data.title ?? "",
          description: data.description ?? null,
          href: `/portal/ckos/best-practices/${row.id}`,
        };
      })
      .filter((it) => !params.q || it.title.toLowerCase().includes(params.q.toLowerCase()));

    supabaseResults = [
      ...goals.map((r) => ({ type: "goal" as const, id: String(r.id), title: String(r.title ?? ""), description: (r.description as string) ?? null, href: "/portal/ckos" })),
      ...bestPracticeResults,
      ...caseStudies.map((r) => ({ type: "case_study" as const, id: String(r.id), title: String(r.title ?? ""), description: (r.summary as string) ?? null, href: "/portal/case-studies" })),
      ...toolResults,
    ];
  }

  const results = [...staticResults, ...supabaseResults];
  const total = results.length;
  const [from, to] = paginationRange(params.page, params.pageSize);
  const page = results.slice(from, to + 1);

  return ckosJson(page, { page: params.page, pageSize: params.pageSize, total });
}
