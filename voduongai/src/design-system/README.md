# VO DUONG AI Design System™ v1.0

> Nền móng thiết kế thống nhất cho toàn bộ Portal — không còn phát triển từng trang riêng lẻ.

Đây là hệ thống thiết kế chính thức cho VO DUONG AI, thay thế cách làm cũ ("mỗi trang một phong cách"). Mọi UI mới, mọi component mới, mọi trang mới trong Portal đều phải bắt nguồn từ đây.

## Design Philosophy

**VO DUONG AI không phải một website. VO DUONG AI là một hệ điều hành giáo dục (education operating system).**

- Companion là trung tâm của hệ điều hành này — không phải một tính năng, không phải một chatbot phụ trợ.
- **Design phải phục vụ Companion. Không phải ngược lại.** Mọi quyết định thiết kế — màu sắc, chuyển động, bố cục — phải được hỏi: "Điều này có giúp Companion cảm thấy đang hiện diện, đang lắng nghe, đang đồng hành không?"
- Xem chi tiết đầy đủ trong [`01-foundation/README.md`](./01-foundation/README.md).

## Design Rules (tóm tắt — chi tiết xem từng thư mục)

1. **Không hardcode giá trị thiết kế.** Màu, cỡ chữ, khoảng cách, easing chuyển động — tất cả phải đi qua token đã định nghĩa trong `02-colors/`, `03-typography/`, `04-spacing/`, `06-motion/`.
2. **Component phải dùng lại, không viết lại.** Trước khi tạo card/button/badge mới, kiểm tra `07-components/` xem đã có chuẩn chưa.
3. **Layout phải chọn từ danh sách đã chuẩn hóa.** Xem `08-layout/` — Portal Layout, Learning Layout, Story Layout, Garden Layout, Companion Layout, Journey Layout.
4. **Design Reference là Visual Truth.** Nếu Founder đã duyệt một ảnh tham chiếu (lưu ở `10-reference/`), không được tự ý redesign — xem quy trình trong `10-reference/README.md`.
5. **Sprint xây nền móng ≠ sprint code UI.** Sprint thiết lập Design System (như sprint này) chỉ viết tài liệu/token, không đụng vào Portal/Garden/Companion đang chạy.

## Naming Convention

- Thư mục cấp 1 đánh số theo thứ tự phụ thuộc (`01-foundation` là nền, các thư mục sau xây trên nền đó): `0X-<ten-khong-dau>`.
- Token: `snake-case` cho key CSS custom property (`--color-brand-blue`), `camelCase`/`PascalCase` cho hằng số TypeScript.
- Component doc: tên component viết hoa chữ cái đầu, khớp tên file component thật trong `src/components/portal/` (ví dụ doc "Garden Leaf" ↔ component `GardenTreeVisual`/leaf chip).
- Design Reference: `<khu-vực>-reference-v<số>.png` (xem `10-reference/README.md`).

## Folder Structure

```
src/design-system/
├── 01-foundation/    Triết lý cốt lõi — OS giáo dục, Companion-first
├── 02-colors/        Color tokens (Primary/Secondary/Success/Garden/Companion/Premium/Warning/Neutral/Surface/Background/Text)
├── 03-typography/    Type scale (Hero/Display/Heading/Sub Heading/Title/Body/Caption/Quote/Reflection/Thought/Companion Voice)
├── 04-spacing/       Spacing scale, khoảng trắng, nhịp thở bố cục
├── 05-icons/         Bộ icon chuẩn (Lucide), quy tắc dùng icon
├── 06-motion/        Motion principles — chuyển động để Companion "sống", không phải để gây ấn tượng
├── 07-components/    Chuẩn hóa Card/Button/Input/Badge/Chip/Knowledge Card/Journey Card/Garden Leaf/Timeline/Section/Companion Quote/Reflection Card
├── 08-layout/        Chuẩn hóa Portal/Learning/Story/Garden/Companion/Journey Layout
├── 09-patterns/       Pattern tái sử dụng (empty state, loading state, error state, CTA pattern...)
├── 10-reference/     Design Reference đã Founder duyệt — Visual Truth, không redesign
└── docs/             Tài liệu vận hành hệ thống (doctrine, workflow, migration từ hệ cũ)
```

## Workflow — khi nhận một yêu cầu thiết kế mới

1. Đọc `01-foundation/README.md` để nhớ triết lý gốc.
2. Kiểm tra `10-reference/` — đã có Design Reference đã duyệt cho khu vực này chưa?
3. Nếu có → tái hiện đúng theo reference, chỉ tối ưu responsive/a11y/performance (xem `docs/`).
4. Nếu chưa có → dùng token từ `02-colors/` → `06-motion/`, chọn component có sẵn từ `07-components/`, chọn layout có sẵn từ `08-layout/`. Không tự sáng tạo giá trị mới ngoài hệ token.
5. Nếu một tình huống chưa có token/component/layout phù hợp → đề xuất bổ sung vào Design System trước, không "vá tạm" trực tiếp trong trang.

## Quan hệ với `/design-system` ở gốc repo

Sprint trước đã tạo `voduongai/design-system/` (thư mục gốc dự án) chứa các tài liệu ban đầu: `DESIGN_DOCTRINE.md`, `DESIGN_REFERENCE_GUIDE.md`, `GARDEN_DESIGN_SPEC.md`, `MOTION_SYSTEM.md`, `COLOR_SYSTEM.md`, `COMPONENT_RULES.md`. `src/design-system/` (thư mục này) là **cấu trúc chính thức và đầy đủ hơn**, kế thừa toàn bộ nội dung đó và mở rộng thêm Typography/Spacing/Icons/Layout/Patterns. Nội dung liên quan đã được đưa vào đúng thư mục con tương ứng (xem `docs/MIGRATION_NOTE.md`). Thư mục gốc `voduongai/design-system/` được giữ nguyên làm bản lưu trữ, không phát triển thêm — mọi cập nhật mới từ nay áp dụng vào `src/design-system/`.
