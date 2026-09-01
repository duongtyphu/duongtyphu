"use client";

/* =============================================================================
 * "Mỗi ngày một ý tưởng" — Portal 2.0.
 *
 * ĐÃ DỌN placeholder "đang được xây dựng" (Giai đoạn 1) theo yêu cầu
 * Founder — trang giữ nguyên phần khung (PortalV2Shell: sidebar/topbar/
 * promo), `.center-col` bên trong `.content` giờ để TRỐNG, sẵn sàng cho
 * nội dung thật.
 * ========================================================================== */

import type { PremiumStatus } from "@/lib/v2/premium-access";
import { PortalV2Shell } from "@/components/v2/PortalV2Shell";

import "./moi-ngay-mot-y-tuong.css";

export function MoiNgayMotYTuongClient({ premium }: { premium: PremiumStatus }) {
  return (
    <div className="mnmyt">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          searchPlaceholder="Tìm kiếm khóa học, tài liệu, công cụ, prompt..."
          promoText="Mở khoá toàn bộ khoá học, công cụ AI cao cấp và quyền lợi đặc biệt."
          activeHtmlFile="Moi ngay mot y tuong.html"
        >
          <div className="content">
            <div className="center-col">{/* Nội dung mới của "Mỗi ngày một ý tưởng" sẽ dựng ở đây. */}</div>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
