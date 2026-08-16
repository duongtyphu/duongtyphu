"use client";

/* =============================================================================
 * Nhật ký hội thoại 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/Nhat ky hoi thoai.html`.
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh:
 *
 *  1. Danh sách hội thoại (cột trái) — dữ liệu THẬT từ `companion_conversations`
 *     (đã dùng ở `/v2/companion`), nhóm theo ngày thật (Hôm nay/Hôm qua/7
 *     ngày qua/Trước đó) từ `updatedAt` thật — không phải 8 dòng mẫu cố định.
 *     Preview text (dòng mô tả xám dưới tiêu đề) — bảng `companion_conversations`
 *     KHÔNG lưu preview/tin nhắn đầu riêng, chỉ có `title` — dùng `title` cho
 *     cả 2 dòng thay vì bịa preview khác nội dung thật.
 *  2. "Ưa thích" (tab lọc + nút sao) — bảng `companion_conversations` KHÔNG
 *     có cột đánh dấu yêu thích nào — bỏ hẳn nút sao trên từng dòng
 *     (`conv-star`), tab "Ưa thích" giữ nguyên vị trí nhưng luôn hiện trạng
 *     thái rỗng trung thực khi chọn (không có gì để lọc).
 *  3. Chat giữa — đọc/gửi tin nhắn THẬT qua đúng
 *     `getConversationMessages()`/`/api/companion/chat` đã dùng ở
 *     `/v2/companion` (Single Source of Truth, không viết lại).
 *  4. "roadmap-card" (lộ trình 5 bước xây kênh YouTube, ví dụ minh hoạ cứng
 *     trong bản thiết kế) — KHÔNG có cơ chế trích xuất lộ trình có cấu trúc
 *     từ tin nhắn thật (nội dung `companion_messages.content` chỉ là text
 *     thuần) — bỏ hẳn khối này, hiển thị tin nhắn thật dạng text thường.
 *  5. Cột phải — "Thông tin hội thoại": Tiêu đề/Ngày/Số tin nhắn là dữ liệu
 *     THẬT. Bỏ hẳn "Thời lượng"/"Trạng thái"/"Đánh dấu"/tag chủ đề — không
 *     có cơ chế đo thời lượng phiên, trạng thái hoàn thành, đánh dấu yêu
 *     thích, hay gắn thẻ chủ đề nào trong dữ liệu thật.
 *  6. "Tóm tắt nội dung"/"Bài học rút ra"/"Hành động tiếp theo" — không có
 *     hệ thống tóm tắt/rút bài học/gợi ý hành động tự động nào — cả 3 card
 *     hiện trạng thái rỗng trung thực thay vì nội dung mẫu.
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import { getConversationMessages } from "@/app/portal/companion/actions";
import type { CompanionConversationSummary, CompanionMessageRow } from "@/app/portal/companion/actions";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import "../inter-gf.css";
import "./nhat-ky-hoi-thoai.css";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}
function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}
function formatFullDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function groupConversations(conversations: CompanionConversationSummary[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const weekAgo = startOfToday - 7 * 86400000;

  const groups: { label: string; items: CompanionConversationSummary[] }[] = [
    { label: "HÔM NAY", items: [] },
    { label: "HÔM QUA", items: [] },
    { label: "7 NGÀY QUA", items: [] },
    { label: "TRƯỚC ĐÓ", items: [] },
  ];
  for (const c of conversations) {
    const t = new Date(c.updatedAt).getTime();
    if (t >= startOfToday) groups[0].items.push(c);
    else if (t >= startOfYesterday) groups[1].items.push(c);
    else if (t >= weekAgo) groups[2].items.push(c);
    else groups[3].items.push(c);
  }
  return groups.filter((g) => g.items.length > 0);
}

export function NhatKyHoiThoaiClient({
  premium,
  conversations,
  activeId,
  initialMessages,
}: {
  premium: PremiumStatus;
  conversations: CompanionConversationSummary[];
  activeId: string | null;
  initialMessages: CompanionMessageRow[];
}) {
  const router = useRouter();
  const go = (path: string) => router.push(path);

  const [segTab, setSegTab] = useState(0);
  const [currentId, setCurrentId] = useState(activeId);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === currentId) ?? null;
  const groups = groupConversations(conversations);

  /**
   * Đổi hội thoại đang xem — gọi THẲNG Server Action `getConversationMessages()`
   * (Next.js cho phép gọi Server Action trực tiếp từ Client Component, không
   * chỉ qua `<form action>`) thay vì đổi query string rồi trông chờ
   * Server Component cha re-render props mới — `useState(initialMessages)`
   * chỉ nhận giá trị khởi tạo 1 lần, đổi props sau đó KHÔNG tự reset state
   * (cùng lỗi đã sửa cho `goal-runtime.ts` ở `/v2/companion`) nên phải tự
   * gọi lại và `setMessages()` tường minh.
   */
  const openConversation = async (id: string) => {
    if (id === currentId) return;
    setCurrentId(id);
    router.replace(`/v2/nhat-ky-hoi-thoai?c=${id}`, { scroll: false });
    const fresh = await getConversationMessages(id);
    setMessages(fresh);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending || !currentId) return;
    setSending(true);
    setInput("");
    const optimistic: CompanionMessageRow = {
      id: `pending-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const res = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId: currentId, message: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== optimistic.id),
          { id: `${optimistic.id}-u`, role: "user", content: text, createdAt: optimistic.createdAt },
          { id: `${optimistic.id}-a`, role: "assistant", content: data.assistantMessage ?? "", createdAt: new Date().toISOString() },
        ]);
        requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="nkh">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          useTopbarRightWrapper={false}
          promoText="Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện."
          activeHtmlFile="Nhat ky hoi thoai.html"
          companionExpanded
          customSearch={
            <div className="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input type="text" placeholder="Tìm kiếm kiến thức, công cụ, prompt, bài học..." />
            </div>
          }
        >
          <div className="content" style={{ flexDirection: "column" }}>
            <div className="page-head">
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
                </svg>
              </div>
              <div>
                <h1 style={{ margin: 0 }}>Nhật ký hội thoại</h1>
                <p>Lịch sử trò chuyện của bạn với Companion AI. Mỗi cuộc hội thoại là một bước tiến.</p>
              </div>
            </div>

            {conversations.length === 0 ? (
              <div className="empty-hint">
                Chưa có hội thoại nào —{" "}
                <a onClick={() => go("/v2/companion")} style={{ cursor: "pointer" }}>
                  bắt đầu trò chuyện với Companion
                </a>
                .
              </div>
            ) : (
              <div className="wrap-3col">
                <div className="list-col">
                  <div className="list-search">
                    <div className="search">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.3-4.3" />
                      </svg>
                      <input type="text" placeholder="Tìm kiếm hội thoại..." />
                    </div>
                    <button className="filter-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 5h16M7 12h10M10 19h4" />
                      </svg>
                    </button>
                  </div>
                  <div className="seg-tabs">
                    {["Tất cả", "Ưa thích"].map((label, i) => (
                      <div key={label} className={segTab === i ? "seg-tab active" : "seg-tab"} onClick={() => setSegTab(i)}>
                        {label}
                      </div>
                    ))}
                  </div>

                  {segTab === 1 ? (
                    <div className="empty-hint">Chưa có cơ chế đánh dấu yêu thích.</div>
                  ) : (
                    groups.map((group) => (
                      <div key={group.label}>
                        <div className="list-group-label">{group.label}</div>
                        {group.items.map((c) => (
                          <div
                            key={c.id}
                            className={c.id === currentId ? "conv-item active" : "conv-item"}
                            onClick={() => openConversation(c.id)}
                          >
                            <div className="conv-top">
                              <span className="t">{c.title}</span>
                              <span className="time">{formatShortDate(c.updatedAt)}</span>
                            </div>
                            <p>{c.title}</p>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-col">
                  {!activeConversation ? (
                    <div className="empty-hint">Chọn 1 hội thoại ở danh sách bên trái để xem chi tiết.</div>
                  ) : (
                    <>
                      <div className="chat-head">
                        <div>
                          <h2>{activeConversation.title}</h2>
                          <div className="meta">
                            {formatFullDate(activeConversation.updatedAt)} · {messages.length} tin nhắn
                          </div>
                        </div>
                      </div>

                      {messages.map((m) => (
                        <div className={m.role === "user" ? "msg-row user" : "msg-row"} key={m.id}>
                          <div className={m.role === "user" ? "msg-avatar user" : "msg-avatar"}>
                            {m.role === "user" ? (
                              "VD"
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src="/v2-static/assets/icon-companion.png" alt="" />
                            )}
                          </div>
                          <div>
                            <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>
                              {m.content}
                            </div>
                            <span className="msg-time">{formatTime(m.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                      <div ref={bottomRef} />

                      <div className="chat-input-row">
                        <input
                          type="text"
                          placeholder="Nhắn tin cho Companion AI..."
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
                      <div className="disclaimer">Companion AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.</div>
                    </>
                  )}
                </div>

                <aside className="right-col">
                  <div className="card">
                    <div className="card-head">
                      <h4>Thông tin hội thoại</h4>
                    </div>
                    {!activeConversation ? (
                      <div className="empty-hint">Chưa chọn hội thoại nào.</div>
                    ) : (
                      <>
                        <div className="info-row">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                          </svg>
                          <div>
                            <span className="l">Tiêu đề</span>
                            <span className="v">{activeConversation.title}</span>
                          </div>
                        </div>
                        <div className="info-row">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M8 2v4M16 2v4M3 10h18" />
                          </svg>
                          <div>
                            <span className="l">Cập nhật gần nhất</span>
                            <span className="v">{formatFullDate(activeConversation.updatedAt)}</span>
                          </div>
                        </div>
                        <div className="info-row">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
                          </svg>
                          <div>
                            <span className="l">Số tin nhắn</span>
                            <span className="v">{messages.length} tin nhắn</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="card summary-card">
                    <div className="card-head">
                      <h4>Tóm tắt nội dung</h4>
                    </div>
                    <div className="empty-hint">Chưa có cơ chế tóm tắt tự động — tính năng này sẽ cập nhật khi có.</div>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <h4>Bài học rút ra</h4>
                    </div>
                    <div className="empty-hint">Chưa có cơ chế rút bài học tự động.</div>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <h4>Hành động tiếp theo</h4>
                    </div>
                    <div className="action-row" onClick={() => go("/portal/goals")}>
                      <div className="ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <circle cx="12" cy="12" r="4" />
                          <circle cx="12" cy="12" r=".5" fill="currentColor" />
                        </svg>
                      </div>
                      Xem mục tiêu của bạn
                      <span className="arrow">›</span>
                    </div>
                    <div className="action-row" onClick={() => go("/v2/companion")}>
                      <div className="ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
                        </svg>
                      </div>
                      Tiếp tục trò chuyện với Companion
                      <span className="arrow">›</span>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
