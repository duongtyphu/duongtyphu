"use client";

import { useState } from "react";
import { Send, Square } from "lucide-react";
import { COMPANION_MESSAGE_MAX_LENGTH } from "@/lib/portal/companion-chat";

export function CompanionComposer({
  isGenerating,
  onSend,
  onStop,
  value,
  onValueChange,
}: {
  isGenerating: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  const trimmed = value.trim();
  const overLimit = value.length > COMPANION_MESSAGE_MAX_LENGTH;
  const canSend = trimmed.length > 0 && !overLimit && !isGenerating;

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
        className={`flex items-end gap-2 rounded-2xl border bg-white px-3 py-2 transition ${
          focused ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-200"
        }`}
      >
        <textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={1}
          placeholder="Nhắn cho Companion... (Enter để gửi, Shift+Enter để xuống dòng)"
          className="max-h-40 min-h-[2.5rem] flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
        />
        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Dừng phản hồi"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSend}
            aria-label="Gửi tin nhắn"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </div>
      {overLimit && (
        <p className="mt-1.5 text-xs text-red-500">
          Tin nhắn quá dài — tối đa {COMPANION_MESSAGE_MAX_LENGTH} ký tự ({value.length}/{COMPANION_MESSAGE_MAX_LENGTH}).
        </p>
      )}
    </div>
  );
}
