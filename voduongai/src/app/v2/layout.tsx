import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/v2-tokens.css";

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
 */
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-ui="v2"
      className={`${inter.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-v2-inter), system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
