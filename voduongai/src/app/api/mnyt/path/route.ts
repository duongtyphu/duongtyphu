import { getLiveMnytPathTopics } from "@/lib/portal/live-mnyt";
import { mnytError, mnytJson, mnytNotConfigured } from "@/lib/mnyt/api-helpers";

/**
 * `/api/mnyt/path?category=<key>` — toàn bộ ý tưởng của 1 lĩnh vực, sắp
 * theo `path_step` thật. Dùng bởi `MnytPathClient.tsx` mỗi lần đổi lĩnh
 * vực đang xem (SSR chỉ tải sẵn lĩnh vực mặc định) — gọi lại ĐÚNG
 * `getLiveMnytPathTopics()`, cùng hàm Server Component dùng cho SSR trang
 * đầu (Single Source of Truth, giống `/api/mnyt/topics`).
 */
export async function GET(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mnytNotConfigured();
  }

  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  if (!category) return mnytError("Thiếu tham số category", 400);

  const items = await getLiveMnytPathTopics(category);
  return mnytJson(items, { page: 1, pageSize: items.length, total: items.length });
}
