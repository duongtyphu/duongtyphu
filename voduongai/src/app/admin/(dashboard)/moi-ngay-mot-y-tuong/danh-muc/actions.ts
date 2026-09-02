"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// "Mỗi ngày một ý tưởng" — Danh mục (`mnyt_categories`, typed, KHÔNG phải
// schema generic id/data/status/order) — không qua /api/admin/collections,
// cùng pattern `coupons`/`case_studies`. `key` là khoá FK cho `mnyt_topics`
// nên KHÔNG cho sửa sau khi tạo (đổi key sẽ làm mọi ý tưởng thuộc danh mục
// đó "mồ côi" — UI chỉ hiện field này read-only lúc sửa).

export type MnytCategoryRow = {
  key: string;
  name: string;
  name_en: string;
  short_name: string;
  color: string;
  order_index: number;
  status: "Draft" | "Published" | "Hidden";
};

export async function listMnytCategories(): Promise<{ items: MnytCategoryRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { items: [], configured: false };
  const { data } = await supabase
    .from("mnyt_categories")
    .select("key, name, name_en, short_name, color, order_index, status")
    .order("order_index", { ascending: true });
  return { items: (data ?? []) as MnytCategoryRow[], configured: true };
}

export async function createMnytCategory(input: MnytCategoryRow) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const key = input.key.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  if (!key) return { error: "Vui lòng nhập mã lĩnh vực (key)." };
  if (!input.name.trim()) return { error: "Vui lòng nhập tên lĩnh vực." };

  const { error } = await supabase.from("mnyt_categories").insert({ ...input, key });
  if (error) return { error: error.code === "23505" ? "Mã lĩnh vực này đã tồn tại." : "Không thể tạo, vui lòng thử lại." };

  revalidatePath("/admin/moi-ngay-mot-y-tuong/danh-muc");
  return { error: null };
}

export async function updateMnytCategory(key: string, input: Omit<MnytCategoryRow, "key">) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("mnyt_categories").update(input).eq("key", key);
  if (error) return { error: "Không thể lưu, vui lòng thử lại." };

  revalidatePath("/admin/moi-ngay-mot-y-tuong/danh-muc");
  return { error: null };
}

/** Đếm số ý tưởng/lĩnh vực — hiện trên mỗi thẻ, giúp Admin biết xoá có an
 * toàn không trước khi bấm (không cần đợi lỗi FK). */
export async function getMnytCategoryTopicCounts(): Promise<Record<string, number>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return {};
  const { data } = await supabase.from("mnyt_topics").select("category_key");
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const key = (row as { category_key: string }).category_key;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export async function deleteMnytCategory(key: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("mnyt_categories").delete().eq("key", key);
  if (error) {
    return {
      error:
        error.code === "23503"
          ? "Không thể xoá — vẫn còn ý tưởng thuộc lĩnh vực này. Xoá/đổi lĩnh vực các ý tưởng đó trước."
          : "Không thể xoá, vui lòng thử lại.",
    };
  }

  revalidatePath("/admin/moi-ngay-mot-y-tuong/danh-muc");
  return { error: null };
}
