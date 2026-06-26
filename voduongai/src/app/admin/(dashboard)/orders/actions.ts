"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export type Order = {
  id: number;
  member_email: string;
  product_name: string | null;
  amount: number;
  status: string;
  order_code: string | null;
  created_at: string;
};

export async function listOrders(): Promise<{ orders: Order[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { orders: [], configured: false };

  const { data } = await supabase
    .from("orders")
    .select("id, member_email, product_name, amount, status, order_code, created_at")
    .order("created_at", { ascending: false });

  return { orders: data ?? [], configured: true };
}

export async function updateOrderStatus(id: number, status: "pending" | "confirmed" | "rejected") {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return { error: "Không thể cập nhật đơn hàng, vui lòng thử lại." };

  revalidatePath("/admin/orders");
  return { error: null };
}
