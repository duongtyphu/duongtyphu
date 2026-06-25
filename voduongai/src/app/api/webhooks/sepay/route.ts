import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// SePay webhook payload: https://docs.sepay.vn/tich-hop-webhooks.html
// Sends one row per matched bank transaction. We match it back to an order
// by parsing the "VDAI<id>" order code out of the transfer content.
type SePayPayload = {
  transferAmount?: number;
  transferType?: "in" | "out";
  content?: string;
  code?: string | null;
  referenceCode?: string;
};

export async function POST(request: Request) {
  const expectedKey = process.env.SEPAY_WEBHOOK_API_KEY;
  if (!expectedKey) {
    console.error("SEPAY_WEBHOOK_API_KEY is not configured — rejecting webhook call");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Apikey ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: SePayPayload | null = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (body.transferType !== "in") {
    return NextResponse.json({ ok: true, skipped: "not an inbound transfer" });
  }

  const text = `${body.code ?? ""} ${body.content ?? ""}`.toUpperCase();
  const match = text.match(/VDAI(\d+)/);
  if (!match) {
    return NextResponse.json({ ok: true, skipped: "no order code found" });
  }

  const orderId = Number(match[1]);
  const amount = Number(body.transferAmount ?? 0);

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data: order, error: lookupError } = await supabase
    .from("orders")
    .select("id, amount, status")
    .eq("id", orderId)
    .maybeSingle();

  if (lookupError) {
    console.error("SePay webhook: order lookup failed", lookupError);
    return NextResponse.json({ error: "Order lookup failed" }, { status: 500 });
  }
  if (!order) return NextResponse.json({ ok: true, skipped: "order not found" });
  if (order.status === "confirmed") return NextResponse.json({ ok: true, skipped: "already confirmed" });
  if (amount !== order.amount) {
    // Leave status untouched (pending) so an admin reconciles the mismatch manually
    // instead of auto-confirming an underpaid/overpaid transfer.
    console.error("SePay webhook: amount mismatch — left pending for manual review", {
      orderId,
      expected: order.amount,
      received: amount,
      referenceCode: body.referenceCode,
    });
    return NextResponse.json({
      ok: true,
      skipped: "amount mismatch — left pending for manual review",
      expected: order.amount,
      received: amount,
    });
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "confirmed", payment_reference: body.referenceCode ?? null })
    .eq("id", orderId);

  if (error) {
    console.error("SePay webhook: failed to confirm order", { orderId, error });
    return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orderId });
}
