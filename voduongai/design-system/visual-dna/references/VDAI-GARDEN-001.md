# VDAI-GARDEN-001

- **Name:** The Garden of Growth™
- **Version:** 001
- **Status:** Approved
- **Founder Approved:** Yes
- **File:** `VDAI-GARDEN-001.png`
- **Applies to:** `/portal/khu-vuon-cua-ban`
- **Rule:** This image is Visual Truth. Do not redesign.

## Ý tưởng

Khu vườn tri thức của người dùng — cây lớn đại diện cho sự trưởng thành, mỗi chiếc lá treo trên cây là một hành động học tập có ý nghĩa (đọc bài, học bài, thực hành, lưu tài liệu, đặt câu hỏi, cảm hứng). Cảm giác: một khu vườn thật vào buổi sáng, ấm áp, sống động, bình yên — không phải dashboard.

## Màu

- Nền chính: trắng ngọc pha ánh vàng nắng (`#FFFDF8`–`#FFF9EF` khu bên trái, chuyển dần sang ảnh cây thật bên phải).
- Xanh lá tự nhiên cho leaf chip: `#3F7A4F`–`#2E5E3C` (glass xanh lá đậm, icon/text trắng).
- Vàng nắng cho ánh sáng xuyên tán lá (volumetric sunray) chiếu từ góc trên bên phải.
- Progress bar "Cây tri thức của bạn": xanh lá (`#4ADE80`→`#22C55E`).
- Card trắng mềm (`#FFFFFF` với shadow rất nhẹ, bo góc lớn ~20-24px).
- Icon stat: xanh lá (lá), vàng (mặt trời), xanh dương (giọt nước), vàng gold (ngôi sao).
- Quote footer: nền trắng ngọc pha xanh dương rất nhạt, dấu ngoặc kép lớn màu xanh dương nhạt.

## Layout

- Sidebar trái giữ nguyên Portal Sidebar hiện có (không đổi) — mục "Khu vườn của bạn" active có nền xanh lá rất nhẹ, chữ + icon xanh lá.
- Main content chia 2 vùng lớn:
  - **Trên**: trái ~35% (title "Khu vườn của bạn" 🌿, subtitle gradient, mô tả, card "Cây tri thức của bạn" Lv.7/Vùng vàng/progress 78%, 4 stat "128 lá / 24 ngày / 36h / 15 chủ đề", quote nhỏ) — phải ~65% (ảnh cây thật + 6 leaf chip + ánh nắng + card "Gợi ý chăm sóc khu vườn" nổi ở góc dưới phải của vùng cây).
  - **Dưới**: 2 card song song — "Những chiếc lá gần đây" (trái, danh sách 3 hoạt động có icon lá màu khác nhau + thời gian) và "Chăm sóc khu vườn" (phải, 3 gợi ý + ảnh bình tưới nhỏ góc dưới phải).
- Footer: quote card riêng full-width cuối trang, nền trắng ngọc, bo góc lớn, shadow mềm.
- Góc trên bên phải màn hình có greeting card "Chào buổi sáng, [Tên]" + avatar — **đây là phần của Header/Portal Shell hiện có (welcome message), không thuộc Main Content của trang Garden — không tái tạo lại trong component trang này.**
- "Daily Seed" card nhỏ dưới menu sidebar (góc dưới trái) — nằm trong vùng thị giác của Sidebar. Theo Component Rules (`COMPONENT_RULES.md`), trang đặc biệt chỉ được đổi Main Content + Footer, không đổi Sidebar → **không triển khai** trong sprint này để tránh phá vỡ Sidebar dùng chung. Ghi nhận là gap cần quyết định riêng nếu Founder muốn thêm vào Sidebar Portal.

## Typography

- Title "Khu vườn của bạn": sans-serif đậm, đen/xám đậm, kèm icon lá nhỏ phía trên.
- Subtitle "Mỗi hành động nhỏ, đều đang vun đắp cho sự trưởng thành.": chữ nghiêng mềm mại, gradient nhiều màu (xanh dương → tím → cam), cỡ vừa, không quá to.
- Mô tả: chữ thường, xám, cỡ nhỏ-vừa, leading thoáng.
- Card title ("Cây tri thức của bạn", "Những chiếc lá gần đây", "Chăm sóc khu vườn"): đậm, đen/xám đậm.
- Leaf chip label: trắng, đậm vừa, cỡ nhỏ; timestamp nhỏ hơn, trắng mờ.
- Quote: chữ thường/nghiêng nhẹ, xám đậm, căn giữa.

## Animation

Ảnh là tĩnh — animation áp dụng theo suy luận hợp lý từ tinh thần "khu vườn đang sống" (không tự bịa hiệu ứng mạnh), theo `MOTION_SYSTEM.md`/`06-motion/`:
- Leaf chip: hover nổi nhẹ + glow tăng nhẹ.
- Ánh nắng: shimmer rất nhẹ (opacity/scale pulse chậm).
- Sparkle rất nhẹ quanh tán cây.
- Card hover: nổi nhẹ (dùng chuẩn `.gemos-gem-card` toàn Portal).
- Progress bar: có thể có hiệu ứng fill nhẹ khi vào trang (transition width/opacity một lần, không lặp).

## Feeling

Ấm áp, chân thật, bình yên, đang sống, trưởng thành — như một buổi sáng thật trong khu vườn của chính mình. Tuyệt đối không dashboard khô, không gamification, không cyberpunk/neon.

## Ghi chú kỹ thuật (asset đã crop từ ảnh gốc)

Vì chưa có ảnh cây tách riêng (clean, không có UI đè lên), đã crop tạm 2 vùng từ ảnh gốc để dùng làm background thật cho vùng cây và vùng "Chăm sóc khu vườn" — theo đúng cho phép trong brief ("có thể dùng ảnh reference làm background tạm thời cho vùng tree, nhưng phải crop/fit đúng"):

- `public/images/garden/garden-tree-scene.jpg` — crop vùng cây + ánh nắng (loại bỏ sidebar/nội dung trái).
- `public/images/garden/garden-care-visual.jpg` — crop vùng bình tưới nhỏ dùng cho card "Chăm sóc khu vườn".

Khi có asset cây thật tách riêng (không dính leaf chip baked-in), thay thế 2 file trên và cập nhật ghi chú này.
