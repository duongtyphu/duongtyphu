"use client";

/* =============================================================================
 * Sứ mệnh Companion 2.0 — theo yêu cầu Founder: "chỉ thay đổi trang giữa,
 * còn lại giao diện portal vẫn giữ nguyên".
 *
 * Giao diện Portal (sidebar/topbar) — GIỮ NGUYÊN `PortalV2Shell`, đúng
 * khuôn 3 trang Companion khác (`Companion.html`/`Bo nho ca nhan hoa.html`).
 * Nội dung ở giữa — lấy NGUYÊN VĂN từ `/portal/su-menh-companion` (1.0):
 * `SuMenhCompanionContent` (`src/app/portal/su-menh-companion/`) là Single
 * Source of Truth dùng CHUNG cho cả 1.0 lẫn 2.0 — sửa nội dung/6 khối
 * live-edit ở 1 nơi, phản ánh cả 2 bản. KHÔNG copy lại nội dung ở đây.
 * ========================================================================== */

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import { SuMenhCompanionContent } from "@/app/portal/su-menh-companion/SuMenhCompanionContent";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import "../inter-gf.css";
import "./su-menh-companion.css";

export function SuMenhCompanionClient({ premium }: { premium: PremiumStatus }) {
  return (
    <div className="smc">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          useTopbarRightWrapper={false}
          promoText="Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện."
          activeHtmlFile="Su menh Companion.html"
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
          <div className="content">
            <SuMenhCompanionContent />
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
