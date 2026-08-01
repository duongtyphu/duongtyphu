"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { MarkdownLite } from "./MarkdownLite";
import type { ChatMessage } from "./types";

const STARTERS = [
  "Tôi muốn bắt đầu học AI.",
  "Giúp tôi chọn công cụ phù hợp.",
  "Viết prompt cho công việc của tôi.",
  "Xây dựng một quy trình làm việc.",
  "Đánh giá kết quả tôi đã làm.",
  "Giúp tôi xác định bước tiếp theo.",
];

export function CompanionMessageList({
  messages,
  isGenerating,
  errorMessage,
  onStarterClick,
}: {
  messages: ChatMessage[];
  isGenerating: boolean;
  errorMessage: string | null;
  onStarterClick: (text: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasNearBottomRef = useRef(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (wasNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isGenerating]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    wasNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }

  if (messages.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Companion</p>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-gray-700">
          Xin chào, hôm nay bạn muốn Companion đồng hành cùng bạn trong điều gì?
        </p>
        <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onStarterClick(s)}
              className="rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-left text-sm text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="flex-1 space-y-4 overflow-y-auto px-4 py-6 md:px-6">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      {isGenerating && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles className="h-4 w-4 animate-pulse text-blue-400" />
          Companion đang soạn phản hồi...
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%] ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-gray-200 bg-white text-gray-800"
        } ${message.pending ? "opacity-70" : ""}`}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{message.content}</span>
        ) : (
          <MarkdownLite text={message.content} />
        )}
      </div>
    </div>
  );
}
