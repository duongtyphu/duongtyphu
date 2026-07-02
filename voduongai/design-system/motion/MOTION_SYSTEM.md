# Motion System — VO DUONG AI Portal

Quy tắc chuyển động dùng chung cho toàn bộ Portal và các trang biểu tượng đặc biệt (Companion Sanctuary, Khu vườn của bạn...).

## Nguyên tắc chung

Chuyển động phải khiến người dùng cảm thấy **giao diện đang sống**, không phải **giao diện đang cố gây chú ý**. Mọi animation phải nhẹ, tinh tế, và không bao giờ cản trở việc đọc nội dung.

## Được phép

| Hiệu ứng | Mô tả | Dùng ở đâu |
|---|---|---|
| Fade in nhẹ | opacity 0→1, dịch chuyển tối đa ~16px | Scroll reveal, section xuất hiện lần đầu |
| Hover nổi nhẹ | `translateY(-4px đến -6px)` + shadow tăng nhẹ + border sáng hơn | Mọi card trong Portal (`.gemos-gem-card`/`.gemos-glass-card`) |
| Đổi màu tiêu đề khi hover | title chuyển sang brand-blue | Mọi card có `.gemos-card-title` |
| Leaf sway nhẹ | rotate ±2.5deg, chu kỳ ~6s | Leaf chip trong Khu vườn của bạn |
| Sparkle nhẹ | opacity + scale nhấp nháy rất chậm (~3s/chu kỳ) | Companion Sanctuary, Khu vườn của bạn |
| Sunlight shimmer nhẹ | opacity/scale pulse rất chậm (~7-10s/chu kỳ) | Tia nắng trong Khu vườn, glow orb trong Sanctuary |
| Scroll reveal nhẹ | fade + dịch 16px, chạy một lần (`once: true`) | Companion Sanctuary, Hành trình của tôi |
| Soft parallax | tối đa 3% dịch chuyển theo scroll | Chỉ dùng khi được yêu cầu rõ ràng |
| Tree/leaf breathing | scale 1 → 1.015, chu kỳ ~8s | Tán cây trong Khu vườn của bạn |

## Không được phép

- Bounce mạnh hoặc easing kiểu "spring" quá đàn hồi.
- Neon glow / glow rực (box-shadow cường độ cao, màu bão hòa).
- Animation kiểu game (particle nổ, số điểm bay lên, confetti).
- Chuyển động gây mất tập trung (xoay liên tục, nhấp nháy nhanh, rung mạnh).
- Animation làm giảm performance (không dùng hiệu ứng nặng GPU không cần thiết, tránh animate `width`/`height`/`top`/`left` trên diện rộng — ưu tiên `transform`/`opacity`).

## Yêu cầu kỹ thuật bắt buộc

- Mọi animation trang trí (không phải hover tương tác) phải tôn trọng `prefers-reduced-motion: reduce` — tắt hẳn hoặc giảm về static khi user bật chế độ này.
- Ưu tiên CSS `transform`/`opacity` thay vì các thuộc tính gây reflow.
- Hover và animation nền không được xung đột (nếu một element vừa có animation liên tục vừa có `:hover` transform, dùng `animation-play-state: paused` khi hover để tránh giật).
- Mục tiêu 60 FPS trên thiết bị tầm trung — nếu một hiệu ứng gây giật lag trên mobile, giảm số lượng phần tử animate hoặc tắt hẳn trên mobile.
