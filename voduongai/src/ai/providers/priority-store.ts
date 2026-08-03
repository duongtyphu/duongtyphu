/**
 * AI Provider Priority — đọc thứ tự ưu tiên Provider do Founder tự cấu
 * hình qua Admin (`/admin/he-thong/uu-tien-ai`, bảng `ai_provider_priority`,
 * xem `supabase-phase29-ai-provider-priority.sql`). Dùng `getSupabasePublic()`
 * (không phụ thuộc `cookies()`) vì `provider-manager.ts::execute()` được
 * gọi từ nhiều ngữ cảnh khác nhau (Companion chat, writer-agent,
 * reviewer-agent...), không phải lúc nào cũng có request context.
 *
 * Fallback graceful khi Supabase chưa cấu hình/lỗi/bảng rỗng —
 * `DEFAULT_PRIORITY_ORDER` là thứ tự Founder xác nhận (Gemini mặc định →
 * Groq → OpenRouter → phần còn lại như lưới an toàn mở rộng → Mock chỉ
 * khi mọi Provider thật đều lỗi), khớp đúng thứ tự seed trong
 * `supabase-phase29-ai-provider-priority.sql` — CHỦ ĐỘNG active ngay cả
 * khi bảng chưa apply, vì đây chính là hành vi Companion đang chạy thật
 * cho tới khi migration được duyệt.
 */
import "server-only";
import { getSupabasePublic } from "@/lib/supabase";

const TABLE = "ai_provider_priority";

/** Khớp đúng 12 providerId thật trong registry.ts (không tính "mock" —
    Mock KHÔNG nằm trong danh sách này, chỉ được chọn ở bước fallback
    cuối cùng của ModelRouter khi không còn Provider thật nào khả dụng).
    Thứ tự: Gemini (mặc định) → Groq (fallback nhanh) → OpenRouter
    (fallback nhiều model) → các Provider còn lại (lưới an toàn mở rộng,
    chỉ dùng nếu cả 3 provider trên đều lỗi/hết quota). */
const DEFAULT_PRIORITY_ORDER = [
  "gemini",
  "groq",
  "openrouter",
  "cerebras",
  "anthropic",
  "openai",
  "deepseek",
  "grok",
  "perplexity",
  "mistral",
  "cohere",
  "ollama",
];

/** Trả về danh sách providerId theo đúng thứ tự Founder đã sắp qua Admin
    (chỉ các dòng `status="Published"`, sắp theo cột `order`). Rỗng/lỗi/
    chưa cấu hình → trả `DEFAULT_PRIORITY_ORDER`. */
export async function getProviderPriorityOrder(): Promise<string[]> {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_PRIORITY_ORDER;

  const { data, error } = await supabase
    .from(TABLE)
    .select("id, status")
    .eq("status", "Published")
    .order("order", { ascending: true });

  if (error || !data || data.length === 0) return DEFAULT_PRIORITY_ORDER;

  return data.map((row) => row.id as string);
}
