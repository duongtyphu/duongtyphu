# 06 — Motion

## Nguyên tắc cốt lõi

**Motion không để gây ấn tượng. Motion để tạo cảm giác Companion đang sống.**

Một chuyển động đẹp nhưng không phục vụ cảm giác "có ai đó đang ở đây, đang thở, đang lắng nghe" là một chuyển động sai vị trí trong hệ thống này — dù nó có tinh xảo đến đâu về mặt kỹ thuật.

Điều này khác biệt căn bản với motion trong sản phẩm giải trí/game: ở đó motion được thiết kế để giữ chân, để gây phấn khích, để tạo phần thưởng tức thời. Ở VO DUONG AI, motion được thiết kế để tạo **sự tin cậy và hiện diện** — chậm rãi, đều đặn, dễ đoán, không bao giờ giật gân.

## Bảng chuyển động chuẩn

| Hiệu ứng | Ý nghĩa cảm xúc | Kỹ thuật | Dùng ở đâu |
|---|---|---|---|
| Fade in nhẹ | "Nội dung đang xuất hiện tự nhiên, không đột ngột" | opacity 0→1, dịch tối đa ~16px, `duration: 0.7s`, `ease: [0.22,1,0.36,1]` | Scroll reveal (`Reveal.tsx`) |
| Hover nổi nhẹ | "Card đang phản hồi sự chú ý của bạn" | `translateY(-4px đến -6px)` + shadow tăng + border sáng hơn | Mọi card (`.gemos-gem-card`) |
| Đổi màu tiêu đề khi hover | "Tiêu đề đang chào đón bạn nhìn vào" | color transition sang brand-blue | `.gemos-card-title` |
| Leaf sway | "Có gió, khu vườn đang sống" | rotate ±2.5deg, chu kỳ ~6s | Garden leaf chip |
| Sparkle nhẹ | "Có ánh sáng lấp lánh, không gian có chiều sâu" | opacity + scale nhấp nháy chậm ~3s | Companion Sanctuary, Garden |
| Sunlight shimmer | "Ánh nắng đang thở" | opacity/scale pulse ~7–10s | Garden sunray, Sanctuary glow orb |
| Tree/canopy breathing | "Cây đang sống, không phải hình tĩnh" | scale 1 → 1.015, chu kỳ ~8s | `GardenTreeVisual` |
| Scroll reveal | "Câu chuyện mở ra khi bạn cuộn tới, không dồn hết một lúc" | fade + dịch 16px, chạy một lần | Companion Sanctuary, Hành trình của tôi |
| Soft parallax | "Có chiều sâu, không phẳng" | tối đa 3% dịch chuyển theo scroll | Chỉ khi được yêu cầu rõ ràng |
| Intro moment | "Companion nhận ra bạn vừa quay lại" | fade overlay 1–1.5s rồi biến mất, không chặn tương tác | Companion Sanctuary |

## Cấm tuyệt đối

- Bounce/spring quá đàn hồi.
- Neon glow, glow cường độ cao.
- Animation kiểu game (particle nổ, số điểm bay lên, confetti, progress bar giật cục).
- Chuyển động gây mất tập trung (xoay liên tục nhanh, nhấp nháy tốc độ cao, rung mạnh).
- Animation làm giảm hiệu năng — luôn animate `transform`/`opacity`, tránh animate `width`/`height`/`top`/`left` trên diện tích lớn.

## Yêu cầu kỹ thuật bắt buộc

- Mọi animation trang trí phải tôn trọng `prefers-reduced-motion: reduce`.
- Hover và animation nền không được xung đột — dùng `animation-play-state: paused` khi hover nếu element vừa có animation liên tục vừa có hover transform.
- Mục tiêu 60 FPS trên thiết bị tầm trung; giảm số lượng phần tử animate trên mobile nếu cần.

*(Nội dung này kế thừa và mở rộng từ `voduongai/design-system/motion/MOTION_SYSTEM.md` — bản gốc giữ nguyên làm lưu trữ.)*
