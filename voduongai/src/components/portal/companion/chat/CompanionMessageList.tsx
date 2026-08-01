"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  GraduationCap,
  FileText,
  Wrench,
  Crown,
  Rocket,
  MessageCircleQuestion,
  RotateCcw,
  ArrowDownToLine,
  type LucideIcon,
} from "lucide-react";
import { MarkdownLite } from "./MarkdownLite";
import { LivingCore } from "@/components/LivingCore";
import type { ChatMessage } from "./types";

/** Empty State — Action Card (EPIC-UX-001). 5 thẻ điều hướng sang đúng
    khu vực Portal thật + 1 thẻ "Hỏi Companion" (focus composer, không
    điều hướng — không có đích Portal nào cho hành động này). */
const ACTION_CARDS: { label: string; icon: LucideIcon; href?: string }[] = [
  { label: "Học AI", icon: GraduationCap, href: "/portal/hocvienai" },
  { label: "Tìm Prompt", icon: FileText, href: "/portal/prompts" },
  { label: "Chọn công cụ AI", icon: Wrench, href: "/portal/aiworkspace" },
  { label: "Premium", icon: Crown, href: "/portal/premium" },
  { label: "Dự án & Cơ hội", icon: Rocket, href: "/portal/duan-cohoi" },
  { label: "Hỏi Companion", icon: MessageCircleQuestion },
];

export function CompanionMessageList({
  messages,
  isGenerating,
  errorMessage,
  onFocusComposer,
  onNavigate,
  onRetry,
  onContinue,
}: {
  messages: ChatMessage[];
  isGenerating: boolean;
  errorMessage: string | null;
  /** "Hỏi Companion" — focus composer thay vì điều hướng. */
  onFocusComposer: () => void;
  /** Chỉ dùng ở `variant="compact"` — đóng panel nổi trước khi điều
      hướng sang trang Portal thật (tránh panel nổi đè lên trang mới). */
  onNavigate?: () => void;
  /** Gửi lại đúng nội dung tin nhắn user liền trước làm 1 lượt mới —
      không có endpoint "regenerate", nên đây là lượt gửi mới hoàn toàn,
      hiển thị trung thực trong lịch sử hội thoại. */
  onRetry: (text: string) => void;
  onContinue: () => void;
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

  function handleActionCardClick(card: (typeof ACTION_CARDS)[number]) {
    if (!card.href) {
      onFocusComposer();
      return;
    }
    onNavigate?.();
  }

  if (messages.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-10 text-center">
        <LivingCore size={64} />
        <h1 className="mt-5 text-2xl font-bold leading-tight text-gray-900">
          Xin chào!
          <br />
          Tôi là Companion.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
          Tôi sẽ đồng hành cùng bạn trên hành trình học AI, phát triển kỹ năng và đạt được mục tiêu của mình.
        </p>

        <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ACTION_CARDS.map((card) => {
            const Icon = card.icon;
            const content = (
              <>
                <Icon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-800">{card.label}</span>
              </>
            );
            const className =
              "flex flex-col items-start gap-2.5 rounded-2xl border border-gray-200 bg-white/90 px-4 py-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md";

            return card.href ? (
              <Link key={card.label} href={card.href} onClick={() => handleActionCardClick(card)} className={className}>
                {content}
              </Link>
            ) : (
              <button key={card.label} type="button" onClick={() => handleActionCardClick(card)} className={className}>
                {content}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf("assistant");

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="flex-1 space-y-5 overflow-y-auto px-4 py-6 md:px-6">
      {messages.map((m, index) => {
        if (m.role === "user") return <UserBubble key={m.id} message={m} />;

        const precedingUser = [...messages.slice(0, index)].reverse().find((x) => x.role === "user");
        const isLast = index === lastAssistantIndex;

        return (
          <AssistantBubble
            key={m.id}
            message={m}
            showActions={isLast && !isGenerating}
            onRetry={precedingUser ? () => onRetry(precedingUser.content) : undefined}
            onContinue={onContinue}
          />
        );
      })}
      {isGenerating && <TypingIndicator />}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</div>
      )}
    </div>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div
        className={`max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-2.5 text-sm leading-relaxed text-white sm:max-w-[75%] ${
          message.pending ? "opacity-70" : ""
        }`}
      >
        <span className="whitespace-pre-wrap">{message.content}</span>
      </div>
    </div>
  );
}

function AssistantBubble({
  message,
  showActions,
  onRetry,
  onContinue,
}: {
  message: ChatMessage;
  showActions: boolean;
  onRetry?: () => void;
  onContinue: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard không khả dụng — bỏ qua
    }
  }

  return (
    <div className="group flex items-start gap-3">
      <LivingCore size={32} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="text-sm leading-relaxed text-gray-800">
          <MarkdownLite text={message.content} />
        </div>
        <div
          className={`mt-1.5 flex items-center gap-3 text-gray-400 transition ${
            showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <ActionIcon label={copied ? "Đã sao chép" : "Sao chép"} icon={copied ? Check : Copy} onClick={handleCopy} />
          {showActions && onRetry && <ActionIcon label="Thử lại" icon={RotateCcw} onClick={onRetry} />}
          {showActions && <ActionIcon label="Tiếp tục" icon={ArrowDownToLine} onClick={onContinue} />}
        </div>
      </div>
    </div>
  );
}

function ActionIcon({ label, icon: Icon, onClick }: { label: string; icon: LucideIcon; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-medium transition hover:bg-gray-100 hover:text-gray-700"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <LivingCore size={32} state="thinking" className="mt-0.5 shrink-0" />
      <div className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-white px-4 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" />
      </div>
    </div>
  );
}
