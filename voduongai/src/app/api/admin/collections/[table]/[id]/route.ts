import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { tableForCollection } from "@/lib/admin/supabaseCollections";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { validateAndNormalizeUrls } from "@/lib/admin/collectionValidation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table: key, id } = await params;
  const table = tableForCollection(key);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình" }, { status: 503 });

  const patch = await request.json().catch(() => null);
  if (!patch || typeof patch !== "object") {
    return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from(table)
    .select("data")
    .eq("id", id)
    .single();

  if (fetchError || !existing) return NextResponse.json({ error: "Không tìm thấy bản ghi" }, { status: 404 });

  const merged = { ...(existing.data as Record<string, unknown>), ...patch };

  const urlError = validateAndNormalizeUrls(key, merged);
  if (urlError) return NextResponse.json({ error: urlError.error }, { status: 400 });

  const { error } = await supabase
    .from(table)
    .update({
      data: merged,
      status: typeof merged.status === "string" ? merged.status : "Draft",
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table: key, id } = await params;
  const table = tableForCollection(key);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình" }, { status: 503 });

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
