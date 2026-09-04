import { NextResponse } from "next/server";
import { getLiveMnytTopicById } from "@/lib/portal/live-mnyt";
import { mnytError, mnytNotConfigured } from "@/lib/mnyt/api-helpers";

/** Chi tiết 1 ý tưởng (đầy đủ `content`) — dùng khi client cần fetch lại
 * (vd. Sổ tay ý tưởng gộp nhiều id yêu thích/đã hoàn thành). */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mnytNotConfigured();
  }
  const { id } = await params;
  const topic = await getLiveMnytTopicById(id);
  if (!topic) return mnytError("Không tìm thấy ý tưởng", 404);
  return NextResponse.json(topic);
}
