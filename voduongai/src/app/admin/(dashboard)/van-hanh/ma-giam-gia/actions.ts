"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Mã giảm giá — bảng `coupons` (typed, KHÔNG phải schema generic
// id/data/status/order) nên không đi qua /api/admin/collections/[table] —
// cùng lý do/pattern với `case_studies`/`courses`. ĐÍNH CHÍNH quan trọng so
// với ghi chú cũ trong nav.ts/WorkspacePlaceholder ("chưa có code nào đọc/
// ghi bảng này"): audit lại (grep trực tiếp, không tin ghi chú cũ) xác nhận
// `src/app/portal/checkout/actions.ts`'s `applyCoupon()` ĐÃ đọc/ghi bảng
// này thật (validate code/active/expires_at/max_uses, trừ tiền vào
// `orders.amount`, tăng `used_count`) — coupon KHÔNG phải schema mồ côi,
// là tính năng thật đang chạy (2 dòng dữ liệu thật, 1 dòng đã có
// used_count=2). Vì vậy CRUD thật ở đây là hợp lệ, không phải "CRUD giả".

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

export type CouponInput = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  max_uses: number | null;
  expires_at: string | null;
  active: boolean;
};

export async function listCoupons(): Promise<{ coupons: Coupon[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { coupons: [], configured: false };

  const { data } = await supabase
    .from("coupons")
    .select("id, code, discount_type, discount_value, max_uses, used_count, expires_at, active, created_at")
    .order("created_at", { ascending: false });

  return { coupons: (data ?? []) as Coupon[], configured: true };
}

export async function createCoupon(input: CouponInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const code = input.code.trim().toUpperCase();
  if (!code) return { error: "Vui lòng nhập mã." };
  if (!input.discount_value || input.discount_value <= 0) return { error: "Giá trị giảm giá phải lớn hơn 0." };

  const { error } = await supabase.from("coupons").insert({
    code,
    discount_type: input.discount_type,
    discount_value: input.discount_value,
    max_uses: input.max_uses,
    expires_at: input.expires_at,
    active: input.active,
  });
  if (error) return { error: error.code === "23505" ? "Mã này đã tồn tại." : "Không thể tạo mã, vui lòng thử lại." };

  revalidatePath("/admin/van-hanh/ma-giam-gia");
  return { error: null };
}

export async function updateCoupon(id: number, input: CouponInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("coupons")
    .update({
      code: input.code.trim().toUpperCase(),
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      max_uses: input.max_uses,
      expires_at: input.expires_at,
      active: input.active,
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu mã, vui lòng thử lại." };

  revalidatePath("/admin/van-hanh/ma-giam-gia");
  return { error: null };
}

export async function deleteCoupon(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { error: "Không thể xoá mã, vui lòng thử lại." };

  revalidatePath("/admin/van-hanh/ma-giam-gia");
  return { error: null };
}
