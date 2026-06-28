# Companion Reflection Letter — Framework

Sprint 15.0 — The Mirror of Growth, Nhiệm vụ 06. Đây là deliverable
quan trọng nhất của Sprint này.

## Lá thư nhìn lại là gì

Một lá thư Companion viết (do người, không phải AI tự sinh trong sprint
này) khi nhìn lại hành trình của một người dùng — không phải một thông
báo, không phải một email marketing. Một lá thư cá nhân, ấm áp, kể lại
sự thay đổi đã thật sự xảy ra.

## Khung 5 phần

1. **Mở đầu (Opening)** — một lời chào trực tiếp, không trang trọng.
   Ví dụ: *"Chào bạn."*
2. **Những ngày đầu (Early Days)** — nhắc lại điểm bắt đầu, bằng đúng
   những gì người dùng từng nói/làm, không phải suy diễn.
   Ví dụ: *"Ngày đầu tiên bạn đến đây. Bạn chỉ muốn học AI."*
3. **Điểm ngoặt (Turning Point)** — khoảnh khắc Companion nhận ra một
   điều khác đang diễn ra, dựa trên một mốc trưởng thành thật
   (`growth-milestones.ts`) hoặc một Reflection Moment
   (`growth-reflection-engine.ts`).
   Ví dụ: *"Nhưng rồi mình nhận ra. Bạn không chỉ học AI."*
4. **Hôm nay (Today)** — điều đang đúng ngay bây giờ, không phóng đại,
   không kết luận thay người dùng.
   Ví dụ: *"Bạn đang học cách tin vào chính mình."*
5. **Kết (Closing)** — một câu giữ lại, không kêu gọi hành động, không
   chèn CTA.

## Nguyên tắc viết

- Chỉ dùng dữ liệu đã thật sự xảy ra (signal/milestone có thật) — không
  thêm tình tiết tưởng tượng.
- Không dùng "Congratulations", "Achievement unlocked", hoặc bất kỳ
  ngôn ngữ gamification nào.
- Không so sánh người dùng với người khác.
- Đây là framework để CON NGƯỜI (Product/Companion writer) viết lá thư
  — Sprint này không tự động sinh lá thư bằng AI. `reflection-letter.ts`
  chỉ cho biết phần nào đã có đủ "nguyên liệu" thật để viết, không tự
  viết câu văn.

## Ví dụ đầy đủ

> Chào bạn.
>
> Có một điều mình muốn kể.
>
> Ngày đầu tiên bạn đến đây.
>
> Bạn chỉ muốn học AI.
>
> Nhưng rồi mình nhận ra.
>
> Bạn không chỉ học AI.
>
> Bạn đang học cách tin vào chính mình.
