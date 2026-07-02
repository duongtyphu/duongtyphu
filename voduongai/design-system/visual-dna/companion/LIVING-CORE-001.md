# LIVING CORE-001

- **Name:** Companion Living Core™
- **Version:** v1.0 — Official Companion Visual Design (thay thế bản nháp trước;
  Founder xác nhận đây là bản chính thức được đánh số version).
- **Status:** Approved — **DESIGN LOCK**
- **Founder Approved:** Yes
- **File:** `LIVING-CORE-001.png` (đã ghi đè theo ảnh v1.0 Founder gửi)
- **Applies to:** `src/components/LivingCore.tsx`

## Rule — đọc trước khi chạm vào component này

> "Hãy coi hình Companion này giống như Logo Apple. Không ai được quyền
> thiết kế lại logo. Bạn chỉ được quyền dựng lại bằng SVG. Không thay
> đổi ngôn ngữ thiết kế." — Founder

`LIVING-CORE-001.png` là **Visual Truth** duy nhất cho biểu tượng
Companion — được đối xử như một logo đã chốt (giống Apple logo), KHÔNG
phải ảnh tham khảo để lấy cảm hứng. Điều đó có nghĩa:

- KHÔNG redesign, KHÔNG tạo biến thể mới, KHÔNG thay bằng phiên bản
  AI-generate khác.
- KHÔNG đổi tỷ lệ, hình dạng (khối cầu gần tròn + 2 vòng quỹ đạo lớn
  vươn ra ngoài rìa như vành đai Saturn), màu sắc, hoặc **số lượng quỹ
  đạo (= 2, cố định)**.
- Việc DUY NHẤT được phép làm với file này là dựng lại bằng SVG + CSS
  animation (đã làm ở `LivingCore.tsx`) — tức "vẽ lại y hệt bằng công
  nghệ khác", không phải "thiết kế lại".
- Bất kỳ thay đổi nào về hình học (geometry) của `LivingCore.tsx` sau
  Design Lock đều phải đối chiếu lại với `LIVING-CORE-001.png` trước,
  không được tự sáng tạo thêm layer/hình dạng mới.

## Đặc điểm hình học (đã đối chiếu trực tiếp với ảnh v1.0)

- **Khối chính**: khối cầu GẦN TRÒN (rx≈ry, chỉ hơi nghiêng ~-14°),
  khác với bản nháp trước (từng là oval kéo dài) — rìa mềm/mờ dần ra
  ngoài (aura), không có cạnh cứng.
- **Lõi trắng**: gần chính giữa khối cầu (chỉ lệch nhẹ), là điểm sáng
  nhất trong ảnh — KHÔNG lệch mạnh sang một góc như bản nháp trước.
- **Quỹ đạo**: đúng **2 vòng** elip mảnh màu trắng/xanh nhạt, bán kính
  LỚN HƠN khối cầu — vươn ra ngoài rìa như vành đai Saturn (không nằm
  gọn bên trong thân cầu). Mỗi vòng nghiêng một góc khác nhau, cắt
  nhau gần vị trí lõi. Không thêm/bớt số vòng.
- **Starfield**: rất nhiều hạt sáng nhỏ (trắng, một ít vàng ấm) rải
  khắp bên trong khối cầu, dày hơn gần lõi, thưa dần ra rìa.
- **Màu — Companion Blue™**: trắng ở lõi → cyan (`#38D5FF`) → xanh
  dương chính (`#4F7DFF`) → xanh dương đậm (`#2447B8`–`#1B3A96`) ở rìa
  khối. Không xanh lá, không đỏ, không neon gắt.

## Lịch sử điều chỉnh

- **v1.0**: sau khi Founder gửi ảnh chính thức có đánh số version,
  audit lại thấy bản dựng trước có 2 sai lệch so với ảnh gốc: (1) khối
  chính bị kéo oval quá mức thay vì gần tròn, (2) quỹ đạo nằm gọn
  trong thân cầu thay vì vươn ra ngoài như vành đai. Đã sửa lại đúng
  hình học ảnh v1.0 — xem toạ độ cụ thể trong `LivingCore.tsx`.

## Trạng thái triển khai

Component: `src/components/LivingCore.tsx` +
`.living-core*` trong `src/app/globals.css`. Xem chi tiết ở
`src/components/LivingCore.tsx` (docstring đầu file
ghi rõ rule này).
