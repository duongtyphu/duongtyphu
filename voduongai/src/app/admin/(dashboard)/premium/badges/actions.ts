"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Giai đoạn 8 (gộp Học viện AI 2.0) — CRUD cho bảng `badges` (typed, KHÔNG
// phải schema generic id/data/status/order — cùng lý do/pattern
// `premium_plans`/`case_studies`/`coupons`, không đi qua
// `/api/admin/collections/[table]`). Bảng này đã tồn tại từ Phase 30
// nhưng CHƯA từng có Server Actions/trang Admin nào — đây là lần đầu.
//
// `course_id` là field DUY NHẤT schema hỗ trợ để gắn tiêu chí trao thưởng
// ("hoàn thành khoá học X") — xem `src/lib/portal/live-badges.ts` để biết
// cơ chế trao tự động (`awardCourseCompletionBadges()`) và GIỚI HẠN THẬT
// (chưa có nơi nào ghi `user_lesson_progress` nên cơ chế này chưa từng tự
// chạy trong thực tế — đã ghi rõ, không che giấu).

export type BadgeRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  course_id: string | null;
  created_at: string;
};

export type BadgeInput = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  course_id: string;
};

export async function listBadges(): Promise<{ badges: BadgeRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { badges: [], configured: false };

  const { data } = await supabase
    .from("badges")
    .select("id, slug, name, description, icon, course_id, created_at")
    .order("created_at", { ascending: false });

  return { badges: data ?? [], configured: true };
}

function revalidateBadgePaths() {
  revalidatePath("/admin/premium/badges");
  revalidatePath("/v2/hoc-vien-ai");
}

export async function createBadge(input: BadgeInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (!slug) return { error: "Vui lòng nhập mã huy hiệu (vd: hoan-thanh-ai-co-ban)." };
  if (!input.name.trim()) return { error: "Vui lòng nhập tên huy hiệu." };

  const { error } = await supabase.from("badges").insert({
    slug,
    name: input.name.trim(),
    description: input.description.trim() || null,
    icon: input.icon.trim() || null,
    course_id: input.course_id || null,
  });
  if (error) return { error: error.code === "23505" ? "Mã huy hiệu này đã tồn tại." : "Không thể tạo huy hiệu, vui lòng thử lại." };

  revalidateBadgePaths();
  return { error: null };
}

export async function updateBadge(id: string, input: BadgeInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.name.trim()) return { error: "Vui lòng nhập tên huy hiệu." };

  const { error } = await supabase
    .from("badges")
    .update({
      name: input.name.trim(),
      description: input.description.trim() || null,
      icon: input.icon.trim() || null,
      course_id: input.course_id || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu huy hiệu, vui lòng thử lại." };

  revalidateBadgePaths();
  return { error: null };
}

export async function deleteBadge(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("badges").delete().eq("id", id);
  if (error) return { error: "Không thể xoá huy hiệu, vui lòng thử lại." };

  revalidateBadgePaths();
  return { error: null };
}
