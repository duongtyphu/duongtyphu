"use client";

import { useRef, useState } from "react";
import type { CompanionMessageRow } from "@/app/portal/companion/actions";
import { COMPANION_MESSAGE_MAX_LENGTH } from "@/lib/portal/companion-chat";
import type { CompanionMemorySuggestion } from "@/ai/runtime/public-chat-response";
import { saveMemorySuggestion } from "@/lib/portal/companion/memory-suggestion";

export type CompanionChatMessage = CompanionMessageRow & { pending?: boolean };

/**
 * Logic chat dùng CHUNG cho cả Companion trang đầy đủ (`/v2/companion`)
 * lẫn Companion nổi (widget) — tách ra khỏi `CompanionClient.tsx` khi hợp
 * nhất 2 bề mặt theo đúng chỉ đạo Founder: "hiện bản Companion ở thanh
 * Menu và Companion nổi trên màn hình là một". Gọi thẳng
 * `/api/companion/chat` (route dùng chung 1.0/2.0, thuần API — không phải
 * UI Portal 1.0) — hành vi giữ nguyên 100% so với bản gốc trong
 * `CompanionClient.tsx` trước khi tách.
 */
export function useCompanionChat({
  initialConversationId,
  initialMessages,
}: {
  initialConversationId: string | null;
  initialMessages: CompanionMessageRow[];
}) {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState<CompanionChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [memorySuggestion, setMemorySuggestion] = useState<CompanionMemorySuggestion | null>(null);
  const [memorySaveState, setMemorySaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Đếm cục bộ để sinh id tạm cho tin nhắn optimistic — tránh gọi hàm
  // "impure" (`Date.now()`) trong thân hàm bị React Compiler coi là có thể
  // chạy lúc render (đúng cảnh báo `react-hooks/purity`).
  const pendingIdRef = useRef(0);

  const overLimit = input.length > COMPANION_MESSAGE_MAX_LENGTH;

  async function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (!text || sending || text.length > COMPANION_MESSAGE_MAX_LENGTH) return;
    setSending(true);
    setError(null);
    setInput("");

    pendingIdRef.current += 1;
    const pendingId = `pending-${pendingIdRef.current}`;
    const optimisticUser: CompanionChatMessage = {
      id: pendingId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...prev, optimisticUser]);
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId, message: text }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          res.status === 429
            ? "Companion đang xử lý nhiều yêu cầu cùng lúc — vui lòng chờ một chút rồi thử lại."
            : typeof data?.error === "string"
              ? data.error
              : "Companion chưa thể phản hồi lúc này."
        );
        if (data?.conversationId) setConversationId(data.conversationId);
        if (data?.userMessage) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === pendingId
                ? {
                    id: data.userMessage.id,
                    role: data.userMessage.role,
                    content: data.userMessage.content,
                    createdAt: data.userMessage.created_at,
                    pending: false,
                  }
                : m
            )
          );
        } else {
          setMessages((prev) => prev.filter((m) => m.id !== pendingId));
        }
        return;
      }
      if (data.conversationId) setConversationId(data.conversationId);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== pendingId),
        {
          id: data.userMessage.id,
          role: data.userMessage.role,
          content: data.userMessage.content,
          createdAt: data.userMessage.created_at,
        },
        {
          id: data.assistantMessage.id,
          role: data.assistantMessage.role,
          content: data.assistantMessage.content,
          createdAt: data.assistantMessage.created_at,
        },
      ]);
      setMemorySuggestion(data.memorySuggestion ?? null);
      setMemorySaveState("idle");
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Người dùng chủ động bấm Dừng — không báo lỗi.
      } else {
        setError("Không thể kết nối tới Companion. Kiểm tra mạng và thử lại.");
        setInput(text);
      }
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }

  const send = () => sendMessage(input);
  const stop = () => abortRef.current?.abort();
  const retry = (text: string) => {
    if (sending) return;
    sendMessage(text);
  };

  async function copyMessage(id: string, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
    } catch {
      // clipboard không khả dụng — bỏ qua.
    }
  }

  async function handleSaveMemory() {
    if (!memorySuggestion || memorySaveState !== "idle") return;
    setMemorySaveState("saving");
    try {
      const result = await saveMemorySuggestion(memorySuggestion);
      setMemorySaveState(result === "saved" ? "saved" : "error");
    } catch {
      setMemorySaveState("error");
    }
  }

  function handleDismissMemory() {
    setMemorySuggestion(null);
    setMemorySaveState("idle");
  }

  return {
    conversationId,
    messages,
    input,
    setInput,
    sending,
    error,
    copiedId,
    memorySuggestion,
    memorySaveState,
    overLimit,
    bottomRef,
    send,
    stop,
    retry,
    copyMessage,
    handleSaveMemory,
    handleDismissMemory,
  };
}
