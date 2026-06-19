// Supabase Edge Function — gửi email chào mừng khi có thành viên mới
// Trigger: Database Webhook trên bảng `members`, event INSERT
// Deploy: supabase functions deploy send-welcome-email
// Secret cần thiết: RESEND_API_KEY (Project Settings > Edge Functions > Secrets)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const FROM_EMAIL = "VDAI Academy <onboarding@resend.dev>"; // TODO: OWNER INPUT — đổi sang domain riêng đã verify trên Resend khi có domain

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const member = payload.record; // { id, email, full_name, referral_code, ... }
    if (!member?.email) {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    const firstName = (member.full_name || member.email.split("@")[0]).split(" ")[0];
    const referralLink = `https://vdaiacademy.com/register.html?ref=${member.referral_code ?? ""}`;

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
        <h2 style="color:#2563EB">Chào ${firstName}, chào mừng bạn đến với VDAI Academy! 🎉</h2>
        <p>Tài khoản của bạn đã được tạo thành công. Đăng nhập vào trang thành viên để nhận tài liệu, mini-course miễn phí và theo dõi lịch khai giảng VDAI SOLO &amp; SCALE.</p>
        <p style="margin:24px 0">
          <a href="https://vdaiacademy.com/portal.html" style="background:#2563EB;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:700">Vào trang thành viên →</a>
        </p>
        <p>Mã giới thiệu của bạn: <b>${member.referral_code ?? ""}</b><br>
        Mỗi bạn bè đăng ký khóa học qua link giới thiệu, bạn nhận được hoa hồng:<br>
        <a href="${referralLink}">${referralLink}</a></p>
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
        to: member.email,
        subject: "Chào mừng bạn đến với VDAI Academy 🎉",
        html,
      }),
    });

    const ok = resendResp.ok;
    await supabaseAdmin.from("email_log").insert({
      member_id: member.id,
      email_type: "welcome",
      status: ok ? "sent" : "failed",
      detail: ok ? null : await resendResp.text(),
    });

    return new Response(JSON.stringify({ ok }), { status: ok ? 200 : 500 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
