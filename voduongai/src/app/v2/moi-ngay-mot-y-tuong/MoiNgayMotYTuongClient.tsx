"use client";

/* =============================================================================
 * "Mỗi ngày một ý tưởng" — PLACEHOLDER (Portal 2.0, Giai đoạn 1).
 *
 * Founder xác nhận đây là "trái tim của Portal" — trang trung tâm kết nối
 * tới mọi mục khác — nhưng bản thiết kế Claude Design cho trang này CHƯA
 * được chia sẻ (nội dung lớn, Founder tách thành phase riêng, xem CLAUDE.md
 * "ĐỊNH HƯỚNG HIỆN TẠI"). Giai đoạn 1 chỉ cần mục menu có 1 chỗ trỏ hợp lệ —
 * trang này CHỈ dựng khung shell + 1 trạng thái "đang xây dựng" trung thực,
 * KHÔNG bịa nội dung/bố cục thay cho mockup chưa có.
 *
 * Khi có mockup thật: thay hẳn `<section className="coming-soon">` bên
 * dưới bằng nội dung 1:1 từ mockup, giữ nguyên phần khung (PortalV2Shell).
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
            <div className="center-col">
              <div className="page-head">
                <h1>Mỗi ngày một ý tưởng</h1>
                <p>Trang trung tâm kết nối tới mọi mục khác trong Portal — đang được xây dựng.</p>
              </div>

              <section className="coming-soon">
                <div className="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                    <path d="M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1V17a1 1 0 001 1h4a1 1 0 001-1v-.2c0-.8.4-1.6 1-2.1A7 7 0 0012 2z" />
                  </svg>
                </div>
                <h2>Trang này đang được xây dựng</h2>
                <p>
                  Nội dung của &quot;Mỗi ngày một ý tưởng&quot; sẽ được cập nhật khi bản thiết
                  kế chi tiết sẵn sàng. Trong lúc chờ, bạn có thể tiếp tục khám phá các mục
                  khác của Portal từ thanh điều hướng bên trái.
                </p>
              </section>
            </div>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
