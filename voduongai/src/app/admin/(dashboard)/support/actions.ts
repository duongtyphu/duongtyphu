"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export type Ticket = {
  id: number;
  member_email: string;
  subject: string;
  message: string;
  reply: string | null;
  status: string;
  created_at: string;
};

export async function listTickets(): Promise<{ tickets: Ticket[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { tickets: [], configured: false };

  const { data } = await supabase
    .from("support_tickets")
    .select("id, member_email, subject, message, reply, status, created_at")
    .order("created_at", { ascending: false });

  return { tickets: data ?? [], configured: true };
}

export async function replyTicket(id: number, reply: string, status: "open" | "replied" | "closed") {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("support_tickets").update({ reply, status }).eq("id", id);
  if (error) return { error: "Không thể lưu phản hồi, vui lòng thử lại." };

  revalidatePath("/admin/support");
  return { error: null };
}
