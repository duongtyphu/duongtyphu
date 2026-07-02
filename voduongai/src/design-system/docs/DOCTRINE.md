# Design Doctrine

> "Design Reference is the source of visual truth."

Đây là bản chính thức của Doctrine, áp dụng cho toàn bộ `src/design-system/`. Nội dung kế thừa từ `voduongai/design-system/docs/DESIGN_DOCTRINE.md` (bản gốc giữ nguyên làm lưu trữ).

## Nguyên tắc cốt lõi

1. VO DUONG AI không thiết kế theo từng trang rời rạc — mọi giao diện thuộc về một hệ thống chung (xem `01-foundation/`).
2. Mỗi thiết kế phải tuân theo Design System này. Ngoại lệ phải được ghi thành Design Spec riêng (`10-reference/`), không được ứng biến ngầm trong code.
3. Nếu Founder đã duyệt Design Reference, phải tái hiện gần nhất có thể.
4. Không redesign nếu không được yêu cầu.
5. Không thay đổi bố cục, cảm xúc, màu sắc chính, nhịp điệu thị giác của reference.
6. Chỉ được tối ưu responsive, accessibility, performance và chất lượng code.

## Quy trình làm việc chuẩn (xem thêm `README.md` mục Workflow)

1. Đọc `01-foundation/` trước khi bắt đầu bất kỳ task thiết kế nào.
2. Kiểm tra `10-reference/` xem đã có Design Reference cho khu vực này chưa.
3. Có reference → tái hiện đúng theo spec, chỉ tối ưu kỹ thuật.
4. Chưa có reference → dùng token (`02`–`06`) + component có sẵn (`07`) + layout có sẵn (`08`), không tự sáng tạo giá trị mới ngoài hệ thống.
5. Thiếu token/component/layout phù hợp → đề xuất bổ sung Design System trước, không vá tạm trong trang.

## Sprint xây nền móng vs sprint code UI

Khi một sprint được giao để "thiết lập Design System" / "xây nền móng", sprint đó **chỉ viết tài liệu và token**, không đụng vào UI đang chạy (Portal, Garden, Companion...) trừ khi được yêu cầu rõ ràng ở sprint riêng.
