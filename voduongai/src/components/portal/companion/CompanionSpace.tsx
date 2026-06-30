"use client";

/**
 * Companion Space (Sprint 8.2 — Nhiệm vụ 04; tái cấu trúc Sprint 8.3
 * Embodiment theo 6 mục: Greeting / Today / Reflection / Memory /
 * Journey / Continue). Panel nhẹ mở ra khi bấm vào Companion Presence —
 * không phải UI kiểu ChatGPT/Messenger/Intercom. Không có AI chat thật
 * ở V1 — nói thẳng điều đó, không giả vờ.
 */

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CompanionAvatar } from "@/components/portal/companion/CompanionAvatar";
import type { CompanionState } from "@/lib/portal/companion/companion-identity";
import { displayName } from "@/lib/portal/companion/companion-identity";
import { getWarmthLine } from "@/lib/portal/warmth-engine";
import { getDailyQuestion } from "@/lib/portal/companion/conversation-library";
import { Button } from "@/components/portal/ui/Button";

export function CompanionSpace({
  state,
  onClose,
  insight,
}: {
  state: CompanionState;
  onClose: () => void;
  insight?: string | null;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const sharedLine = getWarmthLine("encouragement");
  const dailyQuestion = getDailyQuestion();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-0 sm:items-end sm:p-6" role="presentation">
      <button
        type="button"
        aria-label="Đóng Companion"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 sm:bg-black/20"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${displayName}`}
        className="companion-space-panel relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-[28px] border border-gray-200 bg-white p-5 pt-6 shadow-2xl sm:max-h-[80vh] sm:w-[380px] sm:rounded-2xl sm:p-6"
      >
        <div aria-hidden="true" className="companion-space-aura" />
        <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/15 sm:hidden" />

        {/* 1. Greeting — chào, nhận diện Companion, không phải chat header */}
        <section aria-label="Greeting" className="relative mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CompanionAvatar state={state.key} className="h-10 w-10 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">Mình ở đây. {state.line}</p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng Companion"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        </section>

        <p className="mb-1 text-sm leading-relaxed text-gray-900/85">
          Mình đang ở đây. Hôm nay bạn muốn chia sẻ điều gì?
        </p>
        <p className="mb-5 text-xs italic text-gray-400">
          Mình đồng hành cùng bạn qua từng giai đoạn — không chỉ đọc nội dung.
        </p>

        {/* 2. Today — ghi nhận hiện diện hôm nay của người dùng */}
        <section aria-label="Today" className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-900/45">Hôm nay của bạn</p>
          <p className="text-sm text-gray-700">
            {insight ?? "Mình nhận thấy bạn vẫn đang ở đây, vẫn đang tiếp tục — điều đó không nhỏ."}
          </p>
        </section>

        {/* 3. Reflection — một câu hỏi mời gợi mở, không bắt buộc trả lời */}
        <section aria-label="Reflection" className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-900/45">
            Hôm nay mình muốn hỏi bạn một điều
          </p>
          <p className="text-sm text-gray-700">{dailyQuestion}</p>
          <p className="mt-2 text-xs text-gray-400">
            Không cần trả lời ngay, và cũng không sao nếu bạn không muốn trả lời.
          </p>
        </section>

        {/* 4. Memory — điều Companion ghi nhớ và muốn chia sẻ lại */}
        <section aria-label="Memory" className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-900/45">
            Điều Companion muốn chia sẻ
          </p>
          <p className="whitespace-pre-line text-sm text-gray-700">{sharedLine}</p>
        </section>

        {/* 5. Journey — mời giữ lại một dấu chân nhỏ trên hành trình */}
        <section aria-label="Journey" className="mb-5 rounded-xl border border-dashed border-white/15 p-4">
          <p className="mb-2 text-sm text-gray-600">
            Có điều gì hôm nay bạn muốn giữ lại — một dấu chân nhỏ trên hành trình này?
          </p>
          <p className="text-xs text-gray-900/45">
            Trò chuyện sâu với Companion đang được chuẩn bị. Hiện tại, mình có thể giúp bạn nhìn lại
            hành trình và lưu lại những điều quan trọng.
          </p>
        </section>

        {/* 6. Continue — lối đi tiếp, không phải khung chat */}
        <section aria-label="Continue" className="flex flex-col gap-2">
          <Button href="/portal/ai-assistant" variant="primary" className="w-full">
            Chia sẻ với Companion
          </Button>
          <Button href="/portal/story" variant="secondary" className="w-full">
            Mở My Story
          </Button>
          <Button href="/portal/journey" variant="secondary" className="w-full">
            Tiếp tục hành trình
          </Button>
        </section>
      </div>
    </div>
  );
}
