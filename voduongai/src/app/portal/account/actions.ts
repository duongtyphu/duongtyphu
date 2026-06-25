"use server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const birthday = String(formData.get("birthday") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const fbUrl = String(formData.get("fb_url") ?? "").trim();
  const occupation = String(formData.get("occupation") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const goal = String(formData.get("goal") ?? "").trim();

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { error: "Bạn cần đăng nhập." };

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName, phone, birthday, gender, fb_url: fbUrl, occupation, bio, goal },
  });
  if (error) return { error: "Không thể lưu thông tin, vui lòng thử lại." };

  if (fullName) {
    await supabase.from("members").update({ full_name: fullName }).eq("id", user.id);
  }

  revalidatePath("/portal/account");
  return { error: null };
}
