# Color System — VO DUONG AI Portal

## Portal chung (mọi trang không có Design Spec riêng)

- Nền: trắng xám nhẹ (`#F6F7F9` → `#F1F5F9`), caro chìm màu bút chì đen rất nhẹ (`rgba(17,24,39,0.07)`), xem `.gemos-bg` trong `globals.css`.
- Card: nền trắng bóng (`#FFFFFF`), border xám rất nhạt (`#E2E8F0`), shadow mềm, radius 20–24px — xem `.gemos-gem-card`/`.gemos-glass-card`.
- Màu nhấn: xanh (`--color-brand-blue: #2563EB`) và tím (`--color-brand-violet: #5B8CFF`, `--color-gemos-vision-purple: #7C3AED`).
- Cam dùng làm điểm nhấn phụ (`--color-brand-orange: #FF7A00`), không dùng làm màu chính.
- Không dùng neon, không dùng nền tối (dark mode) ở khu vực Portal thông thường.

## Khu vườn của bạn (Garden)

- Xanh lá tự nhiên (canopy): `from-green-300 via-green-500 to-green-600` (lá non hơn: `green-200`/`green-400`).
- Vàng nắng ấm: `rgba(253, 224, 71, ...)` cho tia nắng và sparkle.
- Trắng ngọc: nền `#FFFDF8 → #FDFBF3 → #F5FBF6` (xem `.garden-scene`).
- Xám mềm: text phụ `text-gray-500`/`text-gray-400`.
- Hoa (từ giai đoạn "Cây nở hoa"): hồng nhạt `bg-pink-300`.
- Quả (từ giai đoạn "Cây kết trái"): cam-đỏ `from-red-400 to-orange-500`.
- Gradient bắt buộc cho dòng subtitle chính: **xanh → tím → cam** (`#2563EB → #7C3AED → #F97316`).
- Mỗi Garden Growth Stage có một `glowColor` riêng — xem `GROWTH_STAGES` trong `src/data/portal/knowledge-garden.ts`.

## Companion Sanctuary

- Pearl white: `#FEFEFE`/`#FFFFFF`.
- Soft blue: `rgba(37, 99, 235, 0.09)` (mesh nhẹ).
- Lavender: `rgba(124, 58, 237, 0.08)`.
- Warm sunrise orange: `rgba(255, 122, 0, 0.05–0.07)`.
- Deep black: dùng cho phần đầu gradient tiêu đề "Companion" (`#111827`), **không** dùng làm nền.
- Gradient tiêu đề chính: đen → xanh → tím → cam (`#111827 → #2563EB → #7C3AED → #F97316`) — đây là gradient tham chiếu dùng chung cho mọi dòng chữ "truyền cảm hứng" trong Portal (bao gồm subtitle Khu vườn của bạn).

## Quy tắc chung khi thêm màu mới

- Không thêm màu neon/bão hòa cao vào bất kỳ khu vực nào.
- Mọi gradient cảm xúc mới phải nằm trong dải xanh–tím–cam đã thiết lập, trừ khi Founder duyệt một Design Reference dùng dải màu khác.
- Luôn kiểm tra contrast đủ đọc (WCAG AA tối thiểu) khi đặt text lên nền gradient hoặc nền màu.
