# 08 — Layout

Chuẩn hóa cách sắp xếp component thành một trang hoàn chỉnh. Mỗi trang Portal thuộc về đúng một layout dưới đây — không pha trộn tùy tiện.

| Layout | Đặc điểm | Áp dụng cho |
|---|---|---|
| **Portal Layout** | Sidebar + Header cố định (`PortalShell.tsx`), main content `space-y-10`–`space-y-12`, nền `.gemos-bg` (trắng xám + caro chìm) | Mọi trang Portal mặc định (`/portal`, `/portal/library`, `/portal/academy`...) |
| **Learning Layout** | Portal Layout + hero học tập + Companion Guide đầu trang + danh sách nội dung dạng card lưới | `/portal/academy`, `/portal/library`, `/portal/khong-gian-ai` |
| **Story Layout** | Portal Layout + card cảm xúc cá nhân (Reflection, Companion Memory, Monthly Letter) — ít grid, nhiều narrative | `/portal/story` |
| **Garden Layout** | Breakout khỏi padding Portal Shell (`-mx-4 -my-6 md:-mx-8 md:-my-8`), hero 2 cột tỉ lệ 35/65 (trái nội dung, phải cây lớn), Footer riêng nối tiếp nền | `/portal/khu-vuon-cua-ban` — chi tiết đầy đủ ở `10-reference/GARDEN_DESIGN_SPEC.md` |
| **Companion Layout** | Breakout khỏi Portal Layout, `SanctuaryBackground` mesh gradient riêng, storytelling tuyến tính không card/grid, Footer riêng, Intro Moment khi vào trang | `/portal/companion` |
| **Journey Layout** | Portal Layout + hero + timeline dọc (Growth Path) + card tiến độ (Human Growth Detail) + Related Actions grid | `/portal/journey` |

## Quy tắc breakout khỏi Portal Layout

Chỉ 2 layout được phép breakout khỏi khung `<main>` mặc định của Portal Shell (dùng margin âm để nền riêng phủ toàn khu vực): **Garden Layout** và **Companion Layout**. Khi breakout:

- Sidebar/Header/Portal Shell **không bị ảnh hưởng** — chỉ Main Content + Footer riêng của trang đó thay đổi.
- Nền riêng đặt `position: absolute` trong phạm vi wrapper của trang, không dùng `position: fixed` phủ toàn viewport (tránh ảnh hưởng trang khác khi điều hướng).
- Footer riêng của trang phải nối tiếp màu nền, không dùng Footer Portal chung (Portal hiện không có Footer chung ở Shell — Footer riêng là phần cuối nội dung trang).

## Quy tắc chung

1. Không tự tạo layout thứ 7 khi một trang mới chỉ hơi khác — ưu tiên mở rộng layout gần nhất.
2. Nếu một trang thực sự cần layout mới (khác biệt về triết lý, không chỉ khác nội dung), phải thêm vào bảng này và có Design Spec riêng ở `10-reference/`.
3. Responsive: Portal Layout/Learning/Story/Journey dùng breakpoint chuẩn Tailwind (`sm`/`md`/`lg`); Garden/Companion Layout có yêu cầu responsive riêng ghi trong Design Spec tương ứng (ví dụ tỉ lệ 35/65 chuyển thành xếp chồng trên mobile).
