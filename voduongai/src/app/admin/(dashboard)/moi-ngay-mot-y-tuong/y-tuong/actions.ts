"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import type { MnytQuiz } from "@/lib/portal/live-mnyt";

// "Mỗi ngày một ý tưởng" — Ý tưởng (`mnyt_topics`, typed, 446 dòng) — cùng
// pattern `coupons`/`mnyt_categories`, tách List (nhẹ, phân trang) khỏi Edit
// (đầy đủ `content` — 23 trường lồng, quá lớn để hiện trong 1 dòng list).

export type MnytTopicListRow = {
  id: string;
  day: number;
  category_key: string;
  category_name: string;
  color: string;
  title: string;
  difficulty: string;
  status: string;
};

export type MnytTopicFullRow = MnytTopicListRow & {
  title_en: string;
  category_name_en: string;
  hook: string;
  hook_en: string;
  est_minutes: number;
  tools: string[];
  is_trending: boolean;
  path_step: number;
  path_total: number;
  content: {
    concept: string; conceptEn: string;
    apply: string; applyEn: string;
    mechanism: string; mechanismEn: string;
    risk: string; riskEn: string;
    takeaway: string; takeawayEn: string;
    promptExample: string;
    promptShort: string; promptShortEn: string;
    promptDetailed: string; promptDetailedEn: string;
    promptAdvanced: string; promptAdvancedEn: string;
    quiz: MnytQuiz; quizEn: MnytQuiz;
    scenarioQuiz: MnytQuiz; scenarioQuizEn: MnytQuiz;
    applyQuiz: MnytQuiz; applyQuizEn: MnytQuiz;
  };
};

const LIST_COLUMNS = "id, day, category_key, category_name, color, title, difficulty, status";
const FULL_COLUMNS =
  "id, day, category_key, category_name, category_name_en, color, title, title_en, hook, hook_en, difficulty, est_minutes, tools, is_trending, path_step, path_total, content, status";

export async function listMnytTopicsAdmin(params: {
  page: number;
  pageSize: number;
  categoryKey?: string;
  q?: string;
}): Promise<{ items: MnytTopicListRow[]; total: number; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { items: [], total: 0, configured: false };

  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase.from("mnyt_topics").select(LIST_COLUMNS, { count: "exact" });
  if (params.categoryKey) query = query.eq("category_key", params.categoryKey);
  if (params.q && params.q.trim()) {
    const q = params.q.trim().replace(/[%_]/g, "");
    query = query.or(`title.ilike.%${q}%,id.ilike.%${q}%`);
  }
  query = query.order("day", { ascending: true }).range(from, to);

  const { data, count } = await query;
  return { items: (data ?? []) as MnytTopicListRow[], total: count ?? 0, configured: true };
}

export async function getMnytTopicAdmin(id: string): Promise<MnytTopicFullRow | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase.from("mnyt_topics").select(FULL_COLUMNS).eq("id", id).maybeSingle();
  return (data as MnytTopicFullRow) ?? null;
}

export async function updateMnytTopicAdmin(id: string, input: Omit<MnytTopicFullRow, "id">) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  if (!input.title.trim()) return { error: "Vui lòng nhập tiêu đề." };
  if (!Number.isFinite(input.day) || input.day < 1) return { error: "Số thứ tự (day) không hợp lệ." };

  const { error } = await supabase
    .from("mnyt_topics")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { error: error.code === "23505" ? "Số thứ tự (day) này đã dùng cho ý tưởng khác." : "Không thể lưu, vui lòng thử lại." };
  }

  revalidatePath("/admin/moi-ngay-mot-y-tuong/y-tuong");
  revalidatePath(`/admin/moi-ngay-mot-y-tuong/y-tuong/${id}`);
  return { error: null };
}

export async function deleteMnytTopicAdmin(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("mnyt_topics").delete().eq("id", id);
  if (error) return { error: "Không thể xoá, vui lòng thử lại." };

  revalidatePath("/admin/moi-ngay-mot-y-tuong/y-tuong");
  return { error: null };
}

const EMPTY_QUIZ: MnytQuiz = { question: "", options: ["", "", "", ""], correct: 0 };

/** Tạo 1 ý tưởng nháp mới (day = max hiện có + 1, lĩnh vực đầu tiên), rồi
 * điều hướng thẳng sang trang sửa — tránh 1 form "tạo mới" riêng lặp lại
 * 23 trường của form sửa. */
export async function createDraftMnytTopicAndRedirect(categoryKey: string) {
  if (!(await requireAdmin())) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { data: maxRow } = await supabase.from("mnyt_topics").select("day").order("day", { ascending: false }).limit(1).maybeSingle();
  const nextDay = ((maxRow as { day: number } | null)?.day ?? 0) + 1;

  const { data: cat } = await supabase.from("mnyt_categories").select("key, name, name_en, color").eq("key", categoryKey).maybeSingle();
  if (!cat) return;

  const id = `${categoryKey}-moi-${nextDay}`;
  const { count } = await supabase
    .from("mnyt_topics")
    .select("id", { count: "exact", head: true })
    .eq("category_key", categoryKey);
  const pathTotal = count ?? 0;

  await supabase.from("mnyt_topics").insert({
    id,
    day: nextDay,
    category_key: cat.key,
    category_name: cat.name,
    category_name_en: cat.name_en,
    color: cat.color,
    title: "Ý tưởng mới (chưa đặt tên)",
    title_en: "New idea (untitled)",
    hook: "",
    hook_en: "",
    difficulty: "Cơ bản",
    est_minutes: 4,
    tools: [],
    is_trending: false,
    path_step: pathTotal + 1,
    // Giới hạn đã biết: KHÔNG cập nhật lại `path_total` của các ý tưởng
    // khác cùng lĩnh vực khi thêm mới (recompute hàng loạt cho 1 thao tác
    // hiếm gặp) — tab "Lộ trình" có thể hiện tổng số cũ ở các ý tưởng có
    // sẵn cho tới khi Admin tự sửa lại `path_total` từng dòng nếu cần.
    path_total: pathTotal + 1,
    status: "Draft",
    content: {
      concept: "", conceptEn: "", apply: "", applyEn: "", mechanism: "", mechanismEn: "",
      risk: "", riskEn: "", takeaway: "", takeawayEn: "", promptExample: "",
      promptShort: "", promptShortEn: "", promptDetailed: "", promptDetailedEn: "",
      promptAdvanced: "", promptAdvancedEn: "",
      quiz: EMPTY_QUIZ, quizEn: EMPTY_QUIZ, scenarioQuiz: EMPTY_QUIZ, scenarioQuizEn: EMPTY_QUIZ,
      applyQuiz: EMPTY_QUIZ, applyQuizEn: EMPTY_QUIZ,
    },
  });

  revalidatePath("/admin/moi-ngay-mot-y-tuong/y-tuong");
  redirect(`/admin/moi-ngay-mot-y-tuong/y-tuong/${id}`);
}
