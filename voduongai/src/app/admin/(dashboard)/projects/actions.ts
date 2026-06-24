"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export type Submission = {
  id: number;
  member_email: string;
  title: string;
  content: string;
  link_url: string | null;
  feedback: string | null;
  status: string;
  created_at: string;
};

function getServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function listSubmissions(): Promise<{ submissions: Submission[]; configured: boolean }> {
  const supabase = getServiceClient();
  if (!supabase) return { submissions: [], configured: false };

  const { data } = await supabase
    .from("submissions")
    .select("id, member_email, title, content, link_url, feedback, status, created_at")
    .order("created_at", { ascending: false });

  return { submissions: data ?? [], configured: true };
}

export async function gradeSubmission(id: number, feedback: string, status: "pending" | "reviewed") {
  const supabase = getServiceClient();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("submissions").update({ feedback, status }).eq("id", id);
  if (error) return { error: "Không thể lưu phản hồi, vui lòng thử lại." };

  revalidatePath("/admin/projects");
  return { error: null };
}
