"use client";

import type { RefObject } from "react";
import { MarkdownLite } from "@/components/v2/companion/MarkdownLite";
import { COMPANION_MESSAGE_MAX_LENGTH } from "@/lib/portal/companion-chat";
import type { CompanionChatMessage } from "@/lib/v2/companion/useCompanionChat";
import type { CompanionMemorySuggestion } from "@/ai/runtime/public-chat-response";

/** `HH:mm · dd/mm/yyyy` — đúng công thức 1.0's `formatMessageTimestamp()`. */
function formatMessageTimestamp(createdAt: string) {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "";
  const time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const date = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${time} · ${date}`;
}

const typingDotStyle = (delay: string): React.CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  background: "var(--violet)",
  display: "inline-block",
  animationName: "sparkleTwinkle",
  animationDuration: "1.1s",
  animationIterationCount: "infinite",
  animationDelay: delay,
});

const actionBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--muted)",
  padding: 0,
};

const QUICK_CHIPS: [string, React.ReactNode][] = [
  [
    "Đặt câu hỏi",
    <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>,
  ],
  [
    "Gợi ý bài học",
    <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
    </svg>,
  ],
  [
    "Tạo kế hoạch",
    <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>,
  ],
  [
    "Phân tích & đánh giá",
    <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19h16M7 15l3-4 3 3 5-7" />
    </svg>,
  ],
  [
    "Công cụ AI",
    <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 21h8M12 18v3" />
    </svg>,
  ],
];

/**
 * Vùng chat dùng chung (danh sách tin nhắn + ô nhập + gợi ý nhanh) — tách
 * ra để cả Companion trang đầy đủ (`/v2/companion`) lẫn Companion nổi
 * (widget) dùng đúng 1 UI, đúng 1 bộ CSS (`.comp .chat-input-row` — MỘT
 * viền duy nhất quanh cả hàng nhập liệu, KHÔNG có khung lồng bên trong —
 * khác bug "khung đôi" của `CompanionComposer.tsx` (Portal 1.0) mà widget
 * cũ dùng).
 */
export function CompanionChatArea({
  messages,
  sending,
  error,
  copiedId,
  memorySuggestion,
  memorySaveState,
  input,
  onInputChange,
  onSend,
  onStop,
  onCopy,
  onRetry,
  onSaveMemory,
  onDismissMemory,
  bottomRef,
  showChips = true,
  compact = false,
}: {
  messages: CompanionChatMessage[];
  sending: boolean;
  error: string | null;
  copiedId: string | null;
  memorySuggestion: CompanionMemorySuggestion | null;
  memorySaveState: "idle" | "saving" | "saved" | "error";
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  onCopy: (id: string, content: string) => void;
  onRetry: (text: string) => void;
  onSaveMemory: () => void;
  onDismissMemory: () => void;
  bottomRef: RefObject<HTMLDivElement | null>;
  showChips?: boolean;
  compact?: boolean;
}) {
  const overLimit = input.length > COMPANION_MESSAGE_MAX_LENGTH;
  const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf("assistant");
  const lastUserBefore = (index: number) => [...messages.slice(0, index)].reverse().find((m) => m.role === "user");

  return (
    <>
      <div className="chat-messages">
        {messages.length === 0 && !sending ? (
          <div className="msg-row">
            <div className="msg-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/v2-static/assets/icon-companion.png" alt="Companion" />
            </div>
            <div>
              <div className="msg-bubble">
                Xin chào! 👋
                <br />
                Mình là Companion, AI Mentor của bạn.
                <br />
                {compact
                  ? "Bạn cần mình giúp gì hôm nay? 💜"
                  : "Hôm nay bạn muốn học gì, làm gì, hay khám phá điều gì mới? Mình luôn ở đây để hỗ trợ bạn. 💜"}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m, index) => {
            if (m.role === "user") {
              return (
                <div className="msg-row user" key={m.id} style={m.pending ? { opacity: 0.7 } : undefined}>
                  <div className="msg-avatar user">VD</div>
                  <div>
                    <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>
                      {m.content}
                    </div>
                    {!m.pending && <span className="msg-time">{formatMessageTimestamp(m.createdAt)}</span>}
                  </div>
                </div>
              );
            }

            const isLast = index === lastAssistantIndex;
            const precedingUser = lastUserBefore(index);

            return (
              <div className="msg-row" key={m.id}>
                <div className="msg-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/v2-static/assets/icon-companion.png" alt="Companion" />
                </div>
                <div>
                  <div className="msg-bubble">
                    <MarkdownLite text={m.content} />
                  </div>
                  <span className="msg-time">{formatMessageTimestamp(m.createdAt)}</span>
                  <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                    <button type="button" onClick={() => onCopy(m.id, m.content)} style={actionBtnStyle}>
                      {copiedId === m.id ? "Đã sao chép" : "Sao chép"}
                    </button>
                    {isLast && !sending && precedingUser ? (
                      <button type="button" onClick={() => onRetry(precedingUser.content)} style={actionBtnStyle}>
                        Thử lại
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {sending ? (
          <div className="msg-row">
            <div className="msg-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/v2-static/assets/icon-companion.png" alt="Companion" />
            </div>
            <div className="msg-bubble" style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
              <span style={typingDotStyle("0s")} />
              <span style={typingDotStyle(".2s")} />
              <span style={typingDotStyle(".4s")} />
            </div>
          </div>
        ) : null}

        {memorySuggestion ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              background: "var(--violet-light)",
              border: "1px solid var(--violet)",
              borderRadius: 12,
              padding: "12px 14px",
            }}
          >
            {memorySaveState === "saved" ? (
              <div style={{ fontSize: 12.5, color: "var(--violet-dark)", fontWeight: 700 }}>Đã lưu vào My Story.</div>
            ) : (
              <>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--violet-dark)" }}>
                  Đây có vẻ là một khoảnh khắc đáng nhớ — lưu vào My Story nhé?
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text)", fontStyle: "italic" }}>
                  &quot;{memorySuggestion.content}&quot;
                </div>
                {memorySaveState === "error" ? (
                  <div style={{ fontSize: 11.5, color: "#b91c2c" }}>Chưa lưu được — vui lòng thử lại.</div>
                ) : null}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={onSaveMemory}
                    disabled={memorySaveState === "saving"}
                    className="chip"
                    style={{ background: "var(--violet)", color: "#fff", cursor: "pointer" }}
                  >
                    {memorySaveState === "saving" ? "Đang lưu…" : "Lưu vào My Story"}
                  </button>
                  <button type="button" onClick={onDismissMemory} className="chip" style={{ cursor: "pointer" }}>
                    Bỏ qua
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}

        <div ref={bottomRef} />

        {error ? (
          <div className="msg-row">
            <div className="msg-bubble" style={{ background: "#fdeef0", color: "#b91c2c" }}>
              {error}
            </div>
          </div>
        ) : null}
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Nhắn tin cho Companion..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          disabled={sending}
        />
        {sending ? (
          <button className="chat-send" onClick={onStop} aria-label="Dừng phản hồi">
            <svg viewBox="0 0 24 24" fill="#fff">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <button className="chat-send" onClick={onSend} disabled={!input.trim() || overLimit} aria-label="Gửi tin nhắn">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
            </svg>
          </button>
        )}
      </div>
      {overLimit ? (
        <div style={{ fontSize: 11, fontWeight: 700, color: "#b91c2c" }}>
          Quá dài — tối đa {COMPANION_MESSAGE_MAX_LENGTH} ký tự ({input.length}/{COMPANION_MESSAGE_MAX_LENGTH}).
        </div>
      ) : null}
      {showChips ? (
        <div className="chip-row">
          {QUICK_CHIPS.map(([label, icon]) => (
            <div className="chip" key={label as string} onClick={() => onInputChange((label as string) + ": ")}>
              {icon}
              {label}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
