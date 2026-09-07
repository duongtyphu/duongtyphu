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
 *  5. "Hồ sơ của bạn" — TASK #60 (Giai đoạn 2 rework): KHÔNG bịa số
 *     Level/XP/badge (hệ thống không có gamification thật) — thay bằng hồ
 *     sơ THẬT của học viên: tên/email (`premium.fullName`/`premium.email`,
 *     cùng nguồn `ProfileMenu.tsx` dùng), trạng thái Premium, và vòng tròn
 *     `.ring` giờ hiển thị % tiến độ Học viện AI THẬT
 *     (`getAcademyProgress()`, `src/lib/portal/live-academy.ts` — cùng
 *     nguồn `/v2/hoc-vien-ai` dùng cho tab "Tiến độ của tôi") thay vì
 *     82% cứng trong CSS gốc. 0% trung thực khi chưa đăng nhập/chưa học bài
 *     nào — không suy diễn.
 *  6. "Mục tiêu hiện tại" — TASK #61: vẫn nối `goal-runtime.ts` THẬT
 *     (Phase 40, Supabase-backed theo `member_id`, qua
 *     `listGoals()`/`getGoalProgress()`) NHƯNG 2 link "Xem tất cả"/"tạo mục
 *     tiêu đầu tiên" đổi từ `/portal/goals`/`/portal/goals/new` (Portal 1.0)
 *     sang `/v2/muc-tieu` (Bảng Mục tiêu 2.0 mới, `src/app/v2/muc-tieu/`) —
 *     đúng yêu cầu Founder "không được liên kết qua trang portal 1.0".
 *  7. "Companion gợi ý cho bạn" — TASK #62: BỎ HẲN 2 bài Blog AI (Founder
 *     đã xoá Blog AI, không dùng nữa) — thay bằng gợi ý tĩnh tới các mục
 *     KHÁC trong chính Portal 2.0 (`INTERNAL_SUGGESTIONS` bên dưới —
 *     "Mỗi ngày một ý tưởng"/"Học viện AI"/"Dự án & Cơ hội", đúng ví dụ
 *     Founder nêu) — không phải recommendation engine, chỉ là điều hướng
 *     nội bộ trung thực (mọi trang đích đều có nội dung thật).
 *  8. "Công cụ yêu thích" (TASK #63) — ĐÃ XOÁ HẲN khỏi UI theo yêu cầu
 *     Founder ("bỏ mục Công cụ yêu thích và hộp 'Bạn cần hỗ trợ thêm?' ở
 *     cột phải"). Dọn theo: prop `favoriteTools`/type
 *     `CompanionFavoriteToolsResult`, `CATEGORY_STYLE`/
 *     `DEFAULT_CATEGORY_STYLE`/`faviconUrlFor()` (chỉ dùng cho khối này),
 *     `getCompanionFavoriteTools()` khỏi `page.tsx` — không còn consumer
 *     nào của `lib/portal/live-companion-favorites.ts` trong toàn bộ dự
 *     án, đã xoá luôn file đó (tránh dead code).
 *  9. "Bạn cần hỗ trợ thêm?" (`.help-card`) — ĐÃ XOÁ HẲN, cùng yêu cầu
 *     trên. Cột phải giờ còn đúng 3 card: "Hồ sơ của bạn"/"Mục tiêu hiện
 *     tại"/"Companion gợi ý cho bạn".
 * 10. **Cột giữa "cố định"** — Founder: "Cho trang giữa giữ cố định không
 *     di chuyển lên xuống được." Trước đây `.content` không giới hạn
 *     chiều cao, nên khi `.right-col` (nhiều card) cao hơn `.center-col`,
 *     CẢ TRANG cuộn dọc theo, kéo cả khung chat (`.chat-card`, đã cố định
 *     đúng `calc(100vh - 233px)` từ trước) trôi lên/xuống theo — trái ý
 *     "cố định". Đã giới hạn `.content{height:calc(100vh - 71px);
 *     overflow:hidden}` (71px = topbar, cùng số đo đã dùng để tính
 *     `.chat-card`) + `.right-col{height:100%;overflow-y:auto}` (tự cuộn
 *     riêng bên trong) — xem docblock đầy đủ trong `companion.css`.
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { CompanionMessageRow } from "@/app/portal/companion/actions";
import { COMPANION_MESSAGE_MAX_LENGTH } from "@/lib/portal/companion-chat";
import { MarkdownLite } from "@/components/portal/companion/chat/MarkdownLite";
import type { GoalRecord } from "@/lib/portal/foundation/goal-runtime";
import { getGoalProgress, listGoals, hydrateGoalRuntime } from "@/lib/portal/foundation/goal-runtime";
import type { AcademyProgress } from "@/lib/portal/live-academy";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import type { CompanionMemorySuggestion } from "@/ai/runtime/public-chat-response";
import { saveMemorySuggestion } from "@/lib/portal/companion/memory-suggestion";

import "../inter-gf.css";
import "./companion.css";

/** Task #62 — gợi ý tĩnh tới các mục KHÁC trong Portal 2.0 (thay 2 bài Blog
    AI đã bỏ). Cả 3 đích đều là hub thật, luôn có nội dung — không cần dữ
    liệu server để quyết định hiện/ẩn. */
const INTERNAL_SUGGESTIONS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "Mỗi ngày một ý tưởng",
    href: "/v2/moi-ngay-mot-y-tuong",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1V17a1 1 0 001 1h4a1 1 0 001-1v-.2c0-.8.4-1.6 1-2.1A7 7 0 0012 2z" />
      </svg>
    ),
  },
  {
    label: "Học viện AI",
    href: "/v2/hoc-vien-ai",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
      </svg>
    ),
  },
  {
    label: "Dự án & Cơ hội",
    href: "/v2/du-an-co-hoi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
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
  academyProgress,
}: {
  premium: PremiumStatus;
  initialConversationId: string | null;
  initialMessages: CompanionMessageRow[];
  academyProgress: AcademyProgress;
}) {
  const router = useRouter();
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Giai đoạn 2, mục 2a — ghi nhớ tự động phát hiện + xác nhận 1 chạm.
  // Chỉ giữ gợi ý của LƯỢT GẦN NHẤT (không xếp chồng nhiều gợi ý cũ).
  const [memorySuggestion, setMemorySuggestion] = useState<CompanionMemorySuggestion | null>(null);
  const [memorySaveState, setMemorySaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
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
    // Phase 40 — hydrate cache từ Supabase (member_id thật) trước khi đọc,
    // thay cho localStorage per-browser cũ (cùng pattern `GrowthActivityPanel.tsx`).
    (async () => {
      await hydrateGoalRuntime();
       
      setGoals(listGoals());
    })();
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
          //
          // BUG THẬT ĐÃ SỬA — trước đây spread thẳng `data.userMessage`
          // (shape server `{id,role,content,created_at}`, SNAKE_CASE) vào
          // `Msg` (kỳ vọng `createdAt` camelCase) — `m.createdAt` luôn
          // `undefined` cho nhánh lỗi này, `formatMessageTimestamp()` âm
          // thầm trả về chuỗi rỗng (không crash, chỉ mất giờ hiển thị).
          // Map tường minh đúng field, khớp `CompanionMessageRow` cục bộ.
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
          // Chưa có gì được lưu (lỗi xác thực/tạo conversation) — bỏ hẳn
          // bong bóng tạm, không để kẹt lại trên màn hình.
          setMessages((prev) => prev.filter((m) => m.id !== pendingId));
        }
        return;
      }
      if (data.conversationId) setConversationId(data.conversationId);
      // BUG NGHIÊM TRỌNG ĐÃ SỬA — "mỗi khi chát hệ thống tải lại trang":
      // `data.assistantMessage` (response `/api/companion/chat`, xem
      // `PublicChatResponse`) là 1 OBJECT ĐẦY ĐỦ
      // `{id,role,content,created_at}`, KHÔNG PHẢI chuỗi text — trước đây
      // gán THẲNG cả object này vào `content` (`content: data.assistantMessage
      // ?? ""`). `<MarkdownLite text={m.content} />` sau đó gọi
      // `text.split(...)` trên 1 OBJECT → `TypeError: text.split is not a
      // function` ở MỌI LƯỢT chat thành công — exception này bị Next.js
      // Error Boundary cấp route (`/v2/error.tsx`) bắt, thay thế TOÀN BỘ
      // cây UI bằng màn hình lỗi → đúng cảm giác "cả trang bị tải lại"
      // Founder mô tả (không phải navigation thật, là unmount do crash).
      // Sửa: trích đúng `.content`/`.id`/`.created_at` từ 2 object server
      // trả về (cùng cách `CompanionChatShell.tsx`'s `toChatMessage()` xử
      // lý), không tự tổng hợp `createdAt`/`id` giả nữa.
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
      // Giai đoạn 2, mục 2a — API trả `memorySuggestion` khi lượt này có
      // khoảnh khắc đáng nhớ (status "keep"), `null` khi không có gì.
      setMemorySuggestion(data.memorySuggestion ?? null);
      setMemorySaveState("idle");
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

  async function handleSaveMemory() {
    if (!memorySuggestion || memorySaveState !== "idle") return;
    setMemorySaveState("saving");
    try {
      const result = await saveMemorySuggestion(memorySuggestion);
      setMemorySaveState(result === "saved" ? "saved" : "error");
    } catch {
      // `saveMemorySuggestion()` có thể throw (vd Supabase client chưa cấu
      // hình đúng) — trước đây KHÔNG có try/catch, exception rơi thành
      // unhandled promise rejection trong 1 event handler. Bắt lại để hiện
      // trạng thái lỗi trung thực thay vì để lan ra ngoài.
      setMemorySaveState("error");
    }
  }

  function handleDismissMemory() {
    setMemorySuggestion(null);
    setMemorySaveState("idle");
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
                {/* Giai đoạn 2, mục 2a — ghi nhớ tự động phát hiện + xác
                    nhận 1 chạm. Chỉ hiện khi API vừa báo có khoảnh khắc
                    đáng nhớ ("keep") ở lượt gần nhất — không tự động lưu,
                    người dùng phải chủ động bấm "Lưu".
                    BUG ĐÃ SỬA — "co giật màn hình": khối này trước đây là
                    SIBLING của `.chat-messages` bên trong `.chat-card` (flex
                    column, chiều cao CỐ ĐỊNH `height:70vh; overflow:hidden`,
                    xem `companion.css`). Mỗi lần khối này xuất hiện/biến mất
                    (ngay sau khi Companion trả lời), layout flex renegotiate
                    KHÔNG hoạt ảnh (CSS không animate `flex-basis`) — chiều
                    cao `.chat-messages` (flex:1) NHẢY đột ngột cùng lúc với
                    `requestAnimationFrame(scrollIntoView)` chạy riêng — 2
                    hiệu ứng chồng nhau tạo cảm giác giật/nhảy màn hình mỗi
                    lượt chat. Đã chuyển khối này vào BÊN TRONG
                    `.chat-messages` (phần tử cuối, trước `bottomRef`) — giờ
                    là 1 phần của khu vực cuộn (`overflow-y:auto`), không còn
                    làm đổi kích thước khung `.chat-card` cố định nữa; xuất
                    hiện mượt trong cùng 1 lần cuộn `scrollIntoView`. */}
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
                      <div style={{ fontSize: 12.5, color: "var(--violet-dark)", fontWeight: 700 }}>
                        Đã lưu vào My Story.
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--violet-dark)" }}>
                          Đây có vẻ là một khoảnh khắc đáng nhớ — lưu vào My Story nhé?
                        </div>
                        <div style={{ fontSize: 12.5, color: "var(--text)", fontStyle: "italic" }}>
                          &quot;{memorySuggestion.content}&quot;
                        </div>
                        {memorySaveState === "error" ? (
                          <div style={{ fontSize: 11.5, color: "#b91c2c" }}>
                            Chưa lưu được — vui lòng thử lại.
                          </div>
                        ) : null}
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            onClick={handleSaveMemory}
                            disabled={memorySaveState === "saving"}
                            className="chip"
                            style={{ background: "var(--violet)", color: "#fff", cursor: "pointer" }}
                          >
                            {memorySaveState === "saving" ? "Đang lưu…" : "Lưu vào My Story"}
                          </button>
                          <button
                            type="button"
                            onClick={handleDismissMemory}
                            className="chip"
                            style={{ cursor: "pointer" }}
                          >
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
                  <div
                    className="ring"
                    style={{
                      background: `conic-gradient(var(--violet) 0% ${academyProgress.percent}%, var(--violet-light) ${academyProgress.percent}% 100%)`,
                    }}
                  >
                    <div className="ring-inner">
                      <div className="lv" style={{ fontSize: 15 }}>
                        {academyProgress.percent}%
                      </div>
                      <div className="lv-label">Học viện AI</div>
                    </div>
                  </div>
                  <div className="profile-stats">
                    <div className="profile-stat">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                      </svg>
                      <b>{premium.signedIn ? premium.fullName || premium.email || "Học viên" : "Chưa đăng nhập"}</b>
                    </div>
                    <div className="profile-stat">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 15a4 4 0 100-8 4 4 0 000 8z" />
                        <path d="M4.2 15a8 8 0 1115.6 0" />
                      </svg>
                      {premium.isPremium ? "Thành viên Premium" : "Tài khoản miễn phí"}
                    </div>
                    <div className="profile-stat" style={{ color: "var(--muted)" }}>
                      {academyProgress.completedLessons}/{academyProgress.totalLessons} bài học Học viện AI đã hoàn thành
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Mục tiêu hiện tại</h4>
                  <a onClick={() => go("/v2/muc-tieu")} style={{ cursor: "pointer" }}>
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
                    <a onClick={() => go("/v2/muc-tieu")} style={{ cursor: "pointer" }}>
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
                {INTERNAL_SUGGESTIONS.map((s) => (
                  <div className="reco-row" key={s.href} onClick={() => go(s.href)}>
                    {s.icon}
                    {s.label}
                  </div>
                ))}
              </div>

            </aside>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
