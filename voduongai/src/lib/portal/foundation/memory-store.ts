/**
 * Sprint 003 — Workspace Runtime Integration — Memory Sync.
 *
 * Memory Contract: sau khi Output hoàn thành vào Portfolio ("Complete"
 * trong Runtime Flow), Workspace ghi lại 5 trường — Learning/Reflection/
 * Knowledge/Best Practice/Capability Improvement — TỪ DỮ LIỆU THẬT đã
 * có (Reflection Owner đã gửi + Reviewer Agent review + Portfolio
 * `capabilityMapping`), không suy diễn/bịa nội dung. Không tạo bảng lưu
 * trữ song song với Output/Portfolio — Memory chỉ tham chiếu
 * `outputId`/`portfolioItemId`, không copy nội dung Output đầy đủ (Single
 * Source of Truth, giống nguyên tắc đã khóa ở `portfolio-store.ts`).
 *
 * PHASE 40 — trước đây lưu qua `localStorage` (per-browser, KHÔNG gắn
 * `user_id` thật — 2 học viên chung máy sẽ thấy chung dữ liệu, 1 học viên
 * đổi thiết bị sẽ mất hết). Giờ lưu qua bảng Supabase `memory_entries`
 * (RLS `member_id = auth.uid()`), theo đúng yêu cầu Founder "mọi chỉ số
 * phải kết nối và ghi nhận thật với hồ sơ của từng học viên".
 *
 * Kiến trúc "cache đồng bộ + persist bất đồng bộ" (KHÔNG đổi mọi hàm sang
 * `async`) — giữ nguyên 100% chữ ký `listMemoryEntries()`/
 * `syncMemoryForPortfolioItem()` để không phải sửa lại `WorkspaceMvp.tsx`
 * (gọi đồng bộ ngay trong 1 event handler, giá trị trả về hiện tại KHÔNG
 * được dùng nên fire-and-forget an toàn) — chỉ thêm 1 hàm mới bắt buộc:
 * `hydrateMemoryStore()` (async, gọi 1 lần lúc mount trước khi đọc, xem
 * `/v2/bo-nho-ca-nhan-hoa`/`BoNhoCaNhanHoaClient.tsx`). Cache tự re-hydrate
 * nếu phát hiện đổi tài khoản đăng nhập (đăng xuất/đăng nhập tài khoản
 * khác trong cùng phiên trình duyệt).
 */

import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { OutputRecord } from "./workspace-session-store";
import type { PortfolioItemRecord } from "./portfolio-store";
import { emitGrowthEvent } from "./growth-event-bus";

export type MemoryEntry = {
  memoryId: string;
  outputId: string;
  portfolioItemId: string;
  sessionId: string;
  /** Owner đã học được gì — lấy nguyên văn từ Reflection thật đã gửi, không diễn giải lại. */
  learning: string;
  /** Câu hỏi + câu trả lời Reflection đầy đủ (bằng chứng thô). */
  reflection: string;
  /** Tri thức liên quan — Competency/Mission Output này thuộc về. */
  knowledge: string;
  /** Điều gì đã làm tốt — lấy từ `agentReview.strengths` nếu có Reviewer Agent đã chạy; rỗng nếu chưa có. */
  bestPractice: string;
  /** Năng lực nào được cải thiện — map trực tiếp từ `portfolioItem.capabilityMapping`. */
  capabilityImprovement: string;
  createdAt: string;
};

const MAX_ENTRIES = 500;

let cachedMemberId: string | null | undefined = undefined;
let cache: MemoryEntry[] = [];

type MemoryEntryRow = {
  memory_id: string;
  output_id: string;
  portfolio_item_id: string;
  session_id: string;
  learning: string;
  reflection: string;
  knowledge: string;
  best_practice: string;
  capability_improvement: string;
  created_at: string;
};

function rowToEntry(row: MemoryEntryRow): MemoryEntry {
  return {
    memoryId: row.memory_id,
    outputId: row.output_id,
    portfolioItemId: row.portfolio_item_id,
    sessionId: row.session_id,
    learning: row.learning,
    reflection: row.reflection,
    knowledge: row.knowledge,
    bestPractice: row.best_practice,
    capabilityImprovement: row.capability_improvement,
    createdAt: row.created_at,
  };
}

function entryToRow(entry: MemoryEntry, memberId: string): MemoryEntryRow & { member_id: string } {
  return {
    memory_id: entry.memoryId,
    member_id: memberId,
    output_id: entry.outputId,
    portfolio_item_id: entry.portfolioItemId,
    session_id: entry.sessionId,
    learning: entry.learning,
    reflection: entry.reflection,
    knowledge: entry.knowledge,
    best_practice: entry.bestPractice,
    capability_improvement: entry.capabilityImprovement,
    created_at: entry.createdAt,
  };
}

/**
 * Tải Memory thật của member đang đăng nhập vào cache trong bộ nhớ — PHẢI
 * gọi (và `await`) trước khi dùng `listMemoryEntries()` lần đầu ở mỗi
 * trang (xem cách `/v2/bo-nho-ca-nhan-hoa` gọi trong `useEffect`). No-op
 * nếu đã hydrate đúng member hiện tại (an toàn gọi lại nhiều lần).
 */
export async function hydrateMemoryStore(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    cachedMemberId = null;
    cache = [];
    return;
  }
  try {
    const supabase = getSupabaseBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const memberId = userData.user?.id ?? null;
    if (memberId === cachedMemberId) return;
    cachedMemberId = memberId;
    if (!memberId) {
      cache = [];
      return;
    }
    const { data, error } = await supabase
      .from("memory_entries")
      .select("memory_id, output_id, portfolio_item_id, session_id, learning, reflection, knowledge, best_practice, capability_improvement, created_at")
      .eq("member_id", memberId)
      .order("created_at", { ascending: true });
    cache = error || !data ? [] : (data as MemoryEntryRow[]).map(rowToEntry);
  } catch {
    cache = [];
  }
}

function readAll(): MemoryEntry[] {
  return cache;
}

/** Ghi cache ngay (đồng bộ) + đẩy lên Supabase ở nền (không chặn UI, lỗi
    mạng chỉ mất khả năng lưu bền — không vỡ Runtime, cùng tinh thần
    try/catch localStorage cũ). */
function writeAll(entries: MemoryEntry[]): void {
  cache = entries.slice(-MAX_ENTRIES);
  void persistNewEntry(entries[entries.length - 1]);
}

async function persistNewEntry(entry: MemoryEntry | undefined): Promise<void> {
  if (!entry || !cachedMemberId) return;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
  try {
    const supabase = getSupabaseBrowser();
    await supabase.from("memory_entries").upsert(entryToRow(entry, cachedMemberId), { onConflict: "memory_id" });
  } catch {
    // Mất kết nối/lỗi ghi — chấp nhận được ở MVP, cùng tinh thần localStorage cũ.
  }
}

/** CHỈ dùng trong test — cache module-level không tự reset giữa các test
    case như `localStorage.clear()` cũ, nên test phải tự gọi hàm này trong
    `beforeEach()` (xem `workspace-runtime-integration.test.ts`). */
export function __resetMemoryStoreCacheForTest(): void {
  cachedMemberId = undefined;
  cache = [];
}

export function listMemoryEntries(sessionId?: string): MemoryEntry[] {
  const entries = readAll();
  return sessionId ? entries.filter((e) => e.sessionId === sessionId) : entries;
}

/**
 * Đồng bộ Memory ngay sau khi 1 Output hoàn thành vào Portfolio — gọi
 * đúng 1 lần/Portfolio Item (idempotent theo `portfolioItemId`, không
 * ghi trùng nếu gọi lại nhiều lần cho cùng 1 item). Yêu cầu
 * `hydrateMemoryStore()` đã chạy xong trước đó (đúng luồng
 * `WorkspaceMvp.tsx` — trang Workspace đã hydrate ở mount).
 */
export function syncMemoryForPortfolioItem(portfolioItem: PortfolioItemRecord, output: OutputRecord): MemoryEntry {
  const existing = readAll().find((e) => e.portfolioItemId === portfolioItem.portfolioItemId);
  if (existing) return existing;

  const reflectionText = output.reflections.map((r) => `${r.question} ${r.answer}`).join(" | ");
  const learning = output.reflections.map((r) => r.answer).join(" ") || "Chưa có Reflection.";
  const bestPractice = output.agentReview?.strengths.join("; ") ?? "";
  const knowledge = portfolioItem.missionId
    ? `Golden Mission: ${portfolioItem.missionId}`
    : `Competency: ${(portfolioItem.capabilityMapping ?? []).join(", ") || "chưa xác định"}`;

  const entry: MemoryEntry = {
    memoryId: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    outputId: output.outputId,
    portfolioItemId: portfolioItem.portfolioItemId,
    sessionId: portfolioItem.sessionId,
    learning,
    reflection: reflectionText,
    knowledge,
    bestPractice,
    capabilityImprovement: (portfolioItem.capabilityMapping ?? []).join(", "),
    createdAt: new Date().toISOString(),
  };

  writeAll([...readAll(), entry]);
  emitGrowthEvent({ eventType: "MEMORY_UPDATED", workspaceSessionId: portfolioItem.sessionId, outputId: output.outputId, missionId: portfolioItem.missionId });
  return entry;
}
