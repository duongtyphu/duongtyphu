"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Sửa nhanh 3 field cốt lõi (name/shortDescription/status) của 1 hệ sinh
 * thái ngay trên `/v2/admin/du-an-co-hoi` — cùng bảng `ecosystem_chrome`
 * mà Portal 1.0 lẫn 2.0 đều đọc (`getLiveEcosystemChrome`), không tạo bảng
 * song song. Chỉnh sửa sâu hơn (fullIntro/highlights/links/subprojects/
 * bài viết/đánh giá...) đã có sẵn UI đầy đủ ở `/admin/duan-cohoi/[slug]`
 * (1.0) — không xây lại ở đây, tránh trùng công sức (Single Source of
 * Truth cho cả DATA lẫn UI phức tạp).
 *
 * Luôn gửi kèm `status` hiện tại của dòng (đọc lại trước khi ghi) — đúng
 * bài học "PATCH thiếu status tự rơi về Draft" đã ghi nhiều lần trong
 * CLAUDE.md cho route generic; ở đây viết thẳng qua Supabase nên tự kiểm
 * soát, không đi qua route đó.
 */
export async function updateEcosystemQuick(
  id: string,
  patch: { name?: string; shortDescription?: string; status?: string },
) {
  const user = await requireAdmin();
  if (!user) throw new Error("Không có quyền truy cập.");

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");

  const { data: existing, error: readError } = await supabase
    .from("ecosystem_chrome")
    .select("data, status")
    .eq("id", id)
    .single();
  if (readError || !existing) throw new Error("Không tìm thấy hệ sinh thái.");

  const nextStatus = patch.status ?? existing.status ?? "Published";
  const nextData = {
    ...(existing.data as Record<string, unknown>),
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.shortDescription !== undefined ? { shortDescription: patch.shortDescription } : {}),
  };

  const { error: writeError } = await supabase
    .from("ecosystem_chrome")
    .update({ data: nextData, status: nextStatus })
    .eq("id", id);
  if (writeError) throw new Error(writeError.message);

  revalidatePath("/v2/admin/du-an-co-hoi");
  revalidatePath("/v2/du-an-co-hoi");
}
