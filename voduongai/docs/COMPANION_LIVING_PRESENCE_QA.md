# Companion Living Presence — Human Experience QA (Sprint 8.5)

Checklist tự đánh giá theo "Definition of Done": *"Companion không chỉ
đang hiển thị. Companion đang sống ở đây."* Câu trả lời dưới đây là tự
đánh giá của AI dựa trên implementation — chưa có xác nhận từ Founder
trải nghiệm thật trên trình duyệt.

1. **Người dùng có nhận ra Companion trong 5 giây không?**
   Có — vẫn là asset Master Design gốc, vị trí quen thuộc (góc dưới
   phải hoặc vị trí đã kéo trước đó), chỉ thêm glow/Nest phía dưới.

2. **Companion có cảm giác nổi trên UI, không "dán" lên màn hình
   không?** Có, ở mức implementation — `drop-shadow` hai lớp (halo +
   bóng navy mềm) cộng Nest (radial-gradient mờ, `z-index: -1`) phía
   dưới tạo chiều sâu. Chưa test thị giác thật trên nhiều nền màu khác
   nhau của Portal.

3. **Companion có làm phiền người dùng không?** Không có cơ chế tự mở
   panel; Greeting Bubble chỉ xuất hiện 1 lần/session, tự ẩn ~5s, có
   nút đóng; minimize được nhớ lại nên người dùng không phải minimize
   lại mỗi lần vào trang.

4. **Companion có cảm giác đang thở/đang sống không?** Có, ở mức
   chuyển động: breathing 7–9s, Nest pulse 8s, ring xoay 9s, Greeting
   Bubble fade nhẹ. Đây vẫn là tự đánh giá — cảm giác "sống" thật cần
   người dùng thật xác nhận.

5. **Lời chào có ấm áp, không gây áp lực không?** Có theo copy đã định
   nghĩa ("Mình sẽ đồng hành cùng bạn trong hành trình này", "Mình rất
   vui vì lại được gặp bạn") — dùng ngôn ngữ mời, không yêu cầu hành
   động.

6. **Trên mobile, Companion có che nội dung chính không?** Greeting
   Bubble giới hạn `min(78vw, 260px)`, neo phía trên-phải Companion,
   không full-width; CompanionSpace vẫn là bottom sheet không full-
   screen. Chưa test trên thiết bị thật, chỉ kiểm tra qua code/CSS.

7. **Kéo (drag) có mượt không?** Logic kéo giữ nguyên từ Sprint 8.3.1
   (Pointer Events, clamp viewport); Sprint 8.5 chỉ thêm hiệu ứng phụ
   (Nest mờ đi khi kéo, ring sáng lên, settle nhẹ khi thả) — không thay
   đổi cơ chế kéo gốc nên rủi ro thấp, nhưng chưa test tay trên trình
   duyệt thật.

8. **Minimize/return home có dễ hiểu không?** Nút mũi tên nhỏ giữ
   nguyên vị trí/hình dạng từ trước; khi minimize, Companion co lại
   thành orb nhỏ + Nest rộng hơn — cùng pattern hình ảnh nên không cần
   học lại cách dùng. Trạng thái được lưu `localStorage` nên nhất quán
   giữa các lần ghé Portal.

9. **State có đổi đúng theo route/hành động không?** Có theo logic:
   route → `getStateForPath`; mở Companion Space → `listening`; đóng →
   `comeback` (vài giây) rồi về lại state theo route. Chưa test thủ
   công qua tất cả route trên trình duyệt thật.

10. **`prefers-reduced-motion` có được tôn trọng không?** Có — toàn bộ
    animation mới (Nest, ring, comeback pulse, pulse click, drag-settle,
    greeting fade) đều nằm trong danh sách tắt animation của media query
    `prefers-reduced-motion: reduce` trong `globals.css`.

## Kết luận trung thực

Toàn bộ tiêu chí trên đạt ở mức **implementation/code review** — đã
qua `tsc --noEmit`, `npm run lint`, `npm run build` không lỗi. Các tiêu
chí cảm tính (thở/sống, ấm áp, không làm phiền) vẫn là tự đánh giá của
AI dựa trên thiết kế chuyển động và copy, **chưa có xác nhận từ Founder
hoặc người dùng thật trải nghiệm trực tiếp trên trình duyệt/thiết bị
thật** (desktop, tablet, mobile, scroll, kéo-thả, minimize, mở/đóng
Companion Space, đổi route, reduced motion, trang dài, trang có input).
Đây là giới hạn cần Founder/Product Team xác nhận trước khi coi Sprint
8.5 là hoàn tất 100% theo đúng tinh thần Human Experience Review.
