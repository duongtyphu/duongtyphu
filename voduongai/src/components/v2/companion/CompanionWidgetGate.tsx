"use client";

/**
 * Cổng hiển thị Companion nổi (Widget) — Portal 2.0, Giai đoạn 9. Mount 1
 * LẦN DUY NHẤT ở `v2/layout.tsx` (bọc quanh mọi `{children}` của cây
 * `/v2/*`) — cùng nguyên tắc "1 mount point, không lặp lại thủ công ở
 * từng trang" đã áp dụng cho `CompanionPresence` ở `PortalShell.tsx` (1.0).
 *
 * Route nào KHÔNG hiện widget (đều là route không dùng `PortalV2Shell`
 * chuẩn/đã có trải nghiệm Companion riêng — hiện thêm nút nổi sẽ thừa/gây
 * nhiễu, không phải thiếu sót):
 * - `/v2/admin` — Admin có shell/nghiệp vụ riêng, không phải nơi Companion
 *   trò chuyện với học viên.
 * - `/v2/companion` — CHÍNH trang chat Companion đầy đủ, nút nổi mở thêm 1
 *   mini-chat đè lên chat đầy đủ là dư thừa/gây nhầm lẫn.
 * - `/v2/checkout`, `/v2/checkout/*` — luồng thanh toán, tránh phân tâm.
 * - `/v2/su-menh-companion/companion-qua-hinh-anh` — carousel ảnh full-bleed,
 *   không có shell/topbar nào (xem docblock route này).
 * - `/v2/moi-ngay-mot-y-tuong/so-tay-y-tuong` — trang IN ẤN độc lập (mockup
 *   `So Tay Y Tuong.dc.html`), cố ý không có bất kỳ app shell nào.
 */

import { usePathname } from "next/navigation";
import { CompanionWidget } from "./CompanionWidget";

const EXCLUDED_PREFIXES = [
  "/v2/admin",
  "/v2/companion",
  "/v2/checkout",
  "/v2/su-menh-companion/companion-qua-hinh-anh",
  "/v2/moi-ngay-mot-y-tuong/so-tay-y-tuong",
];

export function CompanionWidgetGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const excluded = EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return (
    <>
      {children}
      {!excluded && <CompanionWidget />}
    </>
  );
}
