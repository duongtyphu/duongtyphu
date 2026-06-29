/**
 * Core Memory (Sprint 18.9 — Core Memory Engine). Xem
 * `docs/product-bible/BOOK_CORE_MEMORY.md`.
 *
 * KHÔNG phải một candidate hiện diện mới, KHÔNG phải một engine nói mới.
 * Mọi engine hiện có (Thought Selector, Presence Governance, Companion
 * Decision) vẫn tự quyết định nội dung/giọng nói của riêng nó — file này
 * chỉ định nghĩa một tầng ký ức NỀN mà các engine đó có thể ĐỌC, để biết
 * "điều gì không bao giờ được quên", không phải để có thêm một thứ để nói.
 *
 * Origin Memory (`origin-memory.ts`, Sprint 18.0) là Core Memory đầu tiên
 * — `getCoreMemories()` chuyển `OriginMemory[]` đã có sẵn (không sửa
 * `origin-memory.ts`) thành `CoreMemory[]`, lấy đúng `lesson` làm phần
 * "ảnh hưởng đến hành vi" (NV01/NV02).
 *
 * Origin Line (`getCompanionOriginLine()`) là câu nói DUY NHẤT mà Core
 * Memory cho phép phát ra thành lời — và chỉ ở 5 ngữ cảnh hẹp (NV04):
 * Origin Room, Companion Chapter, Ceremony, Founder Moment, các nghi thức
 * đặc biệt. `isOriginLineAllowedInContext()`/`getOriginLineFromCoreMemory()`
 * là cổng duy nhất để lấy câu này — không nơi nào khác được gọi
 * `getCompanionOriginLine()` trực tiếp ngoài 5 ngữ cảnh đó.
 */

import {
  getCoreOriginMemories,
  getFounderOriginMemory,
  getCompanionOriginLine,
  type OriginMemory,
} from "@/lib/portal/companion/origin-memory";

/**
 * Nguồn của một Core Memory — hiện tại chỉ có "origin". Thêm nguồn mới
 * nghĩa là một ký ức nền khác thật sự đã tồn tại trong code (ví dụ một
 * Founder Memory riêng trong tương lai), không phải suy đoán trước.
 */
export type CoreMemorySource = "origin";

/**
 * 5 ngữ cảnh duy nhất Origin Line được phép xuất hiện (NV04) — đúng danh
 * sách đã định nghĩa trong brief, không thêm tuỳ ý.
 */
export type CoreMemoryContext =
  | "origin-room"
  | "companion-chapter"
  | "ceremony"
  | "founder-moment"
  | "special-ritual";

export const ORIGIN_LINE_ALLOWED_CONTEXTS: CoreMemoryContext[] = [
  "origin-room",
  "companion-chapter",
  "ceremony",
  "founder-moment",
  "special-ritual",
];

/**
 * Một Core Memory — không phải một câu để nói, mà một bài học nền cùng
 * điều "không bao giờ được quên" mà nó áp đặt lên hành vi Companion.
 */
export type CoreMemory = {
  id: string;
  source: CoreMemorySource;
  title: string;
  whatCompanionLearned: string;
  whatMustNeverBeForgotten: string;
};

function toCoreMemory(memory: OriginMemory, index: number): CoreMemory {
  return {
    id: `origin-${memory.type}-${index}`,
    source: "origin",
    title: memory.title,
    whatCompanionLearned: memory.lesson.whatCompanionLearned,
    whatMustNeverBeForgotten: memory.lesson.whatMustNeverBeForgotten,
  };
}

/**
 * NV01/NV02 — toàn bộ Core Memory hiện có. Origin Memory (12 ký ức gốc +
 * 1 ký ức Founder) là Core Memory đầu tiên — đọc trực tiếp từ
 * `origin-memory.ts`, không tạo nội dung mới, không nhân đôi dữ liệu.
 */
export function getCoreMemories(): CoreMemory[] {
  const founder = getFounderOriginMemory();
  return [...getCoreOriginMemories(), founder].map(toCoreMemory);
}

/**
 * NV03 — phần các engine khác thật sự "đọc": danh sách điều không bao
 * giờ được quên, dùng để âm thầm định hướng quyết định (không hiển thị
 * trực tiếp ra UI dưới dạng câu nói).
 */
export function getCoreMemoryConstraints(): string[] {
  return getCoreMemories().map((memory) => memory.whatMustNeverBeForgotten);
}

export function isOriginLineAllowedInContext(context: CoreMemoryContext | null | undefined): boolean {
  if (!context) return false;
  return ORIGIN_LINE_ALLOWED_CONTEXTS.includes(context);
}

/**
 * Cổng duy nhất để lấy Origin Line từ Core Memory (NV04). Trả về `null`
 * ở mọi ngữ cảnh khác — Origin Line không xuất hiện ngẫu nhiên chỉ để đủ
 * candidate cho Presence Governance hay bất kỳ engine nào khác.
 */
export function getOriginLineFromCoreMemory(
  context: CoreMemoryContext | null | undefined,
  params?: { isFounderPresent?: boolean }
): string | null {
  if (!isOriginLineAllowedInContext(context)) return null;
  return getCompanionOriginLine(params);
}
