"use server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function submitSupportTicket(formData: FormData) {
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!subject || !message) return { error: "Vui lòng nhập đầy đủ tiêu đề và nội dung." };

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return { error: "Bạn cần đăng nhập để gửi yêu cầu hỗ trợ." };

  const { error } = await supabase
    .from("support_tickets")
    .insert({ member_email: email, subject, message });

  if (error) return { error: "Không thể gửi yêu cầu, vui lòng thử lại." };

  revalidatePath("/portal/support");
  return { error: null };
}
