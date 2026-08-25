"use client";

/* =============================================================================
 * Tài khoản 2.0 — task #68. Khung Portal (sidebar/topbar) — `PortalV2Shell`,
 * cùng khuôn kỹ thuật `su-menh-companion`/`bo-nho-ca-nhan-hoa` (chưa có mockup
 * Claude Design riêng cho trang này — không phải 1 trong 46 màn Bước F —
 * nên KHÔNG có `activeHtmlFile` khớp mục nào trong sidebar, đúng thực tế:
 * trang này chỉ vào được qua popover "Cài đặt tài khoản"/"Quản lý quyền
 * riêng tư", không phải 1 đích điều hướng sidebar).
 *
 * Nội dung ở giữa — dùng CHUNG `AccountContent` (`src/components/portal/
 * account/AccountContent.tsx`) với `/portal/account` (1.0): Single Source
 * of Truth, sửa logic/tab ở 1 nơi phản ánh cả 2 bản. `coursesHref` truyền
 * `/v2/premium` (đúng nguyên tắc "mọi thứ sửa từ nay chỉ trỏ đích 2.0").
 * ========================================================================== */

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";
import { AccountContent } from "@/components/portal/account/AccountContent";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import type { AccountOrder } from "@/lib/portal/account-data";
import type { buildLifeProfile } from "@/lib/portal/life-profile/life-profile";
import type { User } from "@supabase/supabase-js";

import "../inter-gf.css";
import "./tai-khoan.css";

export function TaiKhoanClient({
  premium,
  user,
  orders,
  now,
  lifeProfile,
}: {
  premium: PremiumStatus;
  user: User | null;
  orders: AccountOrder[];
  now: number;
  lifeProfile: ReturnType<typeof buildLifeProfile>;
}) {
  return (
    <div className="tkh">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          useTopbarRightWrapper={false}
          promoText="Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện."
          activeHtmlFile="Tai khoan.html"
          customSearch={
            <PortalSearchBox placeholder="Tìm kiếm kiến thức, công cụ, prompt, bài học..." variant="bare" />
          }
        >
          <div className="content">
            <AccountContent user={user} orders={orders} now={now} lifeProfile={lifeProfile} coursesHref="/v2/premium" />
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
