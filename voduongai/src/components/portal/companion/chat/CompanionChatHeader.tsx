"use client";

import Link from "next/link";
import { History, X, Sparkles, ExternalLink } from "lucide-react";
import { LivingCore } from "@/components/LivingCore";

/**
 * Header nhận diện Companion (EPIC-UX-001) — LUÔN hiện logo Companion
 * (Living Core™, `src/components/LivingCore.tsx` — thiết kế đã khoá,
 * KHÔNG dùng icon robot) / "AI Mentor của VO DUONG AI", không bao giờ lộ
 * Gemini/Claude/GPT/Model/Provider/API/Runtime/Token/Latency — toàn bộ hạ
 * tầng AI ẩn khỏi người dùng, đúng định vị chính thức "Companion – AI
 * Mentor của VO DUONG AI". Dùng chung cho cả 2 variant (`full`/`compact`)
 * của `CompanionChatShell`.
 */
export function CompanionChatHeader({
  compact,
  onOpenDrawer,
  onOpenSpace,
  onClose,
  fullPageHref = "/portal/companion",
}: {
  compact: boolean;
  onOpenDrawer: () => void;
  /** Chỉ dùng ở `variant="compact"`. */
  onOpenSpace?: () => void;
  /** Chỉ dùng ở `variant="compact"`. */
  onClose?: () => void;
  /** Đích nút "Mở Companion đầy đủ" (chỉ hiện ở `variant="compact"`) —
      mặc định `/portal/companion` (1.0, giữ nguyên hành vi cũ).
      `CompanionWidget` (2.0) truyền `/v2/companion` — KHÔNG bao giờ để
      widget 2.0 điều hướng ngược về 1.0 (NGUYÊN TẮC BẤT BIẾN). */
  fullPageHref?: string;
}) {
  return (
    <div className="relative flex items-center gap-2.5 border-b border-gray-100 bg-white/90 px-4 py-3.5 backdrop-blur-md md:px-5">
      {/* Dải nhấn mảnh trên cùng — tinh tế thay vì header phẳng đơn sắc,
          đúng tinh thần "chuyên nghiệp hơn" mà vẫn tối giản. */}
      <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-violet-500 via-indigo-400 to-violet-500" />

      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Mở lịch sử trò chuyện"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50"
      >
        <History className="h-4 w-4" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-50 to-indigo-50 ring-1 ring-violet-100">
          <LivingCore size={32} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight text-gray-900">Companion</p>
          {/* Panel nổi (compact) luôn hẹp bất kể viewport desktop/mobile —
              `sm:` phản ứng theo viewport, không theo bề rộng panel, nên bỏ
              hẳn dòng phụ ở compact để nhường chỗ cho cụm nút bên phải,
              tránh identity bị bóp còn "C..." (đã tái hiện + sửa). */}
          {!compact && <p className="truncate text-[11px] leading-tight text-gray-400">AI Mentor của VO DUONG AI</p>}
          {compact && (
            <p className="flex items-center gap-1 text-[11px] leading-tight text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Đang hoạt động
            </p>
          )}
        </div>
      </div>

      {compact && (
        <div className="flex shrink-0 items-center gap-1">
          {onOpenSpace && (
            <button
              type="button"
              onClick={onOpenSpace}
              aria-label="Mở Không gian Companion"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-300 hover:text-blue-600"
              title="Mở Không gian Companion (trải nghiệm cũ, không phải chat AI)"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </button>
          )}
          <Link
            href={fullPageHref}
            aria-label="Mở Companion đầy đủ"
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-500 transition hover:border-violet-300 hover:text-violet-600"
            title="Mở Companion đầy đủ"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng Companion"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
