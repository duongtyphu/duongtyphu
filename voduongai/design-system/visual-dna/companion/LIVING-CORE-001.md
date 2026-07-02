# LIVING CORE-001

- **Name:** Companion Living Core™
- **Status:** Approved — **DESIGN LOCK**
- **Founder Approved:** Yes
- **File:** `LIVING-CORE-001.png`
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
- KHÔNG đổi tỷ lệ, hình dạng (khối bầu dục nghiêng — không phải hình
  tròn đối xứng), màu sắc, hoặc **số lượng quỹ đạo (= 2, cố định)**.
- Việc DUY NHẤT được phép làm với file này là dựng lại bằng SVG + CSS
  animation (đã làm ở `LivingCore.tsx`) — tức "vẽ lại y hệt bằng công
  nghệ khác", không phải "thiết kế lại".
- Bất kỳ thay đổi nào về hình học (geometry) của `LivingCore.tsx` sau
  Design Lock đều phải đối chiếu lại với `LIVING-CORE-001.png` trước,
  không được tự sáng tạo thêm layer/hình dạng mới.

## Đặc điểm hình học (đã đối chiếu trực tiếp với ảnh gốc)

- **Khối chính**: hình bầu dục (oval), nghiêng khoảng -18°, KHÔNG phải
  hình tròn — rộng hơn cao, rìa mềm/mờ dần ra ngoài (aura), không có
  cạnh cứng.
- **Lõi trắng**: lệch tâm về phía trái-trên của khối (không nằm chính
  giữa) — đây là điểm sáng nhất trong ảnh.
- **Quỹ đạo**: đúng **2 vòng** elip mảnh màu trắng/xanh nhạt, mỗi vòng
  nghiêng một góc khác nhau, cắt nhau gần vị trí lõi. Không thêm/bớt
  số vòng.
- **Starfield**: rất nhiều hạt sáng nhỏ (trắng, một ít vàng ấm) rải
  khắp bên trong khối, dày hơn gần lõi, thưa dần ra rìa.
- **Màu — Companion Blue™**: trắng ở lõi → cyan (`#38D5FF`) → xanh
  dương chính (`#4F7DFF`) → xanh dương đậm (`#2447B8`–`#1B3A96`) ở rìa
  khối. Không xanh lá, không đỏ, không neon gắt.

## Trạng thái triển khai

Component: `src/components/LivingCore.tsx` +
`.living-core*` trong `src/app/globals.css`. Xem chi tiết ở
`src/components/LivingCore.tsx` (docstring đầu file
ghi rõ rule này).
