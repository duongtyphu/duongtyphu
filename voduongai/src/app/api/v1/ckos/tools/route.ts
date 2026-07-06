import { getSupabaseServer } from "@/lib/supabase-server";
import {
  parseListParams,
  paginationRange,
  ckosJson,
  ckosError,
  ckosNotConfigured,
  isMissingTableError,
} from "@/lib/ckos/api-helpers";

// Phase G.3 — CKOS Read API foundation: Tool Intelligence.
// Reuses the existing production `tools` table (jsonb pattern, id/data/
// status/order) as-is — no new CKOS table for tools (see design note in
// supabase-phase-g-ckos-core-tables.sql). Category/difficulty/tags filters
// operate on whatever fields exist inside each row's `data` jsonb, applied
// client-side after fetch since the jsonb pattern doesn't index those
// sub-fields — acceptable for a foundation-level endpoint, not a
// production-scale search (see CKOS API Foundation Report, Phase G).

type ToolRow = { id: string; data: Record<string, unknown> };

export async function GET(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return ckosNotConfigured();
  }

  const params = parseListParams(request);
  const supabase = await getSupabaseServer();

  const { data, error } = await supabase
    .from("tools")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });

  if (error) {
    if (isMissingTableError(error)) return ckosJson([], { page: params.page, pageSize: params.pageSize, total: 0 });
    return ckosError(error.message);
  }

  let items = ((data ?? []) as ToolRow[]).map((row) => ({ ...row.data, id: row.id }));

  if (params.category) {
    items = items.filter((it) => (it as { category?: string }).category === params.category);
  }
  if (params.q) {
    // `tools` rows use `name` (not `title`) as the display field — verified
    // against live data (Phase G smoke test), see CKOS API Foundation Report.
    const q = params.q.toLowerCase();
    items = items.filter((it) => String((it as { name?: string }).name ?? "").toLowerCase().includes(q));
  }

  const total = items.length;
  const [from, to] = paginationRange(params.page, params.pageSize);
  const page = items.slice(from, to + 1);

  return ckosJson(page, { page: params.page, pageSize: params.pageSize, total });
}
