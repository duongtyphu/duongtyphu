import { getSupabaseAdmin } from "@/lib/supabase";
import { tableForCollection } from "@/lib/admin/supabaseCollections";
import { requireMember } from "@/lib/admin/requireAdmin";

/**
 * Đọc dữ liệu 1 collection trực tiếp trong Server Component — gọi thẳng
 * requireMember()/getSupabaseAdmin()/tableForCollection(), đúng những hàm mà
 * GET /api/admin/collections/[table] cũng dùng, KHÔNG tự fetch() tới chính
 * API route của app. Self-referential fetch tới cùng deployment đã xác nhận
 * không đáng tin cậy trên Vercel serverless — Supabase API logs cho thấy
 * request chưa từng chạm bảng khi dùng cách cũ (fetch() nội bộ fail trước
 * khi tới Supabase, khiến DataTable crash ở /admin/tools).
 */
export async function fetchCollection<T = Record<string, unknown>>(collectionKey: string): Promise<T[]> {
  if (!(await requireMember())) return [];

  const table = tableForCollection(collectionKey);
  if (!table) return [];

  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(table)
    .select("id, data, order")
    .order("order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return [];

  return (data ?? []).map((row) => ({ ...(row.data as Record<string, unknown>), id: row.id })) as T[];
}
