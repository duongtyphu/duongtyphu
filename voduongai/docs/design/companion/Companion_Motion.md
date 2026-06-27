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

## Sprint 8.5 — Living Presence Upgrade

Bổ sung lớp motion "sống" phía dưới và quanh viên ngọc — DNA/hình dạng
Companion vẫn không đổi, chỉ thêm chiều sâu và sự hiện diện.

- **Companion Nest** (`CompanionNest.tsx`) — một vùng năng lượng rất nhẹ
  (radial-gradient, blur, `z-index: -1`) đứng dưới Companion khi idle —
  không phải box/button/chat bubble. Khi kéo (drag), Nest mờ đi
  (`.companion-nest--dragging`). Khi minimize, Nest co lại cùng orb nhỏ
  (`.companion-nest--minimized`).
- **Energy ring** (`.companion-ring`) — vòng viền vàng kim mỏng, xoay rất
  chậm (9s/vòng), sáng hơn khi đang tương tác (`.companion-ring--active`,
  ví dụ lúc kéo).
- **Depth & shadow** — `.companion-avatar` dùng hai lớp `drop-shadow`:
  halo vàng kim + bóng navy mềm phía dưới, để Companion nổi trên UI thay
  vì "dán" lên màn hình. Không dùng shadow đen cứng.
  `companion-breathe-soft` (scale 1.0→1.025) thay cho nhịp thở cũ, nhẹ
  hơn để phù hợp với lớp depth mới.
- **Trạng thái `comeback`** — dùng riêng `companion-warm-pulse` (glow ấm
  lên rồi dịu lại, 4s/chu kỳ) cộng với breathing 8s — kích hoạt khi người
  dùng vừa đóng Companion Space (xem `Companion_States.md`).
- **First Greeting Bubble** (`CompanionGreetingBubble.tsx`) — fade-in
  0.35s, tự ẩn sau ~5s, không lặp lại trong cùng session
  (`sessionStorage`), đổi nội dung nếu phát hiện người dùng quay lại sau
  ≥2 ngày (`localStorage`).
- **Micro-reactions** — hover/focus: scale nhẹ qua `.companion-avatar-button`;
  click: pulse ngắn (`.companion-avatar-button--pulse`, 0.45s); kết thúc
  kéo: settle nhẹ (`.companion-presence--drag-settle`, 0.4s).

Toàn bộ animation mới ở trên đều nằm trong danh sách tắt của
`prefers-reduced-motion: reduce` — khi bật, Companion giữ glow tĩnh, chỉ
còn vị trí và hình dạng, không animate.
