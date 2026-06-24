"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type Lead = {
  id: number;
  email: string;
  source: string | null;
  status: string;
  created_at: string;
};

export async function listLeads(): Promise<{ leads: Lead[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { leads: [], configured: false };

  const { data } = await supabase
    .from("leads")
    .select("id, email, source, status, created_at")
    .order("created_at", { ascending: false });

  return { leads: data ?? [], configured: true };
}

export async function updateLeadStatus(id: number, status: "new" | "contacted" | "converted") {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { error: "Không thể cập nhật lead, vui lòng thử lại." };

  revalidatePath("/admin/leads");
  return { error: null };
}
