"use server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function submitPracticeWork(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const linkUrl = String(formData.get("link_url") ?? "").trim();
  if (!title || !content) return { error: "Vui lòng nhập đầy đủ tiêu đề và nội dung." };

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return { error: "Bạn cần đăng nhập để nộp bài." };

  const { error } = await supabase
    .from("submissions")
    .insert({ member_email: email, title, content, link_url: linkUrl || null });

  if (error) return { error: "Không thể nộp bài, vui lòng thử lại." };

  revalidatePath("/portal/practice");
  return { error: null };
}
