import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { tableForCollection } from "@/lib/admin/supabaseCollections";

export async function GET(_request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table: key } = await params;
  const table = tableForCollection(key);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình" }, { status: 503 });

  const { data, error } = await supabase
    .from(table)
    .select("id, data, order")
    .order("order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data ?? []).map((row) => ({ ...(row.data as Record<string, unknown>), id: row.id }));
  return NextResponse.json({ items });
}

export async function POST(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table: key } = await params;
  const table = tableForCollection(key);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình" }, { status: 503 });

  const item = await request.json().catch(() => null);
  if (!item || typeof item.id !== "string") {
    return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
  }

  const { error } = await supabase.from(table).insert({
    id: item.id,
    data: item,
    status: typeof item.status === "string" ? item.status : "Draft",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
