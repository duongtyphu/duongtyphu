"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { COMPANION_MESSAGE_MAX_LENGTH } from "@/lib/portal/companion-chat";

const MAX_TEXTAREA_HEIGHT_PX = 168;

export function CompanionComposer({
  isGenerating,
  onSend,
  onStop,
  value,
  onValueChange,
  inputRef,
}: {
  isGenerating: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  value: string;
  onValueChange: (value: string) => void;
  /** EPIC-UX-001 — expose textarea ra ngoài để Empty State ("Hỏi Companion")
      focus trực tiếp, không cần state trung gian. */
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [focused, setFocused] = useState(false);
  const localRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = value.trim();
  const overLimit = value.length > COMPANION_MESSAGE_MAX_LENGTH;
  const canSend = trimmed.length > 0 && !overLimit && !isGenerating;

  // Auto Resize — chiều cao textarea lớn dần theo nội dung, kẹp lại ở
  // MAX_TEXTAREA_HEIGHT_PX rồi mới cho phép cuộn bên trong.
  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  }, [value]);

  function handleSubmit() {
    if (!canSend) return;
    onSend(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
      <div
        className={`flex items-end gap-2 rounded-2xl border bg-white px-3 py-2.5 shadow-sm transition ${
          focused ? "border-blue-400 ring-4 ring-blue-100" : "border-gray-200"
        }`}
      >
        <textarea
          ref={(el) => {
            localRef.current = el;
            if (inputRef) inputRef.current = el;
          }}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={1}
          placeholder="Hãy mô tả mục tiêu hoặc điều bạn muốn thực hiện..."
          style={{ maxHeight: MAX_TEXTAREA_HEIGHT_PX }}
          className="min-h-[1.75rem] flex-1 resize-none overflow-y-auto bg-transparent text-sm leading-relaxed text-gray-900 placeholder-gray-400 outline-none"
        />
        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Dừng phản hồi"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50"
          >
            <Square className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSend}
            aria-label="Gửi tin nhắn"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between px-1">
        <p className="text-[11px] text-gray-400">
          <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-sans">Enter</kbd> để gửi ·{" "}
          <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-sans">Shift+Enter</kbd> xuống dòng
        </p>
        {overLimit && (
          <p className="text-[11px] font-medium text-red-500">
            Quá dài — tối đa {COMPANION_MESSAGE_MAX_LENGTH} ký tự ({value.length}/{COMPANION_MESSAGE_MAX_LENGTH}).
          </p>
        )}
      </div>
    </div>
  );
}
