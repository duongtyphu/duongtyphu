import { NextResponse } from "next/server";
import { getLiveMnytCategories } from "@/lib/portal/live-mnyt";
import { mnytNotConfigured } from "@/lib/mnyt/api-helpers";

/** 35 lĩnh vực — nhẹ, không cần phân trang thật (đúng số lượng cố định của
 * thiết kế), vẫn đi qua API riêng để giữ đúng kiến trúc "đọc qua API". */
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mnytNotConfigured();
  }
  const items = await getLiveMnytCategories();
  return NextResponse.json({ items, total: items.length });
}
