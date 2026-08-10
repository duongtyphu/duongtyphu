"use client";

import { useState } from "react";
import {
  BarChart3,
  Bot,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Send,
  Wrench,
} from "lucide-react";

import { IcoBox } from "@/components/v2/ui/IcoBox";
import type { CompanionSuggestion } from "@/lib/v2/data/companion";
import type { CompanionMessage } from "@/lib/v2/data/types";

const CHIPS = [
  { label: "Đặt câu hỏi", icon: HelpCircle },
  { label: "Gợi ý bài học", icon: Lightbulb },
  { label: "Tạo kế hoạch", icon: ListChecks },
  { label: "Phân tích & đánh giá", icon: BarChart3 },
  { label: "Công cụ AI", icon: Wrench },
];

function hhmm(iso: string): string {
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export function CompanionChat({
  initialMessages,
  suggestions,
  userInitials,
}: {
  initialMessages: CompanionMessage[];
  suggestions: CompanionSuggestion[];
  userInitials: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  function send() {
    const text = draft.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `local_${Date.now()}`,
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
    // TODO(v2): nối vào API Companion thật. Giai đoạn này chỉ hiển thị tin nhắn
    // người dùng — cố tình KHÔNG bịa câu trả lời của AI ở phía client.
  }

  return (
    <div className="flex flex-col gap-[18px] rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-5">
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        return (
          <div key={message.id}>
            <div
              className={[
                "flex max-w-[78%] gap-3",
                isUser ? "ml-auto flex-row-reverse" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px] font-bold text-white",
                  isUser
                    ? "bg-[linear-gradient(135deg,#8b7bde,#5f4bc9)]"
                    : "bg-[linear-gradient(145deg,#8b6bff,#5a37e6)]",
                ].join(" ")}
              >
                {isUser ? userInitials : <Bot className="h-[19px] w-[19px]" aria-hidden="true" />}
              </span>
              <div>
                <div
                  className={[
                    "rounded-[13px] px-4 py-[13px] text-[13.5px] leading-[1.6] whitespace-pre-line",
                    isUser ? "bg-[var(--v2-violet-light)]" : "bg-[var(--v2-bg)]",
                  ].join(" ")}
                >
                  {message.content}
                </div>
                <span className="mt-[6px] block text-[10.5px] text-[var(--v2-muted)]">
                  {hhmm(message.createdAt)}
                </span>
              </div>
            </div>

            {/* Thẻ gợi ý bám ngay dưới tin nhắn chào đầu tiên, như mockup. */}
            {index === 0 ? (
              <div className="mt-[18px] ml-[46px] grid grid-cols-1 gap-3 min-[760px]:grid-cols-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    className="rounded-[11px] border border-[var(--v2-line)] bg-[var(--v2-bg)] p-3 text-left transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(30,20,80,.1)]"
                  >
                    <IcoBox
                      icon={suggestion.icon}
                      size="sm"
                      background={suggestion.gradient}
                      color="#fff"
                      className="mb-2 !h-[26px] !w-[26px] !rounded-lg"
                    />
                    <h5 className="mb-[3px] text-[12.5px] font-bold">{suggestion.title}</h5>
                    <p className="mb-2 text-[11px] leading-[1.4] text-[var(--v2-muted)]">
                      {suggestion.description}
                    </p>
                    <span className="text-[11.5px] font-bold text-[var(--v2-violet)]">
                      {suggestion.cta}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="ml-[46px] flex items-center justify-between gap-3 rounded-[11px] bg-[linear-gradient(145deg,#f4efff,#e4d9ff)] px-4 py-[14px]">
        <span className="text-[13px] font-bold text-[var(--v2-violet-dark)]">
          Xem lộ trình AI Agent cho bạn
        </span>
        <span className="text-[15px] font-extrabold text-[var(--v2-violet-dark)]">→</span>
      </div>

      <div className="flex items-center gap-[10px] rounded-[11px] border border-[var(--v2-line)] py-[6px] pr-[6px] pl-4">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          placeholder="Nhắn tin cho Companion..."
          aria-label="Nhắn tin cho Companion"
          className="flex-1 border-none bg-transparent text-[13.5px] outline-none"
        />
        <button
          type="button"
          onClick={send}
          aria-label="Gửi tin nhắn"
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--v2-violet)] text-white transition-[transform,filter] duration-150 hover:scale-105 hover:brightness-110"
        >
          <Send className="h-[17px] w-[17px]" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => setDraft(chip.label)}
              className="flex items-center gap-[6px] rounded-[9px] border border-[var(--v2-line)] bg-[var(--v2-bg)] px-[13px] py-2 text-[12.5px] font-semibold text-[var(--v2-muted)] transition-colors hover:border-[var(--v2-violet)] hover:text-[var(--v2-violet)]"
            >
              <Icon className="h-[14px] w-[14px]" aria-hidden="true" />
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
