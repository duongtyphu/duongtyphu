# Design Reference Guide

Hướng dẫn cách lưu trữ và sử dụng ảnh Design Reference đã được Founder duyệt.

## 1. Khi có ảnh reference mới đã được duyệt

- Lưu file ảnh vào: `/design-system/design-references/`
- Đặt tên rõ ràng theo mẫu `<khu-vực>-reference-v<số>.png`, ví dụ:
  - `garden-reference-v1.png`
  - `companion-reference-v1.png`
  - `ai-space-reference-v1.png`
  - `library-reference-v1.png`
  - `premium-reference-v1.png`
- Nếu có nhiều phiên bản cho cùng một khu vực (v1, v2, v3...), **giữ lại tất cả** — không ghi đè. Version mới nhất là bản có số lớn nhất, nhưng version cũ vẫn cần lưu để tra cứu lịch sử quyết định thiết kế.
- Nếu một khu vực có nhiều reference cùng lúc (ví dụ reference #1 cho bố cục, reference #2 cho phong cách chữ), đặt hậu tố mô tả: `garden-reference-v1-layout.png`, `garden-reference-v1-typography.png`.

## 2. Khi bắt đầu code một khu vực có reference

Trước khi viết bất kỳ dòng JSX/CSS nào cho khu vực đó:

1. Mở ảnh reference tương ứng trong `/design-system/design-references/`.
2. Đọc Design Spec tương ứng trong `/design-system/docs/` (nếu có) — ví dụ `GARDEN_DESIGN_SPEC.md` cho Khu vườn của bạn.
3. Xác định rõ:
   - Bố cục chính (mấy cột, tỷ lệ bao nhiêu, thứ tự đọc)
   - Vị trí của các khối visual chính (hero, hình minh họa, card)
   - Tông màu và hướng gradient
   - Cảm xúc tổng thể (ấm áp, tối giản, sang trọng, bình yên, năng động...)

## 3. Trong lúc code — những điều KHÔNG được làm

- Không tự sáng tạo lại bố cục khác với reference.
- Không đổi cảm xúc thiết kế (ví dụ: reference ấm áp/tự nhiên → không được làm thành lạnh/công nghệ).
- Không đổi tỷ lệ chính (ví dụ: reference chia 35/65 → không tự ý đổi thành 50/50).
- Không đổi hướng màu (ví dụ: reference xanh→tím→cam → không đổi thành xanh→hồng).
- Không đổi vị trí của visual chính (ví dụ: cây lớn bên phải → không đổi sang bên trái).
- Không dùng lại style/pattern cũ nếu một reference mới đã được duyệt để thay thế nó.

## 4. Những điều ĐƯỢC PHÉP cải thiện tự do

- Responsive (cách bố cục co giãn trên tablet/mobile — miễn giữ đúng tinh thần).
- Accessibility (contrast màu chữ, focus state, alt text, semantic HTML).
- Performance (animation nhẹ, ảnh tối ưu, giảm re-render không cần thiết).
- Animation nhẹ bổ sung (miễn tuân theo `MOTION_SYSTEM.md`).
- Component reuse / tách nhỏ code cho dễ bảo trì — miễn kết quả hiển thị giống hệt.

## 5. Khi chưa có reference cho một khu vực

Nếu Founder yêu cầu một thiết kế mới mà chưa có ảnh reference nào được duyệt:

- Hỏi rõ Founder có concept/ảnh tham khảo nào muốn dùng không, trước khi tự đề xuất.
- Nếu Founder xác nhận "cứ tự thiết kế", vẫn phải tuân theo `COLOR_SYSTEM.md`, `MOTION_SYSTEM.md` và `COMPONENT_RULES.md` chung của Portal.
- Sau khi thiết kế được duyệt, lưu lại ảnh/screenshot vào `/design-system/design-references/` để trở thành reference chính thức cho các lần chỉnh sửa sau.
