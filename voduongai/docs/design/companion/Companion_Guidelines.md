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
