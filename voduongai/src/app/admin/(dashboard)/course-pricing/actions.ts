"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export type CoursePricing = {
  id: number;
  name: string;
  status: string;
  price: number;
};

export async function listCoursePricing(): Promise<{ courses: CoursePricing[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { courses: [], configured: false };

  const { data } = await supabase.from("courses").select("id, name, status, price").order("name", { ascending: true });

  return { courses: data ?? [], configured: true };
}

export async function updateCoursePrice(id: number, price: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!Number.isFinite(price) || price < 0) return { error: "Giá không hợp lệ." };

  const { error } = await supabase.from("courses").update({ price }).eq("id", id);
  if (error) return { error: "Không thể cập nhật giá, vui lòng thử lại." };

  revalidatePath("/admin/course-pricing");
  revalidatePath("/portal/vdai-academy");
  revalidatePath("/portal/premium");
  return { error: null };
}

/**
 * Bật/tắt mở bán một khoá học từ Admin — trang /portal/premium đọc cột
 * `courses.status`: 'open' = hiện CTA thanh toán, mọi giá trị khác
 * ('coming'...) = card hiển thị "Sắp mở đăng ký". Không cần sửa code khi
 * mở/đóng đăng ký nữa.
 */
const COURSE_STATUSES = ["open", "coming"] as const;

export async function updateCourseStatus(id: number, status: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!(COURSE_STATUSES as readonly string[]).includes(status)) {
    return { error: "Trạng thái không hợp lệ." };
  }

  const { error } = await supabase.from("courses").update({ status }).eq("id", id);
  if (error) return { error: "Không thể cập nhật trạng thái, vui lòng thử lại." };

  revalidatePath("/admin/course-pricing");
  revalidatePath("/portal/vdai-academy");
  revalidatePath("/portal/premium");
  return { error: null };
}
