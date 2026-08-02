/**
 * AI Provider Priority — đọc thứ tự ưu tiên Provider do Founder tự cấu
 * hình qua Admin (`/admin/he-thong/uu-tien-ai`, bảng `ai_provider_priority`,
 * xem `supabase-phase29-ai-provider-priority.sql`). Dùng `getSupabasePublic()`
 * (không phụ thuộc `cookies()`) vì `provider-manager.ts::execute()` được
 * gọi từ nhiều ngữ cảnh khác nhau (Companion chat, writer-agent,
 * reviewer-agent...), không phải lúc nào cũng có request context.
 *
 * Fallback graceful khi Supabase chưa cấu hình/lỗi/bảng rỗng —
 * `DEFAULT_PRIORITY_ORDER` giữ nguyên xếp hạng overallScore hiện có, để
 * hệ thống hoạt động đúng như trước khi tính năng này tồn tại.
 */
import "server-only";
import { getSupabasePublic } from "@/lib/supabase";

const TABLE = "ai_provider_priority";

/** Khớp đúng 12 providerId thật trong registry.ts (không tính "mock").
    Thứ tự này chỉ dùng khi Supabase chưa cấu hình/lỗi/bảng rỗng — không
    phải nguồn sự thật, chỉ là an toàn dự phòng. */
const DEFAULT_PRIORITY_ORDER = [
  "anthropic",
  "openai",
  "gemini",
  "groq",
  "cerebras",
  "openrouter",
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
