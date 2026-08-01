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
}: {
  compact: boolean;
  onOpenDrawer: () => void;
  /** Chỉ dùng ở `variant="compact"`. */
  onOpenSpace?: () => void;
  /** Chỉ dùng ở `variant="compact"`. */
  onClose?: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-gray-200 bg-white/85 px-4 py-3 backdrop-blur md:px-5">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Mở lịch sử trò chuyện"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 ${
          compact ? "" : "md:hidden"
        }`}
      >
        <History className="h-4 w-4" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <LivingCore size={32} className="shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight text-gray-900">Companion</p>
          {/* Panel nổi (compact) luôn hẹp bất kể viewport desktop/mobile —
              `sm:` phản ứng theo viewport, không theo bề rộng panel, nên bỏ
              hẳn dòng phụ ở compact để nhường chỗ cho cụm nút bên phải,
              tránh identity bị bóp còn "C..." (đã tái hiện + sửa). */}
          {!compact && <p className="truncate text-[11px] leading-tight text-gray-400">AI Mentor của VO DUONG AI</p>}
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
            href="/portal/companion"
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-500 transition hover:border-blue-300 hover:text-blue-600"
            title="Mở đầy đủ ở /portal/companion"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng Companion"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
