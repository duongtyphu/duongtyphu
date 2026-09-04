import { getLiveMnytTopicsPage, clampMnytPageSize } from "@/lib/portal/live-mnyt";
import { mnytJson, mnytNotConfigured } from "@/lib/mnyt/api-helpers";

/**
 * `/api/mnyt/topics` — README bàn giao ("Mỗi ngày một ý tưởng") yêu cầu
 * tường minh: "Hãy build API thật: `/api/topics` có phân trang + lọc...
 * không tải hết 446 ý tưởng chỉ để hiển thị một." Đặt dưới `/api/mnyt/*`
 * (không phải bare `/api/topics`) vì đây là 1 portal dùng chung nhiều
 * module — namespace theo tính năng, khớp convention `/api/v1/ckos/*` đã
 * có trong dự án, tránh xung đột route với module khác trong tương lai.
 *
 * Dùng cho: (1) nút "tải thêm" ở Kho ý tưởng (client-side fetch trang kế
 * tiếp), (2) mọi nơi khác cần đọc topics đều gọi thẳng
 * `getLiveMnytTopicsPage()` (Server Component, không qua HTTP round-trip)
 * — 2 đường đọc dùng chung ĐÚNG 1 hàm, không lệch logic lọc.
 */
export async function GET(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mnytNotConfigured();
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const pageSize = clampMnytPageSize(Number(url.searchParams.get("pageSize")));

  const { items, total } = await getLiveMnytTopicsPage({
    page,
    pageSize,
    categoryKey: url.searchParams.get("category"),
    difficulty: url.searchParams.get("difficulty"),
    tool: url.searchParams.get("tool"),
    isTrending: url.searchParams.get("trending") === "1",
    q: url.searchParams.get("q"),
  });

  return mnytJson(items, { page, pageSize, total });
}
