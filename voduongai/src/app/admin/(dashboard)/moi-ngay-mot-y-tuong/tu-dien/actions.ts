"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// "Mỗi ngày một ý tưởng" — Từ điển (`mnyt_glossary`, typed) — cùng pattern
// `coupons`/`mnyt_categories`. Độc lập, không FK từ bảng nào khác.

export type MnytGlossaryRow = {
  id: number;
  term: string;
  term_en: string;
  category: string;
  definition: string;
  definition_en: string;
  order_index: number;
  status: "Draft" | "Published" | "Hidden";
};

export type MnytGlossaryInput = Omit<MnytGlossaryRow, "id">;

export async function listMnytGlossary(): Promise<{ items: MnytGlossaryRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { items: [], configured: false };
  const { data } = await supabase
    .from("mnyt_glossary")
    .select("id, term, term_en, category, definition, definition_en, order_index, status")
    .order("order_index", { ascending: true });
  return { items: (data ?? []) as MnytGlossaryRow[], configured: true };
}

export async function createMnytGlossaryTerm(input: MnytGlossaryInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.term.trim()) return { error: "Vui lòng nhập thuật ngữ." };

  const { error } = await supabase.from("mnyt_glossary").insert(input);
  if (error) return { error: error.code === "23505" ? "Thuật ngữ này đã tồn tại." : "Không thể tạo, vui lòng thử lại." };

  revalidatePath("/admin/moi-ngay-mot-y-tuong/tu-dien");
  return { error: null };
}

export async function updateMnytGlossaryTerm(id: number, input: MnytGlossaryInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("mnyt_glossary").update(input).eq("id", id);
  if (error) return { error: "Không thể lưu, vui lòng thử lại." };

  revalidatePath("/admin/moi-ngay-mot-y-tuong/tu-dien");
  return { error: null };
}

export async function deleteMnytGlossaryTerm(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("mnyt_glossary").delete().eq("id", id);
  if (error) return { error: "Không thể xoá, vui lòng thử lại." };

  revalidatePath("/admin/moi-ngay-mot-y-tuong/tu-dien");
  return { error: null };
}
