import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/v2-tokens.css";
import { CompanionWidgetGate } from "@/components/v2/companion/CompanionWidgetGate";

/**
 * Bộ thiết kế 2.0 dùng Inter 400–800. Mockup nạp qua thẻ `<link>` Google Fonts;
 * ở đây dùng `next/font` để font được self-host, không chặn render và không
 * phát sinh request sang domain ngoài.
 */
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-v2-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VO DUONG AI",
  // Khu vực sau đăng nhập — không để công cụ tìm kiếm lập chỉ mục.
  robots: { index: false, follow: false },
};

/**
 * Lớp bọc chung cho toàn bộ cây `/v2`. `data-ui="v2"` là ranh giới scope của
 * `v2-tokens.css` — mọi token và reset chỉ có hiệu lực bên trong, nên portal và
 * admin 1.0 (đang chạy Production với bộ token GemOS khác hẳn) không bị ảnh hưởng.
 *
 * Giai đoạn 9 — Companion nổi (Widget): `CompanionWidgetGate` mount Ở ĐÂY
 * (không phải `PortalV2Shell.tsx`) vì đây là điểm DUY NHẤT bọc TOÀN BỘ cây
 * `/v2/*`, kể cả 12 trang "hand-copy sidebar" không dùng `PortalV2Shell`
 * (`trang-chu`/`du-an-co-hoi`/`hoc-vien-ai`/4 trang chi tiết CKOS/5 trang
 * chi tiết hệ sinh thái) — mount ở `PortalV2Shell.tsx` sẽ bỏ sót 12 trang
 * này, đúng lớp lỗi đã gặp nhiều lần với việc đồng bộ sidebar/nav-item thủ
 * công qua nhiều file (xem "Giai đoạn 12"/"Giai đoạn 7" trong lịch sử dự
 * án). `CompanionWidgetGate` tự loại trừ `/v2/admin`/`/v2/companion`/
 * checkout/flipbook/trang in — xem docblock trong chính file đó.
 */
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-ui="v2"
      className={`${inter.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-v2-inter), system-ui, sans-serif" }}
    >
      <CompanionWidgetGate>{children}</CompanionWidgetGate>
    </div>
  );
}
