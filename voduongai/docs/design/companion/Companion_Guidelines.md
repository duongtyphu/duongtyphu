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
CSS/SVG (`CompanionCrystal`) làm hình ảnh chính. Nguồn ảnh là file PNG
do Founder gửi trực tiếp (`Companion_Master_V1.png`, 1254×1254) — lưu
ở:

- `public/assets/companion/Companion_Master_V1.png` +
  `Companion_Master_V1.webp` (bản gốc, theo Nhiệm vụ 01).
- `src/assets/companion/official/companion-master-v1-{320,160,96,64,48}.png`
  (các bản resize từ đúng file gốc này, không crop nội dung — chỉ
  resize giữ tỷ lệ, dùng cho từng kích thước hiển thị).

**Sprint 8.3.1 — sửa nền trắng vuông:** file gốc Founder gửi thực chất
là PNG nền **trắng đục** (RGB, không có kênh alpha), không phải nền
trong suốt như ghi nhận ban đầu — đây là lý do Companion Presence từng
hiển thị một khối vuông trắng quanh viên ngọc trên nền tối của Portal.
Đã xử lý: tách nền trắng (gần trắng, kênh màu tối thiểu > ngưỡng) thành
alpha trong suốt bằng ngưỡng có feather (190–235) để giữ mượt viền,
không đụng tới vùng tối bên trong viên ngọc (mắt/miệng) — khác với lần
thử chroma-key theo độ sáng trước đó đã làm hỏng vùng tối này. Tất cả
file trong `public/assets/companion/` và `src/assets/companion/official/`
đã được tạo lại từ bản đã tách nền này, đều là RGBA nền trong suốt thật.

Bản đầu Sprint 8.3 từng dùng asset do AI tự cắt từ file poster nhiều
panel — đã được thay thế hoàn toàn bằng file tách lớp chính thức này.
Placeholder cũ vẫn giữ trong code làm phương án dự phòng nếu asset lỗi
tải — không xoá, không dùng làm mặc định nữa.

**Nguyên tắc bắt buộc:** khi Master Design đã có asset chính thức,
không quay lại dùng placeholder làm mặc định trong bất kỳ bề mặt UI
nào. Nếu cần thêm size/crop mới, cắt từ đúng `Companion_Master_V1.png`
gốc, giữ nguyên tỷ lệ DNA + hai chữ V — không tự vẽ lại.

## Kích thước chuẩn (Sprint 8.3.1, tăng 20% theo yêu cầu Founder)

Bản đầu Sprint 8.3 dùng 96–120px — Founder phản hồi quá to. Hai lần
điều chỉnh sau đó giảm xuống 64–56–48px rồi 48–40–36px. Founder sau đó
yêu cầu tăng lại 20% so với mức 48–40–36px — kích thước chuẩn hiện tại:

| Thiết bị | Kích thước Presence | Hover/focus scale |
|---|---|---|
| Desktop (`lg:`) | 58px | 1.06 |
| Tablet (`sm:`) | 48px | — |
| Mobile (mặc định) | 43px | — |

Companion Space header dùng avatar nhỏ hơn (40px) — không áp dụng bảng
trên, chỉ để nhận diện trong panel.

## Vị trí — kéo-thả tự do (Sprint 8.3.1)

Theo yêu cầu Founder, Companion Presence **không còn cố định** ở góc
dưới phải. Người dùng có thể kéo (chuột hoặc chạm) Companion tới bất kỳ
vị trí nào trong vùng nhìn thấy của màn hình. Vị trí được lưu lại
(`localStorage`, khoá `companion-presence-position`) và phục hồi ở lần
xem sau; nếu chưa từng kéo, vị trí mặc định vẫn là góc dưới phải như
cũ. Companion luôn được kẹp (clamp) trong viewport, cách mép tối thiểu
12px, kể cả sau khi resize cửa sổ. Bấm (không kéo) vẫn mở `CompanionSpace`
như trước — phân biệt bằng ngưỡng di chuyển 6px.

## Safe zones (Sprint 8.3, vị trí khởi điểm)

Vị trí khởi điểm khi chưa từng kéo vẫn là góc dưới phải, cách cạnh tối
thiểu 12–16px theo thiết bị — sau đó người dùng có thể kéo đi nơi khác
(xem mục trên). Không bao giờ để Companion che CTA chính, bottom
navigation (nếu có), hoặc form input đang được focus. Khi bàn phím
mobile mở (phát hiện qua `visualViewport` co lại > 140px), Companion tự
ẩn để không che input.

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
thường. Không có cơ chế ép buộc, người dùng luôn chủ động. Từ Sprint
8.5, trạng thái minimize được lưu lại (`localStorage`, khoá
`companion-presence-minimized`) — quay lại trang sau vẫn giữ nguyên
trạng thái đã chọn.

## Sprint 8.5 — Living Presence (Nest, Greeting, Micro-reactions)

Bổ sung lớp "sự sống" quanh Companion — không đổi DNA/Identity/Master
Design, chỉ thêm chiều sâu, nơi đứng nghỉ và phản ứng nhỏ. Chi tiết kỹ
thuật animation xem `Companion_Motion.md`; ở đây ghi lại các quyết định
sản phẩm:

- **Companion Nest** (`CompanionNest.tsx`) — vùng glow rất nhẹ phía
  dưới Companion khi idle, không phải UI điều khiển, chỉ là không gian
  thị giác. Mờ đi khi kéo, đứng yên cùng orb khi minimize.
- **First Greeting Bubble** (`CompanionGreetingBubble.tsx`) — chỉ xuất
  hiện một lần mỗi session, không lặp lại khi đổi route, tự ẩn sau ~5s,
  có nút đóng. Nội dung ưu tiên: lần đầu vào Portal → lời chào chung;
  đã từng vào nhưng quay lại sau ≥2 ngày → lời chào "mừng gặp lại"; các
  lần khác → lời chào theo route (`routeGreetingMap`).
- **Trạng thái khi mở/đóng CompanionSpace** — mở → Companion chuyển
  `listening`; đóng → chuyển tạm sang `comeback` trong vài giây rồi trở
  lại trạng thái theo route.
- **Giới hạn đã biết:** `celebrating` vẫn dùng nhịp bừng sáng ngắn
  (~2.5s) thay vì chu kỳ ambient 7–9s như các state khác — đây là lựa
  chọn có chủ đích (ăn mừng là một khoảnh khắc ngắn, không phải nhịp thở
  liên tục), không phải sai lệch khỏi spec.

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

## Human Experience Review (Sprint 8.3 Embodiment)

Theo yêu cầu spec "Companion Embodiment", Sprint không được coi là xong
nếu bất kỳ câu trả lời nào dưới đây là "không". Tự đánh giá trung thực
dựa trên trạng thái triển khai hiện tại (asset thật từ Founder, nền đã
xử lý trong suốt, size 58/48/43px, kéo-thả tự do, Living Motion 8s,
CompanionSpace 6 mục):

1. **Người dùng có nhận ra Companion ngay lập tức không?** Có — asset
   là chính file Founder gửi (không qua redesign/crop), hiển thị đúng
   hình hài viên ngọc + hai chữ V như Master Design.
2. **Có đúng Master Design không?** Có — không chỉnh tỷ lệ/màu/ánh
   sáng/biểu cảm/vị trí hai chữ V; chỉ resize và xử lý alpha nền (xoá
   nền trắng đục của file gốc), không động vào nội dung hình ảnh.
3. **Có làm Portal ấm lên không?** Có, ở mức tinh tế — glow vàng kim,
   breathing nhẹ, trôi nhẹ quanh vị trí; nhưng đây là đánh giá tự thân
   của AI, **chưa được người dùng thật xác nhận qua trải nghiệm trực
   tiếp trên trình duyệt** (xem mục Verification/Gaps liên quan).
4. **Có gây khó chịu không?** Không có cơ chế tự bật popup, không
   badge, có nút minimize và kéo-thả tự do để người dùng tự định vị —
   giảm thiểu khả năng gây khó chịu, nhưng cũng là tự đánh giá, chưa
   test người dùng thật.
5. **Có tạo cảm giác "không đơn độc" không?** Một phần — Companion
   luôn hiện diện, có lời chào ấm, một câu hỏi reflection mỗi ngày,
   và một dòng "điều Companion muốn chia sẻ". Tuy nhiên CompanionSpace
   vẫn nói thẳng "chưa có AI chat thật" — cảm giác này còn giới hạn ở
   mức Presence + nội dung tĩnh, chưa phải một mối quan hệ hai chiều
   thật sự.

**Kết luận trung thực:** các tiêu chí về đúng Master Design, không gây
khó chịu, và dễ nhận diện đã đạt ở mức implementation. Các tiêu chí về
cảm xúc thật ("ấm lên", "không đơn độc") chỉ được đánh giá chủ quan bởi
AI dựa trên thiết kế nội dung — chưa có xác nhận từ người dùng thật
hoặc thử nghiệm trên trình duyệt thật. Đây là giới hạn cần Founder/Product
Team tự trải nghiệm và xác nhận trước khi coi Sprint là hoàn tất 100%
theo đúng tinh thần "Human Experience Review".
