import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Việc 10 — /portal/hocvienai, khối "Câu hỏi thường gặp". Thay mảng tĩnh
 * `FAQ` (khai báo inline trong `page.tsx`) bằng bảng `hocvienai_faq`
 * (quản qua /admin/hocvienai/faq). Cùng pattern `live-tools.ts` —
 * `getSupabasePublic()` + `cache()`, an toàn cả Server Component.
 */
/**
 * Phase 28 (Schema v2, Bước 1): key trong `data` jsonb đổi `q`->`question`,
 * `a`->`answer` (đúng convention đặt tên của mọi bảng khác — `q`/`a` 1 ký tự
 * là ngoại lệ duy nhất trong dự án). Đây là KEY trong jsonb, KHÔNG phải cột
 * — xem supabase-phase28-schema-v2-step1-alter.sql. Vẫn fallback về key cũ
 * để dòng nào chưa migrate không mất nội dung.
 */
export type HocvienaiFaqItem = { id: string; question: string; answer: string };

export const getLiveHocvienaiFaq = cache(async (): Promise<HocvienaiFaqItem[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("hocvienai_faq")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      question: String(d.question ?? d.q ?? ""),
      answer: String(d.answer ?? d.a ?? ""),
    };
  });
});
