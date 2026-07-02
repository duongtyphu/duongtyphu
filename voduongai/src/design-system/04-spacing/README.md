# 04 — Spacing

Portal dùng thang khoảng cách chuẩn của Tailwind (scale 4px: `1 = 4px`), không định nghĩa scale riêng — nhưng có quy tắc ngữ nghĩa để đảm bảo "nhịp thở" nhất quán.

## Thang dùng phổ biến trong Portal

| Token Tailwind | Giá trị | Dùng khi |
|---|---|---|
| `space-y-2` / `gap-2` | 8px | Khoảng cách giữa các item rất sát nhau (icon + label) |
| `space-y-4` / `gap-4` | 16px | Khoảng cách trong card, giữa các dòng nội dung |
| `space-y-6` đến `space-y-10` | 24–40px | Khoảng cách giữa các block trong cùng section |
| `space-y-12` đến `space-y-14` | 48–56px | Khoảng cách giữa các section trong trang Portal thường |
| `mt-28` đến `mt-40` | 112–160px | Khoảng cách giữa section trong trang biểu tượng đặc biệt (Companion Sanctuary, Khu vườn) — nhịp thở chậm, khoảng trắng lớn |

## Nguyên tắc

1. **Trang Portal thường** (`/portal/library`, `/portal/academy`, `/portal/news`...): dùng `space-y-10`–`space-y-12` giữa section — nhịp độ đọc nhanh, thực dụng.
2. **Trang biểu tượng đặc biệt** (Companion Sanctuary, `/portal/hanh-trinh-cua-toi`): dùng `mt-28`–`mt-40` giữa section — khoảng trắng lớn là một phần của cảm xúc "bình yên, có chỗ để thở", không phải khoảng trống lãng phí.
3. **Padding card chuẩn**: `p-5` (20px) cho card nhỏ, `p-6`–`p-8` cho card/section lớn hoặc hero.
4. **Không nén nội dung sát mép** — mọi trang giữ tối thiểu `px-4` (mobile) / `px-8` (desktop) từ container Portal Shell, không tự thêm padding âm trừ khi phá khung để đặt nền toàn màn hình (xem cách `SanctuaryBackground`/`GardenTreeVisual` dùng `-mx-4 -my-6 md:-mx-8 md:-my-8` để breakout khỏi padding mặc định của `<main>`).
5. Khi một trang cảm thấy "chật", tăng khoảng cách theo thang trên trước khi giảm nội dung — khoảng trắng là công cụ đầu tiên để tạo cảm giác cao cấp, không phải giải pháp cuối cùng.
