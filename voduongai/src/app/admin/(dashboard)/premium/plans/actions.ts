"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Phase 38 — 3 gói Premium thuê bao (`/v2/premium`, "Bản thử 2.0") thay thế
// "5 chương trình mua đứt" (`courses`/`/admin/course-pricing`, GIỮ NGUYÊN
// không đổi — vẫn phục vụ Portal 1.0). Bảng `premium_plans` typed (không
// phải schema generic `id/data/status/order`) vì checkout đọc thẳng cột
// `price` — cùng lý do/pattern `coupons`/`case_studies`/`courses`, không đi
// qua `/api/admin/collections/[table]`.

export type PremiumPlanRow = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  original_price: number | null;
  duration_days: number;
  features: string[];
  is_featured: boolean;
  cta_label: string;
  status: "Draft" | "Published";
  order: number;
};

export type PremiumPlanInput = {
  name: string;
  subtitle: string;
  price: number;
  original_price: number | null;
  duration_days: number;
  features: string[];
  is_featured: boolean;
  cta_label: string;
  status: "Draft" | "Published";
  order: number;
};

export async function listPremiumPlans(): Promise<{ plans: PremiumPlanRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { plans: [], configured: false };

  const { data } = await supabase
    .from("premium_plans")
    .select("id, name, subtitle, price, original_price, duration_days, features, is_featured, cta_label, status, order")
    .order("order", { ascending: true });

  return { plans: (data ?? []) as PremiumPlanRow[], configured: true };
}

export async function createPremiumPlan(id: string, input: PremiumPlanInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const planId = id.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (!planId) return { error: "Vui lòng nhập mã gói (vd: premium-thang)." };
  if (!input.name.trim()) return { error: "Vui lòng nhập tên gói." };
  if (!input.price || input.price <= 0) return { error: "Giá phải lớn hơn 0." };
  if (!input.duration_days || input.duration_days <= 0) return { error: "Số ngày hiệu lực phải lớn hơn 0." };

  const { error } = await supabase.from("premium_plans").insert({
    id: planId,
    name: input.name.trim(),
    subtitle: input.subtitle.trim(),
    price: input.price,
    original_price: input.original_price,
    duration_days: input.duration_days,
    features: input.features,
    is_featured: input.is_featured,
    cta_label: input.cta_label.trim() || "Chọn gói",
    status: input.status,
    order: input.order,
  });
  if (error) return { error: error.code === "23505" ? "Mã gói này đã tồn tại." : "Không thể tạo gói, vui lòng thử lại." };

  revalidatePath("/admin/premium/plans");
  revalidatePath("/v2/premium");
  return { error: null };
}

export async function updatePremiumPlan(id: string, input: PremiumPlanInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("premium_plans")
    .update({
      name: input.name.trim(),
      subtitle: input.subtitle.trim(),
      price: input.price,
      original_price: input.original_price,
      duration_days: input.duration_days,
      features: input.features,
      is_featured: input.is_featured,
      cta_label: input.cta_label.trim() || "Chọn gói",
      status: input.status,
      order: input.order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu gói, vui lòng thử lại." };

  revalidatePath("/admin/premium/plans");
  revalidatePath("/v2/premium");
  return { error: null };
}

export async function deletePremiumPlan(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("premium_plans").delete().eq("id", id);
  if (error) return { error: "Không thể xoá gói, vui lòng thử lại." };

  revalidatePath("/admin/premium/plans");
  revalidatePath("/v2/premium");
  return { error: null };
}
