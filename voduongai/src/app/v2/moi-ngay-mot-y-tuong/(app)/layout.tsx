import { Be_Vietnam_Pro, Space_Grotesk } from "next/font/google";

import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import { getLiveMnytCategories } from "@/lib/portal/live-mnyt";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { MnytShellClient } from "../MnytShellClient";

/**
 * Layout dùng chung cho 9/10 view "Mỗi ngày một ý tưởng"
 * (`/v2/moi-ngay-mot-y-tuong/*`) — nạp font riêng (Space Grotesk + Be
 * Vietnam Pro, khác Inter mà `v2/layout.tsx` đã nạp cho 46 trang khác —
 * không sửa layout đó, tránh tải thêm font cho những trang không cần) và
 * bọc `MnytShellClient` — mọi route con (`kho-y-tuong`, `lo-trinh`,
 * `y-tuong/[id]`...) tự động thừa hưởng cùng 1 shell, không cần lặp lại ở
 * từng `page.tsx`.
 *
 * Nằm trong route group `(app)` (KHÔNG xuất hiện trong URL) — cố ý tách
 * riêng khỏi `so-tay-y-tuong` (Giai đoạn 11, đúng mockup thật
 * `So Tay Y Tuong.dc.html`): trang đó phải là 1 TÀI LIỆU ĐỘC LẬP, không app
 * shell nào (kể cả Portal 2.0) — dùng route group để "opt out" đúng cách
 * Next.js khuyến nghị (xem `node_modules/next/dist/docs/01-app/03-api-reference/
 * 03-file-conventions/route-groups.md`, mục "Opting specific route segments
 * into sharing a layout, while keeping others out") thay vì check
 * `usePathname()` để ẩn/hiện shell (sẽ vẫn tải + chạy toàn bộ logic
 * `MnytShellClient`/`PortalV2Shell` không cần thiết cho 1 trang in ấn).
 *
 * Kể từ đợt tích hợp Portal 2.0 (chỉ đạo Founder: "Menu và thanh header
 * (tìm kiếm và cụm avata) vẫn giữ nguyên như các trang khác trong portal
 * 2.0") — `MnytShellClient` không còn tự dựng header/bottom-nav toàn màn
 * hình nữa, mà bọc `PortalV2Shell` (sidebar + topbar CHUẨN dùng chung ~46
 * trang khác) BÊN NGOÀI, chỉ giữ `MnytHeader`/10 view làm nội dung "trang
 * giữa" — nên layout này cần thêm `getPremiumStatus()` (prop bắt buộc của
 * `PortalV2Shell`, quyết định ẩn/hiện khối "Nâng cấp Premium").
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
  const [state, categories, premium] = await Promise.all([
    getMnytStateBundle(),
    getLiveMnytCategories(),
    getPremiumStatus(),
  ]);

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
      <MnytShellClient initialState={state} categories={categories} premium={premium}>
        {children}
      </MnytShellClient>
    </div>
  );
}
