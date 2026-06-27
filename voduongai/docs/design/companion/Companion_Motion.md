# Companion Motion — Master Design V1.0

Nguyên tắc chuyển động cho Companion — áp dụng cho mọi nơi Companion
xuất hiện trong Portal (Presence indicator, Companion Space, các mockup
context khác).

## Nguyên tắc cốt lõi

1. **Breathing, không giật.** Chuyển động mặc định (idle) là một nhịp
   "thở" rất chậm — phóng to/thu nhỏ glow nhẹ trong vài giây một chu kỳ.
   Không có chuyển động nhanh, không nảy (bounce), không lắc.
2. **Glow thay đổi, hình dạng không đổi.** Mọi animation chỉ tác động
   lên độ sáng/halo/gradient — không bao giờ kéo méo, xoay lật, hoặc
   biến dạng viên ngọc.
3. **Không tự động popup.** Companion không bao giờ tự phóng to, tự mở
   panel, hoặc tự thu hút sự chú ý bằng chuyển động mạnh — người dùng
   luôn là người chủ động mở Companion Space.
4. **Không hiệu ứng kiểu thông báo mạng xã hội.** Không nảy số, không
   rung lắc kiểu "có tin nhắn mới", không badge đỏ.
5. **Tôn trọng `prefers-reduced-motion`.** Khi người dùng bật chế độ
   giảm chuyển động, Companion chuyển sang trạng thái tĩnh, chỉ giữ glow
   cố định, không animate.

## Theo từng trạng thái

- `idle` — breathing rất chậm, đều.
- `listening` — breathing chậm hơn idle một chút, glow hướng vào trong.
- `thinking` — glow xoay/nhấp nháy nhẹ, vẫn chậm, không gấp gáp.
- `encouraging` — glow vàng kim ấm lên dần, không chớp tắt.
- `celebrating` — một nhịp bừng sáng ngắn rồi trở lại breathing bình
  thường — không kéo dài hiệu ứng "ăn mừng" quá lâu, tránh cảm giác phô
  trương.

Hiệu ứng là phần được phép giảm nhiều nhất khi cần tối ưu hiệu suất
(theo thứ tự ưu tiên ở `Companion_Guidelines.md`) — nhưng nguyên tắc
"breathing, không giật, không tự popup" vẫn luôn áp dụng dù animation
đơn giản đến mức nào.
