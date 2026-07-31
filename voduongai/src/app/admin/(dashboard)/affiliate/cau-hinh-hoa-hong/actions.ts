"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Cấu hình mức hoa hồng theo sản phẩm — bảng `affiliate_commission_rules`
// (typed, đề xuất ở supabase-phase27-affiliate-program.sql, CHƯA apply).
// Cùng pattern Server Actions riêng như `coupons`/`case_studies` (không qua
// /api/admin/collections/[table] vì đây là bảng typed, không phải schema
// generic id/data/status/order).

export type CommissionRule = {
  id: number;
  product_type: "course" | "product" | "lesson";
  product_id: string;
  product_label: string | null;
  commission_rate: number;
  created_at: string;
  updated_at: string;
};

export type CommissionRuleInput = {
  product_type: "course" | "product" | "lesson";
  product_id: string;
  product_label: string;
  commission_rate: number;
};

export async function listCommissionRules(): Promise<{ rules: CommissionRule[]; configured: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rules: [], configured: false, error: null };

  const { data, error } = await supabase
    .from("affiliate_commission_rules")
    .select("id, product_type, product_id, product_label, commission_rate, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      rules: [],
      configured: true,
      error:
        error.code === "42P01"
          ? "Bảng affiliate_commission_rules chưa tồn tại — chờ Founder duyệt migration."
          : error.message,
    };
  }

  return { rules: (data ?? []) as CommissionRule[], configured: true, error: null };
}

function validateInput(input: CommissionRuleInput): string | null {
  if (!input.product_id.trim()) return "Vui lòng nhập ID sản phẩm.";
  if (input.commission_rate < 0 || input.commission_rate > 1) return "Mức hoa hồng phải trong khoảng 0-100%.";
  return null;
}

export async function createCommissionRule(input: CommissionRuleInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const validationError = validateInput(input);
  if (validationError) return { error: validationError };

  const { error } = await supabase.from("affiliate_commission_rules").insert({
    product_type: input.product_type,
    product_id: input.product_id.trim(),
    product_label: input.product_label.trim() || null,
    commission_rate: input.commission_rate,
  });

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Đã có cấu hình cho sản phẩm này."
          : error.code === "42P01"
            ? "Bảng affiliate_commission_rules chưa tồn tại — chờ Founder duyệt migration."
            : "Không thể tạo cấu hình, vui lòng thử lại.",
    };
  }

  revalidatePath("/admin/affiliate/cau-hinh-hoa-hong");
  return { error: null };
}

export async function updateCommissionRule(id: number, input: CommissionRuleInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const validationError = validateInput(input);
  if (validationError) return { error: validationError };

  const { error } = await supabase
    .from("affiliate_commission_rules")
    .update({
      product_type: input.product_type,
      product_id: input.product_id.trim(),
      product_label: input.product_label.trim() || null,
      commission_rate: input.commission_rate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "Không thể cập nhật cấu hình, vui lòng thử lại." };

  revalidatePath("/admin/affiliate/cau-hinh-hoa-hong");
  return { error: null };
}

export async function deleteCommissionRule(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("affiliate_commission_rules").delete().eq("id", id);
  if (error) return { error: "Không thể xoá cấu hình, vui lòng thử lại." };

  revalidatePath("/admin/affiliate/cau-hinh-hoa-hong");
  return { error: null };
}
