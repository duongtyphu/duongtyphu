"use server";

/**
 * Life Profile server actions (Sprint 18.3). Xem
 * `docs/product-bible/BOOK_LIFE_PROFILE.md`.
 *
 * Mọi hành động ở đây đều do người dùng chủ động bấm — không có action
 * nào tự chạy ngầm, không có cron/trigger nào "thu thập" thay họ. RLS
 * trên `members` (`auth.uid() = id`) đảm bảo chỉ chính người dùng mới
 * đọc/sửa được dòng của họ — privacy-first ở tầng dữ liệu, không chỉ ở
 * tầng UI.
 */

import { getSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

async function getAuthedSupabase() {
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;
  return { supabase, userId: user.id };
}

export async function shareDateOfBirth(dateOfBirth: string) {
  const auth = await getAuthedSupabase();
  if (!auth) return { error: "Bạn cần đăng nhập." };
  if (!dateOfBirth) return { error: "Vui lòng chọn một ngày." };

  const { error } = await auth.supabase
    .from("members")
    .update({ date_of_birth: dateOfBirth, date_of_birth_hidden: false })
    .eq("id", auth.userId);
  if (error) return { error: "Không thể lưu, vui lòng thử lại." };

  revalidatePath("/portal/account");
  return { error: null };
}

export async function hideDateOfBirth(hidden: boolean) {
  const auth = await getAuthedSupabase();
  if (!auth) return { error: "Bạn cần đăng nhập." };

  const { error } = await auth.supabase
    .from("members")
    .update({ date_of_birth_hidden: hidden })
    .eq("id", auth.userId);
  if (error) return { error: "Không thể lưu, vui lòng thử lại." };

  revalidatePath("/portal/account");
  return { error: null };
}

export async function deleteDateOfBirth() {
  const auth = await getAuthedSupabase();
  if (!auth) return { error: "Bạn cần đăng nhập." };

  const { error } = await auth.supabase
    .from("members")
    .update({ date_of_birth: null, date_of_birth_hidden: false })
    .eq("id", auth.userId);
  if (error) return { error: "Không thể xoá, vui lòng thử lại." };

  revalidatePath("/portal/account");
  return { error: null };
}
