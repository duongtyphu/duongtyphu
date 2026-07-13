"use server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase";

export type CheckoutItemType = "product" | "lesson" | "course";

type CreateOrderResult =
  | { ok: false; error: string }
  | { ok: true; orderId: number; orderCode: string; basePrice: number; finalPrice: number };

const ITEM_TABLE: Record<CheckoutItemType, string> = {
  product: "products",
  lesson: "lessons",
  course: "courses",
};

// Looks up the authoritative price server-side instead of trusting the
// client-supplied `price` — otherwise anyone could buy any item for any
// price by editing the checkout URL before submitting.
async function lookupAuthoritativePrice(
  admin: ReturnType<typeof getSupabaseAdmin>,
  itemType: CheckoutItemType,
  itemId: string | number,
): Promise<number | null> {
  if (!admin) return null;

  // PMO-HARDENING-CONT Workstream 5: một khoá "coming" (chưa mở bán) trước đây
  // chỉ bị ẩn CTA ở UI (PremiumProgramCard.tsx) — không có gì chặn ở tầng dữ
  // liệu, nên ai gọi thẳng /portal/checkout?type=course&id=N vẫn tạo được đơn
  // và xem được nội dung sau xác nhận. Chặn thật ở đây.
  if (itemType === "course") {
    const { data, error } = await admin.from("courses").select("price, status").eq("id", itemId).maybeSingle();
    if (error || !data || typeof data.price !== "number" || data.status !== "open") return null;
    return data.price;
  }

  const { data, error } = await admin
    .from(ITEM_TABLE[itemType])
    .select("price")
    .eq("id", itemId)
    .maybeSingle();
  if (error || !data || typeof data.price !== "number") return null;
  return data.price;
}

export async function createOrder(
  itemType: CheckoutItemType,
  itemId: string | number,
  title: string,
  price: number,
  customerName: string,
  customerPhone: string,
): Promise<CreateOrderResult> {
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return { ok: false, error: "Bạn cần đăng nhập để mua." };
  if (!customerName.trim() || !customerPhone.trim()) {
    return { ok: false, error: "Vui lòng nhập đầy đủ họ tên và số điện thoại." };
  }

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, error: "Hệ thống thanh toán chưa được cấu hình." };

  const realPrice = await lookupAuthoritativePrice(admin, itemType, itemId);
  if (realPrice === null) return { ok: false, error: "Không xác định được sản phẩm hoặc giá, vui lòng thử lại." };

  const row: Record<string, unknown> = {
    member_email: email,
    product_name: title,
    amount: realPrice,
    status: "pending",
    customer_name: customerName.trim(),
    customer_phone: customerPhone.trim(),
  };
  if (itemType === "lesson") row.lesson_id = itemId;
  else if (itemType === "course") row.course_id = String(itemId);
  else row.product_id = itemId;

  const { data: order, error } = await admin.from("orders").insert(row).select().single();
  if (error || !order) return { ok: false, error: "Không thể tạo đơn hàng, vui lòng thử lại." };

  const orderCode = `VDAI${order.id}`;
  await admin.from("orders").update({ order_code: orderCode }).eq("id", order.id);

  return { ok: true, orderId: order.id as number, orderCode, basePrice: realPrice, finalPrice: realPrice };
}

type ApplyCouponResult =
  | { ok: false; error: string }
  | { ok: true; finalPrice: number; couponCode: string };

export async function applyCoupon(orderId: number, rawCode: string): Promise<ApplyCouponResult> {
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return { ok: false, error: "Bạn cần đăng nhập." };

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, error: "Hệ thống thanh toán chưa được cấu hình." };

  // Re-fetch the order's real amount scoped to this user — never trust a
  // client-supplied basePrice, and never let one user touch another's order.
  const { data: order } = await supabase
    .from("orders")
    .select("amount, status")
    .eq("id", orderId)
    .eq("member_email", email)
    .maybeSingle();
  if (!order) return { ok: false, error: "Không tìm thấy đơn hàng." };
  if (order.status !== "pending") return { ok: false, error: "Đơn hàng đã được xử lý, không thể áp mã." };
  const basePrice = order.amount;

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

export type OrderRecord = {
  id: number;
  order_code: string | null;
  product_name: string | null;
  amount: number;
  status: string;
};

export async function getOrder(orderId: number): Promise<OrderRecord | null> {
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return null;

  const { data } = await supabase
    .from("orders")
    .select("id, order_code, product_name, amount, status")
    .eq("id", orderId)
    .eq("member_email", email)
    .maybeSingle();

  return data ?? null;
}
