"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { revalidatePath } from "next/cache";

export type Coupon = {
  id: number;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
};

export async function listCoupons(): Promise<{ coupons: Coupon[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { coupons: [], configured: false };

  const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  return { coupons: data ?? [], configured: true };
}

export async function createCoupon(formData: FormData) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const discount_type = String(formData.get("discount_type") ?? "percent");
  const discount_value = Number(formData.get("discount_value") ?? 0);
  const maxUsesRaw = String(formData.get("max_uses") ?? "").trim();
  const expiresRaw = String(formData.get("expires_at") ?? "").trim();

  if (!code) return { error: "Vui lòng nhập mã giảm giá." };
  if (!discount_value || discount_value <= 0) return { error: "Giá trị giảm giá phải lớn hơn 0." };

  const { error } = await supabase.from("coupons").insert({
    code,
    discount_type,
    discount_value,
    max_uses: maxUsesRaw ? Number(maxUsesRaw) : null,
    expires_at: expiresRaw ? new Date(expiresRaw).toISOString() : null,
    active: true,
  });

  if (error) {
    if (error.code === "23505") return { error: "Mã giảm giá này đã tồn tại." };
    return { error: "Không thể tạo mã giảm giá, vui lòng thử lại." };
  }

  revalidatePath("/admin/coupons");
  return { error: null };
}

export async function toggleCouponActive(id: number, active: boolean) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("coupons").update({ active }).eq("id", id);
  if (error) return { error: "Không thể cập nhật mã giảm giá." };

  revalidatePath("/admin/coupons");
  return { error: null };
}

export async function deleteCoupon(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { error: "Không thể xoá mã giảm giá." };

  revalidatePath("/admin/coupons");
  return { error: null };
}
