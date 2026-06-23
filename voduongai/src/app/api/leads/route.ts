import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const source = typeof body?.source === "string" ? body.source : "unknown";

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmail) {
    return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("[lead] Supabase chưa được cấu hình, chỉ log ra console");
    console.log(`[lead] ${email} — source: ${source}`);
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase
    .from("leads")
    .insert({ email, source, status: "new" });

  if (error) {
    console.error("[lead] Supabase insert error:", error.message);
    return NextResponse.json({ error: "Không thể lưu email, vui lòng thử lại" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
