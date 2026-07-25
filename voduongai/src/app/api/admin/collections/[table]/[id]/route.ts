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
    .select("data, status")
    .eq("id", id)
    .single();

  if (fetchError || !existing) return NextResponse.json({ error: "Không tìm thấy bản ghi" }, { status: 404 });

  const merged = { ...(existing.data as Record<string, unknown>), ...patch };

  const urlError = validateAndNormalizeUrls(key, merged);
  if (urlError) return NextResponse.json({ error: urlError.error }, { status: 400 });

  // BUG ĐÃ SỬA: bản cũ chỉ select("data") — KHÔNG biết cột `status` ngoài
  // hiện tại của dòng, nên khi patch không kèm `status` (mọi editor
  // EditableRegion chỉ sửa 1-2 field text, không quản status), route tự
  // rơi về "Draft" — âm thầm unpublish dòng đó dù chỉ sửa nội dung không
  // liên quan. Đã gặp/vá tạm ở PotentialAnalysisLive.tsx (ép status:
  // "Published" thủ công mỗi lần gọi update()) nhưng đó chỉ là 1 điểm vá,
  // không sửa gốc — EcosystemOverview/EcosystemLinksBox/SubProjectOverview/
  // SubProjectLinksBox (và mọi module Live-edit khác dùng EditableRegion:
  // Mirror/Journal/Story/JourneyMap/Garden/Trang chủ/Sứ mệnh Companion/
  // Premium) vẫn dính bug này — xác nhận thật qua execute_sql:
  // `ecosystem_chrome.eco_digiu` đã bị rơi về Draft sau 1 lần Founder sửa
  // tên thử. Giờ ưu tiên `patch.status` (nếu client CÓ gửi, giữ nguyên
  // hành vi các editor tự quản status như ProjectCards/ArticlesAdminPanel/
  // SubProjectsAdminPanel), nếu không có thì giữ ĐÚNG `existing.status`
  // (giá trị thật hiện tại), chỉ rơi về "Draft" khi dòng thực sự chưa có
  // status nào (trường hợp không nên xảy ra với schema `not null default
  // 'Draft'`).
  const nextStatus =
    typeof patch.status === "string"
      ? patch.status
      : typeof existing.status === "string"
        ? existing.status
        : "Draft";

  const { error } = await supabase
    .from(table)
    .update({
      data: merged,
      status: nextStatus,
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
