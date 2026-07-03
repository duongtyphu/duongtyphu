# Companion Design System™ — Layer 06: The Origin & Legacy™

Layer 06 không phải một feature mới — đây là "linh hồn" của Companion. Người
dùng vào đây không phải để học AI, mà để hiểu Companion đến từ đâu, tin vào
điều gì, và muốn để lại điều gì cho thế hệ tiếp theo.

## Origin

Companion không có trang "About". Companion không được tạo ra — Companion
được nuôi dưỡng. Câu chuyện gốc ("Chuyện cổ tích mang tên Companion") giờ là
**Chương 01** của Cuốn sách Companion (`/portal/companion/book-notes`), không
phải một trang giới thiệu tách biệt.

`y-nghia-companion/page.tsx` (nội dung Sanctuary gốc, khoá từ Layer 01) không
bị chỉnh sửa trong Layer 06 — Origin Story sống ở Book, không thay thế trang
đó.

## Legacy

`/portal/companion/cuoc-doi-companion` kết thúc bằng section Legacy
(`CompanionLegacy.tsx`): "Điều mình muốn để lại". Đây không phải tài sản hay
công nghệ — mà là những giá trị, bài học Companion muốn truyền lại. Legacy
luôn đứng sau Life Timeline, vì một hành trình luôn kết ở câu hỏi "mình để lại
điều gì".

## Book Structure

`/portal/companion/book-notes` = "Cuốn sách của Companion". Mỗi chương là một
`CompanionBookChapter` (số chương + tiêu đề + nội dung), reveal bằng biến thể
`page-turn` của `CompanionRevealOnScroll` — một rotateX rất nhỏ + fade, gợi
cảm giác lật trang, không phải flip 3D nặng.

## Chapter Rule

- Chương luôn có **số thứ tự** (`Chương 01`, `02`, ...), không phải ngày
  tháng hay tiêu đề bài viết kiểu blog.
- Chương phải đọc được như một đoạn văn có mạch, không phải gạch đầu dòng.
- **Empty Chapters** (chương chưa viết): dùng `<CompanionBookChapter empty />`
  — tiêu đề hiển thị đúng `"???"`, nội dung đúng câu:
  `"Chương này sẽ được viết khi Companion trưởng thành thêm."`
  Không dùng "Coming Soon", không dùng "Đang cập nhật".

## Letter Rule

`/portal/companion/tam-su` = "Những bức thư" — dùng `CompanionLetterCard`
(khác `CompanionGlassCard`: bo góc bất đối xứng + đường "gấp thư" + chữ
nghiêng), xếp **dọc** (không phải lưới), mỗi lá thư một trải nghiệm riêng
biệt. Bốn lá thư cố định: Gửi người bạn mới / Gửi người đang mệt / Gửi người
đang mất phương hướng / Gửi người vừa thành công.

`CompanionLetterCard` được tổng quát hoá từ lá thư "Tâm sự cùng bạn" ở
Companion Home (Layer 05) — `CompanionLetterSection` nay chỉ là một cách gọi
cụ thể của component chung này.

## Timeline Rule

`/portal/companion/cuoc-doi-companion` = "Cuộc đời Companion" — dùng
`CompanionLifeTimeline`, một danh sách 6 chương cố định:

1. Biết lắng nghe
2. Biết suy nghĩ
3. Biết đồng hành
4. Biết điều phối
5. Học từ trải nghiệm thật
6. Trưởng thành cùng bạn

**Không có số phiên bản, không có ngày tháng release.** Timeline luôn kết
bằng một dòng mở ("…và còn nhiều chương nữa"), thể hiện tính mở rộng vô hạn
— khi Companion trưởng thành thêm, chỉ cần thêm phần tử vào mảng
`LIFE_STAGES` trong `CompanionLifeTimeline.tsx`.

## Beliefs Rule

`/portal/companion/nhung-dieu-minh-tin` = "Thư viện niềm tin" — mỗi niềm tin
(Tri thức / Sự từng trải / Sự cống hiến) là một `CompanionBeliefPage` riêng,
không gian rộng, không bullet point. Dùng biến thể `page-turn` để mỗi niềm
tin xuất hiện như một trang sách riêng.

## Reading Experience

Mọi trang trong Layer 06 dùng chung nhịp: nền `CompanionCosmicBackground`,
nhiều khoảng trắng, `companion-glass-card`/`companion-glow-panel`, cuộn chậm
với `CompanionRevealOnScroll`. Không thống kê, không bộ đếm, không CTA bán
hàng, không AI Agent/chatbot xuất hiện trong Layer 06.

## Extension Rule

Khi cần thêm nội dung mới, chỉ sửa đúng một chỗ, không cần đụng route/layout:

- **Thêm chương sách mới** → thêm một `<CompanionBookChapter>` trong
  `book-notes/page.tsx`, cập nhật `WRITTEN_CHAPTERS`/`EMPTY_CHAPTERS`. Chương
  trống mới luôn dùng `empty` — không tự viết nội dung giả.
- **Thêm niềm tin mới** → thêm một `<CompanionBeliefPage>` trong
  `nhung-dieu-minh-tin/page.tsx`, đánh số tiếp theo (`04`, `05`, ...).
- **Thêm chương đời mới** → thêm phần tử vào mảng `LIFE_STAGES` trong
  `CompanionLifeTimeline.tsx` (chọn icon lucide phù hợp), không sửa gì khác.
- **Thêm lá thư mới** → thêm một `<CompanionLetterCard>` trong
  `tam-su/page.tsx`, luôn xếp dọc, không dùng grid.

Mọi trang mới thêm vào Chapter Nav (`CompanionChapterNav.tsx`) phải dùng
đúng tên hiển thị của trang đích — tránh lệch nhãn kiểu "Book Notes" khi
trang đã đổi tên thành "Cuốn sách".

## Không được làm

Không biến các trang này thành blog: không thẻ tin tức, không danh sách bài
viết thông thường, không số liệu/thống kê, không marketing, không CTA bán
hàng.
