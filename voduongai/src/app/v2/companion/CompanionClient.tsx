"use client";

/* =============================================================================
 * Companion 2.0 — chuyển 1:1 từ `design_handoff_vo_duong_ai/Companion.html`.
 *
 * NGUYÊN TẮC: markup/class/SVG giữ NGUYÊN VĂN, chỉ khác 6 điều đã ghi trong
 * `AiWorkspaceClient.tsx`/`HocVienClient.tsx` (prefix/6 điều chỉnh CSS).
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh:
 *
 *  1. Sidebar dùng `companionExpanded` của `PortalV2Shell` (submenu 3 trang
 *     Companion) — không phải chrome chung, xem chú thích trong Shell.
 *  2. Topbar KHÔNG có search-box (đúng bản gốc — `.topbar{justify-content:
 *     flex-end}`, không có `.search-box`), profile hiện "Lv.X · Y XP" —
 *     NHƯNG hệ thống KHÔNG có cơ chế Level/XP thật nào (đã audit: không
 *     bảng/cột nào lưu XP, khác `progress.percent` thật của Học viện AI) —
 *     giữ đúng vị trí "Lv.X · Y XP" trong markup nhưng đổi nội dung sang
 *     dòng trung thực "Đang trò chuyện" (không bịa số Lv/XP).
 *  3. CHAT — PHẦN DUY NHẤT CỦA TRANG NÀY CÓ BACKEND THẬT: đọc/ghi qua đúng
 *     bảng `companion_conversations`/`companion_messages` + API
 *     `/api/companion/chat` đã có sẵn từ 1.0 (Companion Chat MVP, không xây
 *     lại — Single Source of Truth). Cuộc trò chuyện gần nhất của user (nếu
 *     có) được tải sẵn server-side; gửi tin nhắn gọi thẳng API thật, không
 *     mock. Tin nhắn chào mừng đầu tiên trong bản thiết kế CHỈ hiện khi
 *     CHƯA có cuộc trò chuyện nào (copy tĩnh của app, không phải dữ liệu
 *     user — an toàn hiển thị).
 *
 *     Theo yêu cầu Founder "bê nguyên Companion từ phiên bản cũ, chỉ thay
 *     đổi giao diện 2.0" — đã nâng cấp phần tương tác chat lên đúng mức
 *     production của 1.0 (`CompanionChatShell`/`CompanionMessageList`),
 *     KHÔNG đổi 1 dòng markup/CSS nào của bản thiết kế 2.0:
 *       - Render Markdown thật cho câu trả lời (`MarkdownLite`, tái dùng
 *         nguyên bản 1.0 — code fence/inline code/đậm/nghiêng — không viết
 *         lại renderer thứ 2).
 *       - Ngày giờ thật dưới mỗi tin nhắn (`HH:mm · dd/mm/yyyy`, cùng công
 *         thức `formatMessageTimestamp` của 1.0), không chỉ giờ.
 *       - Chỉ báo "đang trả lời" (3 chấm nhấp nháy, tái dùng animation
 *         `sparkleTwinkle` đã có sẵn trong `companion.css`) trong lúc chờ
 *         API — người dùng biết Companion đang xử lý thật, không phải đứng
 *         hình.
 *       - "Sao chép"/"Thử lại" dưới mỗi câu trả lời (Thử lại chỉ hiện ở câu
 *         trả lời cuối, gửi lại đúng nội dung tin nhắn user liền trước —
 *         không có endpoint "regenerate" thật nào, đây là lượt gửi mới
 *         hoàn toàn, đúng cách 1.0 làm, không bịa cơ chế regenerate).
 *       - Nút gửi đổi thành nút Dừng khi đang chờ phản hồi (`AbortController`
 *         huỷ request thật, không chỉ đổi icon).
 *       - Giới hạn độ dài tin nhắn (`COMPANION_MESSAGE_MAX_LENGTH`, tái
 *         dùng đúng hằng số 1.0 dùng — `src/lib/portal/companion-chat.ts`),
 *         chặn gửi + cảnh báo khi vượt quá.
 *     Đây CHÍNH LÀ luồng thật (cùng API/DB/AI Provider Registry 1.0 dùng),
 *     không phải mock — nâng cấp phần UI feedback (markdown/ngày giờ/đang
 *     trả lời/sao chép/thử lại/dừng/giới hạn ký tự) để trải nghiệm khớp
 *     đúng mức production, đúng yêu cầu "phải có khả năng tự trả lời như
 *     phiên bản đang chạy production hiện tại".
 *  4. Đã BỎ HẲN thanh tab "Trò chuyện/Mục tiêu/Ghi nhớ/Tiến trình" (theo
 *     yêu cầu Founder) — bản thiết kế gốc dùng 4 tab này chỉ đổi trạng thái
 *     active, không có nội dung khác nhau thật sự đằng sau (3 tab còn lại
 *     không có view riêng) nên bỏ hẳn thay vì giữ 1 thanh tab trơ.
 *  5. "Hồ sơ của bạn" (Lv.7/2,450 XP/12 ngày liên tục/28 huy hiệu) — KHÔNG
 *     bịa số: hệ thống không có gamification (Level/XP/badge) nào thật.
 *     Thay bằng trạng thái trung thực, giữ nguyên khung `.ring`/`.profile-stats`.
 *  6. "Mục tiêu hiện tại" — nối `goal-runtime.ts` THẬT (client-side,
 *     localStorage — cùng nguồn `/portal/goals` 1.0 đang dùng, không phải
 *     bịa) qua `listGoals()`/`getGoalProgress()`. Rỗng trung thực nếu chưa
 *     có goal nào.
 *  7. "Companion gợi ý cho bạn" — không có recommendation engine thật; dùng
 *     2 bài viết mới nhất từ bảng `blog` thật (`getLiveBlogPosts()`, cùng
 *     nguồn đã dùng ở AI Workspace 1.0) làm gợi ý nội dung, bỏ hẳn nhãn thời
 *     gian giả ("Thứ 6" — không có lịch webinar thật).
 *  8. "Công cụ yêu thích" — 5 công cụ thật đầu tiên theo `order` trong bảng
 *     `tools` (bản thiết kế chỉ hiện icon, không có tên — giữ đúng, chỉ
 *     thêm `title` attribute cho icon để không hoàn toàn vô nghĩa khi hover).
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { CompanionMessageRow } from "@/app/portal/companion/actions";
import { COMPANION_MESSAGE_MAX_LENGTH } from "@/lib/portal/companion-chat";
import { MarkdownLite } from "@/components/portal/companion/chat/MarkdownLite";
import type { GoalRecord } from "@/lib/portal/foundation/goal-runtime";
import { getGoalProgress, listGoals } from "@/lib/portal/foundation/goal-runtime";
import type { BlogPost } from "@/data/blog";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import "../inter-gf.css";
import "./companion.css";

const TOOL_ICONS: { bg: string; icon: React.ReactNode; title: string }[] = [
  {
    bg: "linear-gradient(145deg,#8b6bff,#5a37e6)",
    title: "Trợ lý AI",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
    title: "Trợ lý AI",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5c2.4 1.8 3.8 4.6 3.8 8.3 0 2-.5 3.8-1.3 5.3l-2.5 2.4-2.5-2.4c-.8-1.5-1.3-3.3-1.3-5.3 0-3.7 1.4-6.5 3.8-8.3z" />
        <circle cx="12" cy="10" r="1.7" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
    title: "Viết lách & Nội dung",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 4.5h15v11.5H9l-4.5 4z" />
        <path d="M8.5 8.8h7M8.5 12h4.5" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    title: "Nghiên cứu & Phân tích",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    title: "Nghiên cứu & Phân tích",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="8.5" r="5.5" />
        <path d="M9 12.5L3 19M13.5 5v3.5l2.5 1.5" />
      </svg>
    ),
  },
];

type Msg = CompanionMessageRow & { pending?: boolean };

/** `HH:mm · dd/mm/yyyy` — đúng công thức `formatMessageTimestamp()` của
 * `CompanionMessageList.tsx` (1.0), giữ nguyên khi nâng cấp phần hiển thị. */
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

export function CompanionClient({
  premium,
  initialConversationId,
  initialMessages,
  suggestedPosts,
}: {
  premium: PremiumStatus;
  initialConversationId: string | null;
  initialMessages: CompanionMessageRow[];
  suggestedPosts: BlogPost[];
}) {
  const router = useRouter();
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Đếm cục bộ để sinh id tạm cho tin nhắn optimistic — tránh gọi hàm
  // "impure" (`Date.now()`) trong thân hàm bị React Compiler coi là có thể
  // chạy lúc render (đúng cảnh báo `react-hooks/purity`), dù thực tế hàm
  // này chỉ gọi từ sự kiện gửi/thử lại.
  const pendingIdRef = useRef(0);

  // `listGoals()` đọc `window.localStorage` — không thể lấy giá trị thật lúc
  // SSR/initial render (server không có `window`). Đọc trong `useEffect`
  // (chạy sau khi mount ở client) thay vì initializer của `useState`, vì
  // React TÁI DÙNG giá trị khởi tạo từ lần render server, không tự gọi lại
  // hàm initializer khi hydrate — nếu đọc trong initializer, danh sách sẽ
  // mãi mãi rỗng dù localStorage có dữ liệu thật.
  const [goals, setGoals] = useState<GoalRecord[]>([]);
  useEffect(() => {
    // Đọc localStorage chỉ có ở client sau mount — phải set trong effect
    // (cùng pattern `GrowthActivityPanel.tsx`).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoals(listGoals());
  }, []);
  const activeGoal = goals.find((g) => g.status === "active") ?? goals[0] ?? null;

  const go = (path: string) => router.push(path);

  const overLimit = input.length > COMPANION_MESSAGE_MAX_LENGTH;

  async function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (!text || sending || text.length > COMPANION_MESSAGE_MAX_LENGTH) return;
    setSending(true);
    setError(null);
    setInput("");

    pendingIdRef.current += 1;
    const pendingId = `pending-${pendingIdRef.current}`;
    const optimisticUser: Msg = {
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
          // Tin nhắn đã lưu thật ở server (vd. lỗi 502 khi AI Provider thất
          // bại) — thay bong bóng "đang gửi" bằng dữ liệu thật thay vì để
          // nó kẹt vĩnh viễn ở trạng thái mờ/không có giờ (đúng cách
          // `CompanionChatShell.tsx` 1.0 xử lý).
          setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...data.userMessage, pending: false } : m)));
        } else {
          // Chưa có gì được lưu (lỗi xác thực/tạo conversation) — bỏ hẳn
          // bong bóng tạm, không để kẹt lại trên màn hình.
          setMessages((prev) => prev.filter((m) => m.id !== pendingId));
        }
        return;
      }
      if (data.conversationId) setConversationId(data.conversationId);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== pendingId),
        { id: `${pendingId}-u`, role: "user", content: text, createdAt: optimisticUser.createdAt },
        {
          id: `${pendingId}-a`,
          role: "assistant",
          content: data.assistantMessage ?? "",
          createdAt: new Date().toISOString(),
        },
      ]);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Người dùng chủ động bấm Dừng — không báo lỗi, chỉ bỏ tin nhắn
        // optimistic (xử lý chung ở dòng `setMessages` bên dưới).
      } else {
        setError("Không thể kết nối tới Companion. Kiểm tra mạng và thử lại.");
        // Lỗi mạng xảy ra TRƯỚC khi tới được server — chưa có gì được lưu,
        // trả lại nội dung vào ô nhập để không mất tin nhắn, đúng cách
        // `CompanionChatShell.tsx` 1.0 xử lý.
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
      // clipboard không khả dụng — bỏ qua, không có gì để báo lỗi thêm
    }
  }

  const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf("assistant");
  const lastUserBefore = (index: number) => [...messages.slice(0, index)].reverse().find((m) => m.role === "user");

  return (
    <div className="comp">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          showSearchBox={false}
          useTopbarRightWrapper={false}
          profileSubtitle="Đang trò chuyện"
          promoText="Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện."
          activeHtmlFile="Companion.html"
          companionExpanded
        >
          <div className="content">
            <div className="center-col">
              <div className="page-head">
                <div className="page-head-text">
                  <h1>
                    Companion AI <span className="mentor-pill">AI Mentor của bạn</span>
                  </h1>
                  <p>Không chỉ trả lời, mà đồng hành cùng bạn trên hành trình học tập và phát triển.</p>
                </div>
                <div className="head-bot">
                  {/* eslint-disable-next-line @next/next/no-img-element -- ảnh minh hoạ tĩnh cố định 96px, giữ đúng markup gốc */}
                  <img src="/v2-static/assets/icon-companion.png" alt="Companion AI" />
                </div>
              </div>

              <div className="chat-card">
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
                        Hôm nay bạn muốn học gì, làm gì, hay khám phá điều gì mới? Mình luôn ở đây để hỗ trợ bạn. 💜
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
                            <button type="button" onClick={() => copyMessage(m.id, m.content)} style={actionBtnStyle}>
                              {copiedId === m.id ? "Đã sao chép" : "Sao chép"}
                            </button>
                            {isLast && !sending && precedingUser ? (
                              <button type="button" onClick={() => retry(precedingUser.content)} style={actionBtnStyle}>
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
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") send();
                    }}
                    disabled={sending}
                  />
                  {sending ? (
                    <button className="chat-send" onClick={stop} aria-label="Dừng phản hồi">
                      <svg viewBox="0 0 24 24" fill="#fff">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      </svg>
                    </button>
                  ) : (
                    <button className="chat-send" onClick={send} disabled={!input.trim() || overLimit} aria-label="Gửi tin nhắn">
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
                <div className="chip-row">
                  {[
                    ["Đặt câu hỏi", <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>],
                    ["Gợi ý bài học", <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" /></svg>],
                    ["Tạo kế hoạch", <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>],
                    ["Phân tích & đánh giá", <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19h16M7 15l3-4 3 3 5-7" /></svg>],
                    ["Công cụ AI", <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></svg>],
                  ].map(([label, icon]) => (
                    <div
                      className="chip"
                      key={label as string}
                      onClick={() => setInput((label as string) + ": ")}
                    >
                      {icon}
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Hồ sơ của bạn</h4>
                </div>
                <div className="ring-wrap">
                  <div className="ring" style={{ background: "var(--violet-light)" }}>
                    <div className="ring-inner">
                      <div className="lv" style={{ fontSize: 12 }}>
                        —
                      </div>
                      <div className="lv-label">Chưa có dữ liệu</div>
                    </div>
                  </div>
                  <div className="profile-stats">
                    <div className="profile-stat" style={{ color: "var(--muted)" }}>
                      Hệ thống chưa theo dõi cấp độ/điểm kinh nghiệm — số liệu sẽ hiện khi có.
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Mục tiêu hiện tại</h4>
                  <a onClick={() => go("/portal/goals")} style={{ cursor: "pointer" }}>
                    Xem tất cả
                  </a>
                </div>
                {activeGoal ? (
                  <>
                    <div className="goal-title">
                      <div className="ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <circle cx="12" cy="12" r="4" />
                          <circle cx="12" cy="12" r=".5" fill="#fff" />
                        </svg>
                      </div>
                      <div>{activeGoal.title}</div>
                    </div>
                    <div className="goal-progress-track">
                      <div className="goal-progress-fill" style={{ width: `${getGoalProgress(activeGoal.goalId)}%` }} />
                    </div>
                  </>
                ) : (
                  <div className="empty-hint">
                    Chưa có mục tiêu nào —{" "}
                    <a onClick={() => go("/portal/goals/new")} style={{ cursor: "pointer" }}>
                      tạo mục tiêu đầu tiên
                    </a>
                    .
                  </div>
                )}
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Companion gợi ý cho bạn</h4>
                </div>
                {suggestedPosts.length === 0 ? (
                  <div className="empty-hint">Chưa có gợi ý nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                ) : (
                  suggestedPosts.map((post) => (
                    <div className="reco-row" key={post.slug} onClick={() => go(`/blogai/${post.slug}`)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                      </svg>
                      {post.title}
                    </div>
                  ))
                )}
                <a
                  onClick={() => go("/blogai")}
                  style={{ display: "block", textAlign: "center", fontSize: "12.5px", fontWeight: 700, marginTop: 10, cursor: "pointer" }}
                >
                  Xem thêm gợi ý →
                </a>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Công cụ yêu thích</h4>
                  <a onClick={() => go("/v2/hoc-vien-ai")} style={{ cursor: "pointer" }}>
                    Quản lý
                  </a>
                </div>
                <div className="tools-grid">
                  {TOOL_ICONS.map((t, i) => (
                    <div className="tool-ico" style={{ background: t.bg }} key={i} title={t.title}>
                      {t.icon}
                    </div>
                  ))}
                </div>
              </div>

              <div className="help-card">
                <h4 style={{ fontSize: 14, fontWeight: 800 }}>Bạn cần hỗ trợ thêm?</h4>
                <p>Companion luôn sẵn sàng đồng hành cùng bạn.</p>
                <button onClick={() => document.querySelector<HTMLInputElement>(".comp .chat-input-row input")?.focus()}>
                  Bắt đầu trò chuyện
                </button>
              </div>
            </aside>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
