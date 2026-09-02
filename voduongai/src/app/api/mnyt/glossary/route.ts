import { NextResponse } from "next/server";
import { getLiveMnytGlossary } from "@/lib/portal/live-mnyt";
import { mnytNotConfigured } from "@/lib/mnyt/api-helpers";

/** 100 thuật ngữ — nhẹ, đọc trọn (Từ điển tự lọc/tìm ở client trên tập đã
 * tải), vẫn qua API riêng thay vì file tĩnh, đúng kiến trúc đã chốt. */
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mnytNotConfigured();
  }
  const items = await getLiveMnytGlossary();
  return NextResponse.json({ items, total: items.length });
}
