import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Nội dung "Sứ mệnh Companion" (6 khối: Sứ mệnh/Triết lý/Điều lệ/Bộ gene/
 * Hành trình tiến hoá/Dòng thời gian — 6 bảng Supabase Founder quản qua
 * `/admin/su-menh-companion/live-edit`) — port vào system prompt Companion
 * Chat thật (Portal 2.0, Giai đoạn 2), để Companion trò chuyện đúng bản
 * sắc đã định nghĩa thay vì persona chung chung (`COMPANION_CHAT_SYSTEM_
 * PROMPT_V1` trước đây không hề tham chiếu nội dung này).
 *
 * Dùng `getSupabaseAdmin()` (service role) — chỉ chạy server-side trong
 * `/api/companion/chat/route.ts`, không lộ ra client. Trang Portal
 * `/portal/su-menh-companion`/`/v2/su-menh-companion` hiện đọc 6 bảng này
 * qua `/api/admin/collections/[table]` (nội bộ cũng dùng `getSupabaseAdmin()`)
 * — cùng cách tiếp cận, không tự đoán RLS cho 6 bảng chưa xác nhận có
 * policy đọc công khai.
 *
 * CHỈ lấy `status='Published'` — khác trang Portal hiện tại (đọc qua
 * `/api/admin/collections/[table]`'s GET) KHÔNG lọc status khi hiển thị
 * (gap có sẵn từ trước, ngoài phạm vi sửa ở đây). Nội dung này đi thẳng
 * vào system prompt của MỌI cuộc trò chuyện Companion nên chọn an toàn
 * hơn — chỉ dùng nội dung đã Publish, đúng nguyên tắc "public read
 * published" áp dụng xuyên suốt dự án.
 *
 * Cache TTL ngắn (process-local, cùng mức 30s đã dùng cho
 * `getPublishedCatalog()` ở `published-catalog-adapter.ts`) — tránh 6
 * round-trip Supabase cho MỖI tin nhắn (nội dung này hiếm khi đổi).
 */

type Row = { id: string; data: Record<string, unknown>; status: string; order: number };

async function fetchPublishedRows(table: string): Promise<Row[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(table)
    .select("id, data, status, order")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data as Row[];
}

function text(row: Row, key: string): string {
  return String(row.data[key] ?? "").trim();
}

function buildMissionContext(
  mission: Row[],
  philosophy: Row[],
  constitution: Row[],
  genome: Row[],
  evolution: Row[],
  timeline: Row[]
): string {
  if (
    mission.length === 0 &&
    philosophy.length === 0 &&
    constitution.length === 0 &&
    genome.length === 0 &&
    evolution.length === 0 &&
    timeline.length === 0
  ) {
    return "";
  }

  const lines: string[] = ["Sứ mệnh & bản sắc của Companion (nguồn: trang Sứ mệnh Companion):"];

  if (mission.length > 0) {
    lines.push("Sứ mệnh:");
    for (const row of mission) lines.push(`- ${text(row, "content")}`);
  }
  if (philosophy.length > 0) {
    lines.push("Triết lý (AI thông thường / Companion):");
    for (const row of philosophy) lines.push(`- AI: ${text(row, "ai")} — Companion: ${text(row, "companion")}`);
  }
  if (constitution.length > 0) {
    lines.push("Điều lệ:");
    for (const row of constitution) lines.push(`- ${text(row, "content")}`);
  }
  if (genome.length > 0) {
    lines.push("Bộ gene:");
    for (const row of genome) lines.push(`- ${text(row, "label")}: ${text(row, "meaning")}`);
  }
  if (evolution.length > 0) {
    lines.push("Hành trình tiến hoá:");
    for (const row of evolution) lines.push(`- ${text(row, "stage")}: ${text(row, "meaning")}`);
  }
  if (timeline.length > 0) {
    lines.push("Dòng thời gian:");
    for (const row of timeline) {
      lines.push(
        `- ${text(row, "stage")} — ${text(row, "philosophy")} ${text(row, "meaning")} Bài học: ${text(row, "lesson")}`
      );
    }
  }

  return lines.join("\n");
}

const MISSION_CACHE_TTL_MS = 30_000;
let cachedMissionContext: string | null = null;
let cachedAt = 0;

export async function getCompanionMissionContext(): Promise<string> {
  if (cachedMissionContext !== null && Date.now() - cachedAt < MISSION_CACHE_TTL_MS) {
    return cachedMissionContext;
  }

  const [mission, philosophy, constitution, genome, evolution, timeline] = await Promise.all([
    fetchPublishedRows("mission_items"),
    fetchPublishedRows("philosophy_pairs"),
    fetchPublishedRows("constitution"),
    fetchPublishedRows("genome"),
    fetchPublishedRows("evolution"),
    fetchPublishedRows("timeline"),
  ]);

  cachedMissionContext = buildMissionContext(mission, philosophy, constitution, genome, evolution, timeline);
  cachedAt = Date.now();
  return cachedMissionContext;
}

/** Chỉ dùng cho test — reset cache giữa các test case. */
export function __resetCompanionMissionCacheForTest(): void {
  cachedMissionContext = null;
  cachedAt = 0;
}
