import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { tableForCollection } from "@/lib/admin/supabaseCollections";
import { requireAdmin, requireMember } from "@/lib/admin/requireAdmin";
import { validateAndNormalizeUrls } from "@/lib/admin/collectionValidation";

export async function GET(_request: Request, { params }: { params: Promise<{ table: string }> }) {
  if (!(await requireMember())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table: key } = await params;
  const table = tableForCollection(key);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình" }, { status: 503 });

  const { data, error } = await supabase
    .from(table)
    .select("id, data, status, order")
    .order("order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // status là cột riêng (không nằm trong `data` jsonb) — phải merge sau
  // cùng, đè lên bất kỳ key "status" nào lỡ có trong `data`, để mọi editor
  // (LessonEditor, DataTableRowPanel...) đọc đúng trạng thái Published/Draft
  // thật. Thiếu dòng này khiến mọi lần Lưu không kèm status → PATCH tự rơi
  // về "Draft" (unpublish ngoài ý muốn) vì `existing.status` luôn undefined.
  const items = (data ?? []).map((row) => ({
    ...(row.data as Record<string, unknown>),
    id: row.id,
    status: row.status,
  }));
  return NextResponse.json({ items });
}

export async function POST(request: Request, { params }: { params: Promise<{ table: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table: key } = await params;
  const table = tableForCollection(key);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình" }, { status: 503 });

  const item = await request.json().catch(() => null);
  if (!item || typeof item.id !== "string") {
    return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
  }

  const urlError = validateAndNormalizeUrls(key, item);
  if (urlError) return NextResponse.json({ error: urlError.error }, { status: 400 });

  const { error } = await supabase.from(table).upsert({
    id: item.id,
    data: item,
    status: typeof item.status === "string" ? item.status : "Draft",
    order: typeof item.order === "number" ? item.order : 0,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/**
 * Bulk replace — used by `set`/`reorder` (singleton settings forms, section
 * visibility/order toggles). Upserts every item in the body array and removes
 * any row no longer present, since `set` always represents the full collection.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ table: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table: key } = await params;
  const table = tableForCollection(key);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình" }, { status: 503 });

  const list = await request.json().catch(() => null);
  if (!Array.isArray(list)) return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });

  for (const item of list as Record<string, unknown>[]) {
    const urlError = validateAndNormalizeUrls(key, item);
    if (urlError) return NextResponse.json({ error: urlError.error }, { status: 400 });
  }

  const rows = list.map((item: Record<string, unknown>, i: number) => ({
    id: String(item.id),
    data: item,
    status: typeof item.status === "string" ? item.status : "Draft",
    order: typeof item.order === "number" ? item.order : i,
  }));

  if (rows.length > 0) {
    const { error } = await supabase.from(table).upsert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ids = rows.map((r) => r.id);
  const { error: deleteError } = ids.length > 0
    ? await supabase.from(table).delete().not("id", "in", `(${ids.map((id) => `"${id}"`).join(",")})`)
    : await supabase.from(table).delete().neq("id", "__none__");

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
