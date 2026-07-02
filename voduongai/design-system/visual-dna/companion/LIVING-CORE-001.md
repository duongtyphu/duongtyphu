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
- KHÔNG đổi tỷ lệ, hình dạng (khối năng lượng trung tâm phải là hình
  TRÒN THUẦN, cân đối tuyệt đối — không oval/egg/méo — + 3 Orbit Ring
  lớn vươn ra ngoài rìa, bay tự do quanh lõi), màu sắc, hoặc **số
  lượng quỹ đạo (= 3, cố định — cập nhật theo brief ENERGY CORE mới
  nhất)**.
- Việc DUY NHẤT được phép làm với file này là dựng lại bằng SVG + CSS
  animation (đã làm ở `LivingCore.tsx`) — tức "vẽ lại y hệt bằng công
  nghệ khác", không phải "thiết kế lại".
- Bất kỳ thay đổi nào về hình học (geometry) của `LivingCore.tsx` sau
  Design Lock đều phải đối chiếu lại với `LIVING-CORE-001.png` trước,
  không được tự sáng tạo thêm layer/hình dạng mới.

## Đặc điểm hình học (đã đối chiếu trực tiếp với ảnh v1.0)

- **Khối chính**: hình TRÒN THUẦN (rx = ry, không nghiêng) — CÂN ĐỐI
  TUYỆT ĐỐI, không oval/egg/méo (đã sửa lại từ bản trước còn hơi kéo
  dài) — rìa mềm/mờ dần ra ngoài (aura), không có cạnh cứng. Cảm giác
  tham chiếu: Apple Intelligence / Siri Orb / OpenAI Voice Orb /
  Nothing Glyph / Interstellar energy core — KHÔNG phải Earth/Planet/
  Marble/Crystal Ball.
- **Lõi trắng**: gần chính giữa khối cầu (chỉ lệch nhẹ), là điểm sáng
  nhất trong ảnh — KHÔNG lệch mạnh sang một góc như bản nháp trước.
- **Quỹ đạo (Orbit Ring)**: đúng **3 vòng** elip mảnh màu trắng/xanh
  nhạt/tím nhạt, bán kính LỚN HƠN Energy Core, có khoảng cách rõ ở mọi
  hướng — bay tự do quanh lõi như electron quanh hạt nhân, không áp
  sát bề mặt. Mỗi vòng khác góc nghiêng, độ mảnh (stroke-width), tốc
  độ quay và opacity. Không thêm/bớt số vòng.
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
- **v1.0 — chất liệu (material)**: Founder làm rõ đây là ENERGY CORE,
  không phải planet/sphere/3D ball/marble/egg/glass ball — không được
  có cảm giác vật thể đặc/khối lượng/bóng đổ như quả bóng, không
  specular highlight kiểu bóng nhựa. Đã đổi phần "body" từ gradient mô
  phỏng ánh sáng chiếu lên khối cầu rắn (viền tối đặc) sang plasma/
  volumetric glow: rìa tan dần vào trong suốt (opacity → 0, không còn
  màu tối ở viền), `mix-blend-mode: screen` để các lớp sáng cộng dồn
  thay vì tô đặc, thêm blur mềm ở rìa. Quỹ đạo cũng được kéo cách xa
  quầng sáng ở MỌI hướng (không chỉ theo chiều ngang) để bay tự do như
  electron quanh hạt nhân, không còn áp sát bề mặt như dây quấn quanh
  quả bóng.
- **v1.0 — cân đối tuyệt đối**: Founder chỉ rõ hình tổng thể không
  được kéo dài/oval/egg/méo — phải là hình tròn cân đối tuyệt đối. Đã
  đổi khối chính + aura + clipPath từ ellipse (rx≠ry, có nghiêng -14°)
  sang circle thuần (rx=ry, bỏ transform nghiêng vì không còn cần
  thiết với hình tròn đối xứng). Orbit Ring giữ dạng ellipse nghiêng
  (đây là layer riêng, không phải hình dạng của khối năng lượng
  chính).
- **v1.1 — ENERGY CORE, 3 Orbit Ring**: Founder gửi brief đầy đủ đặt
  tên chính thức "ENERGY CORE" (không dùng từ "planet"/"hành tinh"
  trong code/comment), yêu cầu cấu trúc layer: Outer Aura / Energy
  Core / White Inner Light / Orbit Ring 1-2-3 / Sparkle Particles /
  Soft Glow. Số lượng quỹ đạo tăng từ 2 lên **3** (mỗi vòng khác góc
  nghiêng/độ mảnh/tốc độ/opacity). Chỉ hiện đủ 3 vòng ở size ≥128px để
  không rối mắt ở size nhỏ. Đã purge từ "hành tinh"/"khối cầu" khỏi
  toàn bộ comment trong `LivingCore.tsx`, `globals.css`, và script
  export SVG.

## Trạng thái triển khai

Component: `src/components/LivingCore.tsx` +
`.living-core*` trong `src/app/globals.css`. Xem chi tiết ở
`src/components/LivingCore.tsx` (docstring đầu file
ghi rõ rule này).
