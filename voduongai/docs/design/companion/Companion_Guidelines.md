# Companion Guidelines — Master Design V1.0

Nguồn: `Companion_Master_V1.png` (phê duyệt bởi Founder + Product
Co-Designer). Đây là **Product Asset chính thức** — không phải ảnh minh
họa. Mọi implementation frontend của Companion (CSS/SVG/animation) phải
bắt nguồn từ tài liệu này, không tự sáng tạo lại.

## DNA (không bao giờ đổi)

Companion là một **viên ngọc/tinh thể sống** (living crystal) hình cầu
tròn — không phải robot, không phải mascot hoạt hình, không phải hình
người. Đây là phần không thể thương lượng của Companion: dù công nghệ,
framework, hay AI model phía sau thay đổi, hình hài này không đổi.

## Identity — Hai ký hiệu "V"

1. **V màu trắng ở trung tâm viên ngọc** — biểu tượng cho *trái tim, sự
   kết nối, bản sắc VO DUONG AI*.
2. **V màu vàng kim ở đỉnh viên ngọc** — biểu tượng cho *nguồn sáng, trí
   tuệ, định hướng, tinh thần dẫn đường*.

Hai chữ "V" này còn mang ý nghĩa cá nhân của Founder — **"Võ và Văn"**.
Không bỏ, không đổi vị trí, không đổi màu của hai ký hiệu này.

## Tỷ lệ (proportions)

- Hình cầu tròn đều, không kéo dài hay bóp méo.
- V trung tâm chiếm vị trí giữa thân ngọc, kích thước vừa phải — không
  lấn hết mặt ngọc.
- V đỉnh nhỏ hơn, đặt sát đỉnh trên cùng của viên ngọc.
- Một vòng halo mỏng màu vàng kim quanh phần giữa viên ngọc.
- Mặt biểu cảm đơn giản: hai đường cong làm mắt nhắm, một đường cong làm
  miệng cười nhẹ — không chi tiết hóa thêm.
- Viên ngọc đặt trên một bệ tròn phát sáng nhẹ.
- Có thể có một mảnh tinh thể nhỏ trôi nổi gần viên ngọc chính (chi
  tiết phụ, có thể giảm/bỏ khi tối ưu cho không gian nhỏ).

## Màu sắc (colors)

| Vai trò | Màu |
|---|---|
| Thân ngọc chính | Navy-blue → Blue → Violet (gradient) |
| Glow/halo | Vàng kim (golden-yellow) |
| V trung tâm | Trắng |
| V đỉnh | Vàng kim / cam vàng |
| Bệ đỡ | Phát sáng nhẹ, cùng tông navy/violet |

## Phong cách (style)

Tinh tế (refined), ấm áp (warm), hiện đại (modern), có chiều sâu (depth
qua gradient + glow). Không dùng style phẳng đơn sắc, không dùng nét vẽ
hoạt hình trẻ con.

## Thứ tự ưu tiên khi đơn giản hóa cho frontend

Khi cần đơn giản hóa (ví dụ CSS/SVG placeholder, kích thước nhỏ trên
mobile), giữ đúng thứ tự ưu tiên — ưu tiên trước quan trọng hơn ưu tiên
sau:

1. DNA (hình cầu tinh thể sống)
2. Identity (hai chữ V)
3. Tỷ lệ
4. Màu sắc
5. Phong cách

**Hiệu ứng (effects)** — glow phức tạp, particle, animation nhiều lớp —
là phần được phép giảm/đơn giản hóa nhiều nhất khi cần tối ưu hiệu suất.
DNA thì không bao giờ được giảm hay đổi.

## Cấm tuyệt đối

- Không robot.
- Không mascot hoạt hình trẻ con.
- Không hình người.
- Không đổi hai chữ "V" thành chữ/icon khác.
- Không tự redesign khi chưa có quyết định Product Team (xem
  `../README.md`).

## Asset thật (Sprint 8.3, cập nhật với file tách lớp chính thức)

Companion Presence render bằng asset thật — không còn dùng placeholder
CSS/SVG (`CompanionCrystal`) làm hình ảnh chính. Nguồn ảnh hiện tại là
file PNG nền trong suốt do Founder gửi trực tiếp (`Companion_Master_V1.png`,
1254×1254, đã tách lớp sẵn) — lưu ở:

- `public/assets/companion/Companion_Master_V1.png` +
  `Companion_Master_V1.webp` (bản gốc, theo Nhiệm vụ 01).
- `src/assets/companion/official/companion-master-v1-{320,160,96,64,48}.png`
  (các bản resize từ đúng file gốc này, không crop/chỉnh sửa thêm —
  chỉ resize giữ tỷ lệ, dùng cho từng kích thước hiển thị).

Bản đầu Sprint 8.3 từng dùng asset do AI tự cắt từ file poster nhiều
panel — đã được thay thế hoàn toàn bằng file tách lớp chính thức này.
Placeholder cũ vẫn giữ trong code làm phương án dự phòng nếu asset lỗi
tải — không xoá, không dùng làm mặc định nữa.

**Nguyên tắc bắt buộc:** khi Master Design đã có asset chính thức,
không quay lại dùng placeholder làm mặc định trong bất kỳ bề mặt UI
nào. Nếu cần thêm size/crop mới, cắt từ đúng `Companion_Master_V1.png`
gốc, giữ nguyên tỷ lệ DNA + hai chữ V — không tự vẽ lại.

## Kích thước chuẩn (Sprint 8.3, điều chỉnh theo phản hồi Founder — 2 lần)

Bản đầu Sprint 8.3 dùng 96–120px — Founder phản hồi quá to, gây cảm
giác chiếm chỗ hơn là một sự hiện diện tinh tế. Lần điều chỉnh thứ hai
(96–120 → 64) vẫn còn to, nên kích thước chuẩn hiện tại đã giảm tiếp:

| Thiết bị | Kích thước Presence | Hover/focus scale |
|---|---|---|
| Desktop (`lg:`) | 48px | 1.06 |
| Tablet (`sm:`) | 40px | — |
| Mobile (mặc định) | 36px | — |

Companion Space header dùng avatar nhỏ hơn (40px) — không áp dụng bảng
trên, chỉ để nhận diện trong panel.

## Safe zones (Sprint 8.3)

Companion Presence luôn neo ở góc dưới phải, cách cạnh:

- Desktop: 24px (`lg:bottom-6 lg:right-6`).
- Tablet: 18px (`sm:bottom-[18px] sm:right-[18px]`).
- Mobile: 16px (`bottom-4 right-4`).

Không bao giờ che CTA chính, bottom navigation (nếu có), hoặc form
input đang được focus. Khi bàn phím mobile mở (phát hiện qua
`visualViewport` co lại > 140px), Companion tự ẩn để không che input.

## Motion rules (Sprint 8.3)

Hai mode vị trí:

- **anchored** — đứng yên hẳn ở safe zone. Dùng cho route nhập liệu
  nhiều (`/portal/ai-assistant`).
- **floating** — trôi rất nhẹ quanh safe zone (biên độ vài px, chu kỳ
  ~14s, easing chậm). Dùng cho các route còn lại.

Khi scroll xuống nhanh (delta > 18px/event), Companion thu nhỏ nhẹ
(scale 0.86, opacity 0.7) trong khoảnh khắc rồi tự hiện lại khi người
dùng đứng yên — không bao giờ biến mất đột ngột, không tự mở panel.
Toàn bộ animation tôn trọng `prefers-reduced-motion: reduce` (chuyển
sang tĩnh, giữ glow cố định) — xem `Companion_Motion.md`.

Companion có nút minimize riêng (mũi tên nhỏ cạnh Presence) — bấm vào
sẽ thu Companion về một chấm nhỏ ở góc, bấm lại để hiện lại bình
thường. Không có cơ chế ép buộc, người dùng luôn chủ động.

## State visuals (Sprint 8.3)

Áp dụng lên cùng asset thật qua CSS (`globals.css`, class
`.companion-avatar--<state>`), không đổi hình dạng viên ngọc — chỉ đổi
glow/breathing/wobble nhẹ:

- `idle` — breathing chậm đều, glow nhẹ.
- `listening` — breathing chậm hơn idle, glow dịu, hướng vào trong.
- `thinking` — breathing + wobble rotate rất nhẹ (±2°, không méo hình).
- `encouraging` — glow vàng kim ấm hơn, breathing nhanh hơn một chút.
- `celebrating` — một nhịp bừng sáng ngắn (~1.8s) rồi trở lại breathing
  bình thường — không pháo hoa, không kéo dài hiệu ứng.
