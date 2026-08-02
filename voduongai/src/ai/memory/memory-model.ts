/**
 * SPRINT A06 — Memory & Reflection Engine: Memory Model.
 *
 * `src/ai/memory/` là namespace MỚI, hoàn toàn độc lập khỏi Runtime chat
 * thật, Chat API, Provider, Prompt, UI, Database, CKOS, Premium, Platform
 * Runtime, Goal Runtime — không import/export nào nối sang các phần đó.
 * Namespace này CŨNG KHÔNG import từ `src/ai/mentor`/`src/ai/platform`/
 * `src/ai/knowledge` (mỗi sprint Companion Core giữ ranh giới riêng, việc
 * nối các namespace lại với nhau là quyết định Runtime tương lai, ngoài
 * phạm vi Sprint này). File này CHỈ định nghĩa SHAPE dữ liệu cho
 * `MemoryEntry`.
 */

export type MemoryType = "session" | "goal" | "learning" | "preference" | "reflection";

export const MEMORY_TYPES: readonly MemoryType[] = ["session", "goal", "learning", "preference", "reflection"];

/** Type guard thuần — chỉ kiểm tra shape. */
export function isMemoryType(value: string): value is MemoryType {
  return (MEMORY_TYPES as readonly string[]).includes(value);
}

/** Kẹp về đúng khoảng [0, 1] — helper thuần, không suy luận. */
export function clampUnitInterval(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * 1 trí nhớ đã "chốt" — chỉ SHAPE dữ liệu, không gắn với bảng Database
 * nào (Sprint A06 không migration, không persistence).
 */
export type MemoryEntry = {
  id: string;
  type: MemoryType;
  title: string;
  summary: string;
  /** 0-1 — mức độ quan trọng CỐ HỮU của LOẠI trí nhớ này (vd. "goal"
      quan trọng hơn "session") — suy TRỰC TIẾP từ `type` qua
      `baseImportanceForType()`, không phải giá trị tự do truyền vào,
      để mọi entry cùng loại luôn nhất quán. */
  importance: number;
  /** 0-1 — độ tự tin đây THẬT SỰ là 1 trí nhớ đáng ghi. Khác
      `importance`: 1 trí nhớ có thể thuộc loại quan trọng nhưng chưa
      chắc chắn (confidence thấp), hoặc ngược lại. */
  confidence: number;
  /** Mô tả nguồn gốc ngắn (vd. "conversation") — KHÔNG phải ID hệ thống
      thật, namespace này không đọc/ghi Database nào. */
  source: string;
  /** Mốc thời gian LOGIC do nơi gọi cung cấp — namespace này KHÔNG tự
      gọi `Date.now()` (giữ đúng Determinism Mandate). */
  timestamp: string;
};

const TYPE_BASE_IMPORTANCE: Record<MemoryType, number> = {
  goal: 0.9,
  learning: 0.7,
  reflection: 0.6,
  preference: 0.5,
  session: 0.1,
};

/** Helper thuần — tra bảng `importance` CỐ ĐỊNH theo `type`. */
export function baseImportanceForType(type: MemoryType): number {
  return TYPE_BASE_IMPORTANCE[type];
}

/**
 * Helper thuần dựng 1 `MemoryEntry` — không side-effect, không lưu trữ.
 * `importance` LUÔN suy từ `type` (không nhận qua input).
 */
export function createMemoryEntry(input: {
  id: string;
  type: MemoryType;
  title: string;
  summary: string;
  confidence: number;
  source: string;
  timestamp: string;
}): MemoryEntry {
  return {
    id: input.id,
    type: input.type,
    title: input.title,
    summary: input.summary,
    importance: baseImportanceForType(input.type),
    confidence: clampUnitInterval(input.confidence),
    source: input.source,
    timestamp: input.timestamp,
  };
}
