import { NextResponse } from "next/server";

/**
 * Helper JSON dùng chung cho `/api/mnyt/*` (Read API công khai, chỉ đọc
 * `status='Published'`) — cùng tinh thần `src/lib/ckos/api-helpers.ts`
 * nhưng tách riêng (không import chéo CKOS) vì 2 tính năng độc lập, không
 * chia sẻ shape tham số lọc.
 */

export function mnytJson(items: unknown[], meta: { page: number; pageSize: number; total: number }) {
  return NextResponse.json({ items, page: meta.page, pageSize: meta.pageSize, total: meta.total });
}

export function mnytError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function mnytNotConfigured() {
  return mnytError("Supabase chưa được cấu hình", 503);
}
