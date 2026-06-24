"use server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase";

export type CheckoutItemType = "product" | "lesson" | "course";

type CreateOrderResult =
  | { ok: false; error: string }
  | { ok: true; orderId: number; orderCode: string; basePrice: number; finalPrice: number };

export async function createOrder(
  itemType: CheckoutItemType,
  itemId: string | number,
  title: string,
  price: number,
): Promise<CreateOrderResult> {
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return { ok: false, error: "Bạn cần đăng nhập để mua." };

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, error: "Hệ thống thanh toán chưa được cấu hình." };

  const row: Record<string, unknown> = {
    member_email: email,
    product_name: title,
    amount: price,
    status: "pending",
  };
  if (itemType === "lesson") row.lesson_id = itemId;
  else if (itemType === "course") row.course_id = String(itemId);
  else row.product_id = itemId;

  const { data: order, error } = await admin.from("orders").insert(row).select().single();
  if (error || !order) return { ok: false, error: "Không thể tạo đơn hàng, vui lòng thử lại." };

  const orderCode = `VDAI${order.id}`;
  await admin.from("orders").update({ order_code: orderCode }).eq("id", order.id);

  return { ok: true, orderId: order.id as number, orderCode, basePrice: price, finalPrice: price };
}

type ApplyCouponResult =
  | { ok: false; error: string }
  | { ok: true; finalPrice: number; couponCode: string };

export async function applyCoupon(orderId: number, basePrice: number, rawCode: string): Promise<ApplyCouponResult> {
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user?.email) return { ok: false, error: "Bạn cần đăng nhập." };

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, error: "Hệ thống thanh toán chưa được cấu hình." };

  const code = rawCode.trim().toUpperCase();
  const { data: coupon } = await admin.from("coupons").select("*").eq("code", code).eq("active", true).maybeSingle();
  if (!coupon) return { ok: false, error: "Mã giảm giá không hợp lệ hoặc đã hết hiệu lực." };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { ok: false, error: "Mã giảm giá đã hết hạn." };
  }
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return { ok: false, error: "Mã giảm giá đã hết lượt sử dụng." };
  }

  const discount = coupon.discount_type === "percent"
    ? Math.round((basePrice * coupon.discount_value) / 100)
    : coupon.discount_value;
  const finalPrice = Math.max(0, basePrice - discount);

  await admin.from("orders").update({ amount: finalPrice }).eq("id", orderId);
  await admin.from("coupons").update({ used_count: (coupon.used_count || 0) + 1 }).eq("id", coupon.id);

  return { ok: true, finalPrice, couponCode: code };
}

export async function getOrderStatus(orderId: number) {
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return { status: null as string | null };

  const { data } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .eq("member_email", email)
    .maybeSingle();

  return { status: data?.status ?? null };
}
