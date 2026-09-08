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
 * 11. **Hợp nhất với Companion nổi (widget)** — Founder: "hiện bản
 *     Companion ở thanh Menu và Companion nổi trên màn hình là một, và nó
 *     phải được di chuyển hoàn toàn ở Portal 2.0 (không liên quan Portal
 *     1.0)". Toàn bộ logic chat (state/gửi/dừng/thử lại/sao chép/ghi nhớ)
 *     đã tách ra `src/lib/v2/companion/useCompanionChat.ts` + UI vùng chat
 *     ra `src/components/v2/companion/CompanionChatArea.tsx` — dùng CHUNG
 *     bởi trang này VÀ `CompanionWidgetPanel.tsx` (widget nổi, mount ở
 *     `v2/layout.tsx`). Widget KHÔNG còn import
 *     `CompanionFloatingChat`/`CompanionChatShell`/`CompanionComposer`
 *     (Portal 1.0) — mọi phần chat giờ 100% Portal 2.0, dùng đúng CSS
 *     `.comp` (`companion.css`) như trang này. Cũng sửa kèm bug "khung gõ
 *     chữ có viền đôi" ở widget (bug nằm ở `CompanionComposer.tsx` 1.0 mà
 *     widget cũ dùng — nay không còn dùng nữa) và "load hơi chậm khi mở
 *     chat" (widget giờ prefetch hội thoại ngay khi mount, không đợi lúc
 *     bấm mở mới bắt đầu tải).
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { CompanionMessageRow } from "@/app/portal/companion/actions";
import type { GoalRecord } from "@/lib/portal/foundation/goal-runtime";
import { getGoalProgress, listGoals, hydrateGoalRuntime } from "@/lib/portal/foundation/goal-runtime";
import type { AcademyProgress } from "@/lib/portal/live-academy";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { useCompanionChat } from "@/lib/v2/companion/useCompanionChat";
import { CompanionChatArea } from "@/components/v2/companion/CompanionChatArea";

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
  // Logic chat DÙNG CHUNG với Companion nổi (widget) — xem
  // `useCompanionChat`/`CompanionChatArea`, tách ra khi hợp nhất 2 bề mặt
  // theo đúng chỉ đạo Founder ("Companion ở Menu và Companion nổi là một").
  const chat = useCompanionChat({ initialConversationId, initialMessages });

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
                <CompanionChatArea
                  messages={chat.messages}
                  sending={chat.sending}
                  error={chat.error}
                  copiedId={chat.copiedId}
                  memorySuggestion={chat.memorySuggestion}
                  memorySaveState={chat.memorySaveState}
                  input={chat.input}
                  onInputChange={chat.setInput}
                  onSend={chat.send}
                  onStop={chat.stop}
                  onCopy={chat.copyMessage}
                  onRetry={chat.retry}
                  onSaveMemory={chat.handleSaveMemory}
                  onDismissMemory={chat.handleDismissMemory}
                  bottomRef={chat.bottomRef}
                />
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
