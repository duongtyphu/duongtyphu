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
 *  1. Sidebar dùng `companionExpanded` của `PortalV2Shell` (submenu 5 trang
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
 *  4. "Hồ sơ của bạn" (Lv.7/2,450 XP/12 ngày liên tục/28 huy hiệu) — KHÔNG
 *     bịa số: hệ thống không có gamification (Level/XP/badge) nào thật.
 *     Thay bằng trạng thái trung thực, giữ nguyên khung `.ring`/`.profile-stats`.
 *  5. "Mục tiêu hiện tại" — nối `goal-runtime.ts` THẬT (client-side,
 *     localStorage — cùng nguồn `/portal/goals` 1.0 đang dùng, không phải
 *     bịa) qua `listGoals()`/`getGoalProgress()`. Rỗng trung thực nếu chưa
 *     có goal nào.
 *  6. "Companion gợi ý cho bạn" — không có recommendation engine thật; dùng
 *     2 bài viết mới nhất từ bảng `blog` thật (`getLiveBlogPosts()`, cùng
 *     nguồn đã dùng ở AI Workspace 1.0) làm gợi ý nội dung, bỏ hẳn nhãn thời
 *     gian giả ("Thứ 6" — không có lịch webinar thật).
 *  7. "Công cụ yêu thích" — 5 công cụ thật đầu tiên theo `order` trong bảng
 *     `tools` (bản thiết kế chỉ hiện icon, không có tên — giữ đúng, chỉ
 *     thêm `title` attribute cho icon để không hoàn toàn vô nghĩa khi hover).
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { CompanionMessageRow } from "@/app/portal/companion/actions";
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

const TABS = ["Trò chuyện", "Mục tiêu", "Ghi nhớ", "Tiến trình"];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

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
  const [tab, setTab] = useState(0);
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    setInput("");

    const optimisticUser: CompanionMessageRow = {
      id: `pending-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);

    try {
      const res = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId, message: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Companion chưa thể phản hồi lúc này.");
        return;
      }
      if (data.conversationId) setConversationId(data.conversationId);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticUser.id),
        { id: `${optimisticUser.id}-u`, role: "user", content: text, createdAt: optimisticUser.createdAt },
        {
          id: `${optimisticUser.id}-a`,
          role: "assistant",
          content: data.assistantMessage ?? "",
          createdAt: new Date().toISOString(),
        },
      ]);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch {
      setError("Không thể kết nối tới Companion. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="comp">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          showSearchBox={false}
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

              <div className="tabs">
                {TABS.map((label, i) => (
                  <button key={label} className={i === tab ? "tab active" : "tab"} onClick={() => setTab(i)}>
                    {i === 0 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
                      </svg>
                    ) : null}
                    {i === 1 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="12" cy="12" r=".5" fill="currentColor" />
                      </svg>
                    ) : null}
                    {i === 2 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                      </svg>
                    ) : null}
                    {i === 3 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19h16M7 15l3-4 3 3 5-7" />
                      </svg>
                    ) : null}
                    {label}
                  </button>
                ))}
              </div>

              <div className="chat-card">
                {messages.length === 0 ? (
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
                  messages.map((m) => (
                    <div className={m.role === "user" ? "msg-row user" : "msg-row"} key={m.id}>
                      <div className={m.role === "user" ? "msg-avatar user" : "msg-avatar"}>
                        {m.role === "user" ? (
                          "VD"
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src="/v2-static/assets/icon-companion.png" alt="Companion" />
                        )}
                      </div>
                      <div>
                        <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>
                          {m.content}
                        </div>
                        <span className="msg-time">{formatTime(m.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />

                {error ? (
                  <div className="msg-row">
                    <div className="msg-bubble" style={{ background: "#fdeef0", color: "#b91c2c" }}>
                      {error}
                    </div>
                  </div>
                ) : null}

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
                  <button className="chat-send" onClick={send} disabled={sending}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
                    </svg>
                  </button>
                </div>
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
                  <a onClick={() => go("/v2/ai-workspace")} style={{ cursor: "pointer" }}>
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
