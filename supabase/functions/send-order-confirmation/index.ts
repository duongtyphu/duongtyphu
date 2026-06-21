// Supabase Edge Function — gửi email xác nhận đơn hàng + nhắc khai giảng
// Trigger: Database Webhook trên bảng `orders`, event UPDATE
// Chỉ gửi khi status đổi thành 'confirmed' (kiểm tra trong payload.old_record/record)
// Deploy: supabase functions deploy send-order-confirmation
// Secret cần thiết: RESEND_API_KEY (Project Settings > Edge Functions > Secrets)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const FROM_EMAIL = "VDAI Academy <onboarding@resend.dev>";
const SITE_URL = "https://v-academy-mauve.vercel.app";

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const order = payload.record;
    const oldOrder = payload.old_record;

    // Chỉ xử lý khi status vừa chuyển thành 'confirmed'
    if (!order || order.status !== "confirmed" || oldOrder?.status === "confirmed") {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    const { data: member } = await supabaseAdmin
      .from("members")
      .select("id, full_name")
      .eq("email", order.member_email)
      .maybeSingle();

    const firstName = (member?.full_name || order.member_email.split("@")[0]).split(" ")[0];

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
        <h2 style="color:#16A34A">Đơn hàng của bạn đã được xác nhận ✅</h2>
        <p>Chào ${firstName}, đơn hàng <b>${order.product_name ?? "sản phẩm"}</b> đã được xác nhận thành công.</p>
        <p style="margin:24px 0">
          <a href="${SITE_URL}/portal.html" style="background:#16A34A;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:700">Vào trang thành viên để học ngay →</a>
        </p>
        <p>Nếu khoá học chưa khai giảng, đội ngũ VDAI Academy sẽ nhắc lịch khai giảng qua Zalo trước 1-2 ngày.</p>
        <p style="color:#64748B;font-size:0.85rem;margin-top:32px">VDAI Academy — Vận hành tinh gọn. Nhân bản mạnh mẽ.</p>
      </div>`;

    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: order.member_email,
        subject: "Đơn hàng VDAI Academy đã được xác nhận ✅",
        html,
      }),
    });

    const ok = resendResp.ok;
    await supabaseAdmin.from("email_log").insert({
      member_id: member?.id ?? null,
      email_type: "order_confirmation",
      status: ok ? "sent" : "failed",
      detail: ok ? null : await resendResp.text(),
    });

    return new Response(JSON.stringify({ ok }), { status: ok ? 200 : 500 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
