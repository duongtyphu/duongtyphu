"use client";

import { useState } from "react";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import "./cong-dong-ai.css";

/**
 * `/v2/cong-dong-ai` — 1:1 với `Cong dong AI.html` (Bước F).
 *
 * KHÁC HẲN mọi trang Bước F trước — đây là trang "mạng xã hội cộng đồng"
 * hoàn chỉnh (feed bài viết, composer đăng bài, reaction/bình luận/chia sẻ,
 * bảng xếp hạng thành viên theo điểm, sự kiện sắp diễn ra, nhóm thảo luận) —
 * TOÀN BỘ nội dung trung tâm của trang này KHÔNG có hệ thống thật nào phía
 * sau, đã audit xác nhận (grep `information_schema`/toàn bộ `src/`):
 *
 * - Không có bảng `posts`/`comments`/`post_reactions` nào — không thể đăng
 *   bài, bình luận, thả react thật.
 * - Không có bảng `community_groups`/`community_events` nào — "Nhóm thảo
 *   luận phổ biến"/"Sự kiện sắp diễn ra" không có nội dung thật để đọc.
 * - Không có cơ chế tính điểm/xếp hạng thành viên nào ("12.5K điểm · 342
 *   bài viết") — không phải gamification đã biết (XP/badges, đã xác nhận
 *   nhiều lần không tồn tại) mà là một hệ thống khác hẳn (social feed
 *   scoring), cũng không tồn tại.
 * - `getLiveCommunityChannels()` (bảng `community`, Việc 8) — nội dung
 *   KHÔNG khớp: đó là 5 kênh MẠNG XÃ HỘI BÊN NGOÀI (Facebook/YouTube/
 *   TikTok/Zalo/Telegram), không phải "nhóm thảo luận nội bộ" mockup này mô
 *   tả. Bảng đó cũng đang có 0 dòng Active tại thời điểm build (đã xác nhận
 *   qua REST trực tiếp lúc build `/v2/premium`). Không dùng ở đây — sai bản
 *   chất nếu gán ép vào.
 *
 * Đây là GAP LỚN NHẤT giữa mockup và hệ thống thật trong toàn bộ Bước F
 * tính tới nay (không phải 1 vài field lẻ như các trang trước) — ghi rõ
 * trong báo cáo cuối. Theo đúng lệnh gốc, đây là honest empty-state ĐƯỢC
 * PHÉP mặc định KHÔNG cần dừng hỏi Founder (chỉ cần ghi lại) — không phải
 * tình huống mơ hồ nghiệp vụ kiểu "mua đứt Premium" (chỉ có 1 cách diễn
 * giải trung thực: chưa có gì để hiển thị, không phải nhiều hướng kinh
 * doanh khác nhau cần quyết định).
 *
 * XỬ LÝ CỤ THỂ:
 * - `quick-grid` (4 lối tắt Thảo luận/Chia sẻ tài nguyên/Dự án chung/Sự
 *   kiện) — giữ nguyên hiển thị (chỉ là điều hướng ý định, không phải dữ
 *   liệu), nhưng KHÔNG có đích thật nào để trỏ tới (mọi khối bên dưới đều
 *   rỗng) — để trơ (không onClick), đúng nguyên tắc "không tạo link chết".
 * - `feed-toolbar` (6 tab lọc + sort) — để trơ (chỉ đổi class active), đúng
 *   quy ước tab trơ đã áp dụng xuyên suốt Bước F.
 * - `composer` ("Bạn đang nghĩ gì?" + nút Đăng bài) — vô hiệu hoá thật (input
 *   `disabled`, nút Đăng bài `disabled`) thay vì để trông như hoạt động
 *   được — tránh Founder/khách bấm thử rồi phát hiện không có gì xảy ra.
 * - Feed 2 bài viết mẫu (Minh Anh/Hoàng Nam, có tên/quote/react/comment cụ
 *   thể — dữ liệu BỊA rõ ràng, đúng loại vi phạm NO-FAKE-DATA) → empty-state
 *   trung thực.
 * - "Thành viên nổi bật" (5 dòng, có tên/điểm/số bài bịa) → empty-state.
 * - "Sự kiện sắp diễn ra" (2 sự kiện bịa ngày/giờ Zoom cụ thể) →
 *   empty-state.
 * - "Nhóm thảo luận phổ biến" (3 nhóm bịa số thành viên) → empty-state.
 */

const QUICK_LINKS = [
  {
    label: "Thảo luận",
    sub: "Đặt câu hỏi & chia sẻ",
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
      </svg>
    ),
  },
  {
    label: "Chia sẻ tài nguyên",
    sub: "Công cụ, prompt, tài liệu",
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Dự án chung",
    sub: "Hợp tác & phát triển",
    bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="9" r="3" />
        <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
      </svg>
    ),
  },
  {
    label: "Sự kiện & Webinar",
    sub: "Tham gia & kết nối",
    bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
  },
];

const FEED_TABS = ["Tất cả", "Thảo luận", "Hỏi đáp", "Chia sẻ", "Thông báo", "Sự kiện"];

export function CongDongAiClient({ premium }: { premium: PremiumStatus }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="cda">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          searchPlaceholder="Tìm kiếm trong cộng đồng..."
          promoText="Mở khoá tất cả khoá học nâng cao, tài nguyên độc quyền và đặc quyền."
          promoTitle="Tham gia Premium"
          activeHtmlFile="Cong dong AI.html"
        >
          <div className="content">
            <div className="center-col">
              <div className="page-head">
                <h1>Cộng đồng AI</h1>
                <p>Kết nối – Học hỏi – Chia sẻ – Cùng nhau phát triển</p>
              </div>

              <div className="quick-grid">
                {QUICK_LINKS.map((q) => (
                  <div className="quick-card" key={q.label} style={{ cursor: "default" }}>
                    <div className="ico" style={{ background: q.bg }}>
                      {q.icon}
                    </div>
                    <div>
                      <h5>{q.label}</h5>
                      <span>{q.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div className="feed-toolbar" style={{ flex: 1 }}>
                  {FEED_TABS.map((t, i) => (
                    <button key={t} className={i === activeTab ? "f-tab active" : "f-tab"} onClick={() => setActiveTab(i)}>
                      {t}
                    </button>
                  ))}
                  <div className="sort-select">
                    Mới nhất
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="composer">
                <div className="composer-top">
                  <div className="avatar">VD</div>
                  <input type="text" placeholder="Tính năng đăng bài đang được xây dựng — chưa dùng được." disabled />
                </div>
                <div className="composer-actions">
                  <button className="post-btn" disabled style={{ opacity: 0.5, cursor: "not-allowed", marginLeft: "auto" }}>
                    Đăng bài
                  </button>
                </div>
              </div>

              <div className="card">
                <p className="empty-hint">
                  Cộng đồng thảo luận đang được xây dựng — chưa có bài viết nào. Quay lại sau khi tính năng chính thức ra mắt.
                </p>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Thành viên nổi bật</h4>
                </div>
                <p className="empty-hint">Chưa có dữ liệu xếp hạng thành viên.</p>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Sự kiện sắp diễn ra</h4>
                </div>
                <p className="empty-hint">Chưa có sự kiện nào sắp diễn ra.</p>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Nhóm thảo luận phổ biến</h4>
                </div>
                <p className="empty-hint">Chưa có nhóm thảo luận nào.</p>
              </div>
            </aside>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
