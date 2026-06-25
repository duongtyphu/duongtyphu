// Supabase Edge Function — nhận webhook SePay khi có tiền chuyển khoản vào
// và tự động xác nhận đơn hàng tương ứng (không cần admin bấm tay nữa).
// Deploy: supabase functions deploy sepay-webhook --no-verify-jwt
// Secret cần thiết: SEPAY_API_KEY (cùng giá trị đã khai báo trong SePay Dashboard
// ở mục Webhook > Authorization Type: API Key)
//
// Cấu hình trên SePay Dashboard (https://my.sepay.vn):
//   Tích hợp > Webhooks > Thêm Webhook
//   - URL: https://<project-ref>.supabase.co/functions/v1/sepay-webhook
//   - Loại xác thực: API Key
//   - API Key: (giá trị bất kỳ do bạn tạo, dán y nguyên vào secret SEPAY_API_KEY)
//
// SePay sẽ gửi POST với header: Authorization: Apikey <SEPAY_API_KEY>
// Payload mẫu: { content: "VDAI123 ...", transferAmount: 300000, transferType: "in", ... }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SEPAY_API_KEY = Deno.env.get("SEPAY_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (authHeader !== `Apikey ${SEPAY_API_KEY}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const payload = await req.json();

    // Chỉ xử lý tiền vào (transferType === "in")
    if (payload.transferType !== "in") {
      return new Response(JSON.stringify({ skipped: true, reason: "not_inbound" }), { status: 200 });
    }

    // Tìm mã đơn hàng dạng VDAI<id> trong nội dung chuyển khoản
    const match = String(payload.content ?? "").match(/VDAI(\d+)/i);
    if (!match) {
      return new Response(JSON.stringify({ skipped: true, reason: "no_order_code" }), { status: 200 });
    }

    const orderCode = `VDAI${match[1]}`;
    const transferAmount = Number(payload.transferAmount ?? 0);

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, amount, status")
      .eq("order_code", orderCode)
      .maybeSingle();

    if (!order) {
      return new Response(JSON.stringify({ skipped: true, reason: "order_not_found" }), { status: 200 });
    }

    if (order.status !== "pending") {
      return new Response(JSON.stringify({ skipped: true, reason: "already_processed" }), { status: 200 });
    }

    if (transferAmount < order.amount) {
      return new Response(JSON.stringify({ skipped: true, reason: "amount_mismatch" }), { status: 200 });
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", order.id);

    if (error) {
      return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, order_id: order.id }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
