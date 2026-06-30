"use client";

/**
 * Companion Story Moment (Sprint 13.2 — Living Stories Engine, Nhiệm vụ
 * 05). Hiển thị một `LivingStory` được `story-matching-engine.ts` chọn —
 * gần Companion, như "một câu chuyện nhỏ", không phải modal quảng cáo,
 * không ép người dùng đọc.
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { LivingStory } from "@/lib/portal/companion/living-stories";
import { saveLivingStoryToMyStory } from "@/lib/portal/companion/story-memory";

const SAVE_CONFIRM_LINES = [
  "Được rồi. Mình sẽ giữ câu chuyện này trong hành trình của bạn.",
  "Mình đã đặt câu chuyện này vào My Story, như một dấu chân nhỏ của hôm nay.",
];

export function CompanionStoryMoment({
  story,
  onDismiss,
}: {
  story: LivingStory;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 0);
    return () => clearTimeout(showTimer);
  }, [story.id]);

  useEffect(() => {
    if (visible) return;
    const cleanupTimer = setTimeout(onDismiss, 250);
    return () => clearTimeout(cleanupTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  async function handleSave() {
    if (saveState !== "idle") return;
    setSaveState("saving");
    const result = await saveLivingStoryToMyStory(story);
    setSaveState(result === "saved" ? "saved" : "idle");
  }

  const confirmLine = SAVE_CONFIRM_LINES[story.id.length % SAVE_CONFIRM_LINES.length];

  return (
    <div
      role="dialog"
      aria-label="Một câu chuyện nhỏ từ Companion"
      className={`companion-story-moment pointer-events-auto absolute bottom-full right-0 mb-3 w-[min(86vw,320px)] rounded-2xl border border-white/15 bg-white/95 p-4 text-left text-sm leading-relaxed text-gray-800 shadow-2xl backdrop-blur transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Đóng"
        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-700 focus:outline-none"
      >
        <X className="h-3 w-3" />
      </button>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        Một câu chuyện nhỏ
      </p>
      <p className="mb-2 text-sm font-semibold text-gray-800">{story.title}</p>
      <p className="mb-3 whitespace-pre-line text-[13px] leading-relaxed text-gray-600">{story.body}</p>
      <p className="mb-3 text-[13px] italic text-gray-500">{story.closingLine}</p>

      {saveState === "saved" ? (
        <p className="mb-3 text-[13px] text-amber-200/80">{confirmLine}</p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="rounded-lg border border-white/15 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-100"
        >
          Cảm ơn, mình muốn tiếp tục
        </button>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState !== "idle"}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 hover:text-gray-800 disabled:cursor-default disabled:text-gray-400"
          >
            {saveState === "saved" ? "Đã lưu" : saveState === "saving" ? "Đang lưu…" : "Lưu vào My Story"}
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition hover:text-gray-700"
          >
            Kể lúc khác
          </button>
        </div>
      </div>
    </div>
  );
}
