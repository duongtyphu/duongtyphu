import { Be_Vietnam_Pro, Space_Grotesk } from "next/font/google";

import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import { getLiveMnytCategories } from "@/lib/portal/live-mnyt";

import { MnytShellClient } from "./MnytShellClient";

/**
 * Layout dùng chung cho TOÀN BỘ 10 view "Mỗi ngày một ý tưởng"
 * (`/v2/moi-ngay-mot-y-tuong/*`) — nạp font riêng (Space Grotesk + Be
 * Vietnam Pro, khác Inter mà `v2/layout.tsx` đã nạp cho 46 trang khác —
 * không sửa layout đó, tránh tải thêm font cho những trang không cần) và
 * bọc `MnytShellClient` (header + bottom-nav + quản lý `prefs`) — mọi route
 * con (`kho-y-tuong`, `lo-trinh`, `y-tuong/[id]`...) tự động thừa hưởng
 * cùng 1 shell, không cần lặp lại ở từng `page.tsx`.
 *
 * `getMnytStateBundle()` gọi Ở ĐÂY (không phải từng `page.tsx`) — 1 lần/
 * điều hướng, cấp streak/xp/freeze/badge cho header + `prefs` khởi tạo cho
 * `MnytShellClient`. Route con cần thêm dữ liệu riêng (topic hôm nay, danh
 * sách archive...) tự fetch thêm trong chính `page.tsx` của nó.
 *
 * `getLiveMnytCategories()` gọi thêm ở đây (Giai đoạn 6) — modal "Gửi ý
 * tưởng của bạn" (mở từ header, có mặt trên MỌI route) cần danh sách lĩnh
 * vực cho ô chọn — `cache()` (React) khử trùng lặp nếu `page.tsx` của route
 * con cũng gọi lại hàm này trong cùng 1 lượt render.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mnyt-display-raw",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mnyt-body-raw",
  display: "swap",
});

export default async function MoiNgayMotYTuongLayout({ children }: { children: React.ReactNode }) {
  const [state, categories] = await Promise.all([getMnytStateBundle(), getLiveMnytCategories()]);

  return (
    <div
      className={`${spaceGrotesk.variable} ${beVietnamPro.variable}`}
      style={
        {
          "--font-mnyt-display": "var(--font-mnyt-display-raw)",
          "--font-mnyt-body": "var(--font-mnyt-body-raw)",
        } as React.CSSProperties
      }
    >
      <MnytShellClient initialState={state} categories={categories}>
        {children}
      </MnytShellClient>
    </div>
  );
}
